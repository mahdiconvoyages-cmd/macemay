<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    macemay_json_response(['error' => 'Methode non autorisee'], 405);
}

$config = macemay_config();
$apiKey = trim((string)($config['mollie_api_key'] ?? ''));
if ($apiKey === '') {
    macemay_json_response(['error' => 'Cle API Mollie manquante'], 500);
}

$input = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($input)) {
    macemay_json_response(['error' => 'Requete JSON invalide'], 400);
}

$cart = macemay_normalize_items(is_array($input['items'] ?? null) ? $input['items'] : []);
$orderId = 'MC-' . date('Ymd-His') . '-' . strtoupper(bin2hex(random_bytes(3)));
$currency = (string)($config['currency'] ?? 'EUR');
$baseUrl = macemay_base_url($config);
$totalValue = number_format($cart['total'], 2, '.', '');

$order = [
    'id' => $orderId,
    'date' => date('c'),
    'status' => 'pending',
    'paymentProvider' => 'Mollie',
    'paymentId' => '',
    'molliePaymentId' => '',
    'total' => $cart['total'],
    'currency' => $currency,
    'items' => $cart['items'],
];
macemay_save_order($order);

$paymentPayload = [
    'amount' => [
        'currency' => $currency,
        'value' => $totalValue,
    ],
    'description' => 'Commande Macemay custom ' . $orderId,
    'redirectUrl' => $baseUrl . '/paiement-retour.html?order=' . rawurlencode($orderId),
    'webhookUrl' => $baseUrl . '/api/mollie-webhook.php',
    'metadata' => [
        'order_id' => $orderId,
    ],
];

$payment = macemay_mollie_request('POST', 'payments', $paymentPayload, $apiKey);
$checkoutUrl = $payment['_links']['checkout']['href'] ?? '';
$paymentId = (string)($payment['id'] ?? '');

if ($checkoutUrl === '' || $paymentId === '') {
    $order['status'] = 'payment_error';
    $order['mollieResponse'] = $payment;
    macemay_save_order($order);
    macemay_json_response(['error' => 'Mollie n\'a pas renvoye de lien de paiement'], 502);
}

$order['paymentId'] = $paymentId;
$order['molliePaymentId'] = $paymentId;
$order['mollieCheckoutUrl'] = $checkoutUrl;
$order['mollieStatus'] = (string)($payment['status'] ?? 'open');
macemay_save_order($order);

macemay_json_response([
    'orderId' => $orderId,
    'paymentId' => $paymentId,
    'checkoutUrl' => $checkoutUrl,
]);
