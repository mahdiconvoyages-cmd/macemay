<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

$config = macemay_config();
$apiKey = trim((string)($config['mollie_api_key'] ?? ''));
if ($apiKey === '') {
    http_response_code(500);
    echo 'missing_api_key';
    exit;
}

$paymentId = (string)($_POST['id'] ?? ($_GET['id'] ?? ''));
if ($paymentId === '') {
    http_response_code(200);
    echo 'missing_payment_id';
    exit;
}

$payment = macemay_mollie_request('GET', 'payments/' . rawurlencode($paymentId), null, $apiKey);
$orderId = (string)($payment['metadata']['order_id'] ?? '');
$order = $orderId !== '' ? macemay_load_order($orderId) : macemay_find_order_by_payment($paymentId);

if (!$order) {
    http_response_code(200);
    echo 'order_not_found';
    exit;
}

$status = (string)($payment['status'] ?? 'unknown');
$order['molliePaymentId'] = $paymentId;
$order['paymentId'] = $paymentId;
$order['mollieStatus'] = $status;
$order['status'] = $status === 'paid' ? 'paid' : $status;
$order['updatedAt'] = date('c');
$order['mollieMethod'] = $payment['method'] ?? '';

if ($status === 'paid') {
    $order['paidAt'] = date('c');
}

macemay_save_order($order);

http_response_code(200);
echo 'ok';
