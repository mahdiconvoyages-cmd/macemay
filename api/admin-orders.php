<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

$config = macemay_config();
macemay_require_admin_token($config);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $orderId = (string)($_GET['order'] ?? $_GET['id'] ?? '');
    $file = $orderId !== '' ? macemay_order_file($orderId) : '';
    if ($file !== '' && is_file($file)) {
        unlink($file);
    }
    macemay_json_response(['ok' => true]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    macemay_json_response(['error' => 'Methode non autorisee'], 405);
}

macemay_json_response(['orders' => macemay_list_orders()]);
