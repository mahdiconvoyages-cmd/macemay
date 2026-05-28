<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    macemay_json_response(['error' => 'Methode non autorisee'], 405);
}

$config = macemay_config();
$clientId = trim((string)($config['paypal_client_id'] ?? ''));
$clientSecret = trim((string)($config['paypal_client_secret'] ?? ''));
if ($clientId === '' || $clientSecret === '') {
    macemay_json_response(['error' => 'PayPal non configure sur le serveur'], 500);
}

$input = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($input)) {
    macemay_json_response(['error' => 'Requete JSON invalide'], 400);
}

$paypalOrderId = trim((string)($input['paypalOrderId'] ?? ''));
$orderId = trim((string)($input['orderId'] ?? ''));
if ($paypalOrderId === '') {
    macemay_json_response(['error' => 'Commande PayPal manquante'], 400);
}

$order = $orderId !== '' ? macemay_load_order($orderId) : macemay_find_order_by_payment($paypalOrderId);
if (!$order) {
    macemay_json_response(['error' => 'Commande introuvable'], 404);
}

$capture = macemay_paypal_request('POST', 'v2/checkout/orders/' . rawurlencode($paypalOrderId) . '/capture', [], $config);
$status = (string)($capture['status'] ?? '');

$payer = [];
$purchaseUnits = is_array($capture['purchase_units'] ?? null) ? $capture['purchase_units'] : [];
if ($purchaseUnits) {
    $payments = is_array($purchaseUnits[0]['payments'] ?? null) ? $purchaseUnits[0]['payments'] : [];
    $captures = is_array($payments['captures'] ?? null) ? $payments['captures'] : [];
    if ($captures) {
        $order['paypalCaptureId'] = (string)($captures[0]['id'] ?? '');
    }
}

if (is_array($capture['payer'] ?? null)) {
    $payer = $capture['payer'];
}

$order['paypalOrderId'] = $paypalOrderId;
$order['paymentId'] = $paypalOrderId;
$order['paypalStatus'] = $status;
$order['status'] = $status === 'COMPLETED' ? 'paid' : strtolower($status);
$order['updatedAt'] = date('c');
$order['payerEmail'] = (string)($payer['email_address'] ?? '');
$order['payerName'] = trim(((string)($payer['name']['given_name'] ?? '')) . ' ' . ((string)($payer['name']['surname'] ?? '')));

if ($status === 'COMPLETED') {
    $order['paidAt'] = date('c');
}

macemay_save_order($order);

macemay_json_response([
    'orderId' => (string)($order['id'] ?? ''),
    'status' => (string)($order['status'] ?? ''),
    'paypalStatus' => $status,
]);
