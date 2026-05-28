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

$cart = macemay_normalize_boutique_items(is_array($input['items'] ?? null) ? $input['items'] : []);
$orderId = 'MB-' . date('Ymd-His') . '-' . strtoupper(bin2hex(random_bytes(3)));
$currency = strtoupper((string)($config['currency'] ?? 'EUR'));

$order = [
    'id' => $orderId,
    'date' => date('c'),
    'status' => 'pending',
    'paymentProvider' => 'PayPal',
    'paymentId' => '',
    'paypalOrderId' => '',
    'total' => $cart['total'],
    'currency' => $currency,
    'items' => $cart['items'],
];
macemay_save_order($order);

$paypalOrder = macemay_paypal_request('POST', 'v2/checkout/orders', [
    'intent' => 'CAPTURE',
    'purchase_units' => [macemay_build_paypal_purchase_unit($cart, $orderId, $currency)],
    'application_context' => [
        'brand_name' => 'Macemay custom',
        'locale' => 'fr-FR',
        'user_action' => 'PAY_NOW',
        'shipping_preference' => 'NO_SHIPPING',
    ],
], $config);

$paypalOrderId = (string)($paypalOrder['id'] ?? '');
if ($paypalOrderId === '') {
    $order['status'] = 'payment_error';
    $order['paypalResponse'] = $paypalOrder;
    macemay_save_order($order);
    macemay_json_response(['error' => 'PayPal n\'a pas renvoye de commande'], 502);
}

$order['paypalOrderId'] = $paypalOrderId;
$order['paymentId'] = $paypalOrderId;
$order['paypalStatus'] = (string)($paypalOrder['status'] ?? 'CREATED');
macemay_save_order($order);

macemay_json_response([
    'orderId' => $orderId,
    'paypalOrderId' => $paypalOrderId,
]);
