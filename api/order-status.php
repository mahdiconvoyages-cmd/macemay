<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

$orderId = (string)($_GET['order'] ?? $_GET['id'] ?? '');
$order = $orderId !== '' ? macemay_load_order($orderId) : null;

if (!$order) {
    macemay_json_response(['error' => 'Commande introuvable'], 404);
}

$publicItems = array_map(static function (array $item): array {
    $details = is_array($item['details'] ?? null) ? $item['details'] : [];
    unset($details['decorImageData']);

    return [
        'name' => $item['name'] ?? 'Article',
        'quantity' => $item['quantity'] ?? 1,
        'price' => $item['price'] ?? 0,
        'details' => $details,
    ];
}, is_array($order['items'] ?? null) ? $order['items'] : []);

macemay_json_response([
    'id' => $order['id'] ?? $orderId,
    'status' => $order['status'] ?? 'pending',
    'paymentProvider' => $order['paymentProvider'] ?? 'Mollie',
    'paymentId' => $order['paymentId'] ?? '',
    'total' => $order['total'] ?? 0,
    'currency' => $order['currency'] ?? 'EUR',
    'date' => $order['date'] ?? '',
    'items' => $publicItems,
]);
