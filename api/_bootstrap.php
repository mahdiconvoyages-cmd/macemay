<?php
declare(strict_types=1);

function macemay_config(): array
{
    $config = [
        'mollie_api_key' => getenv('MOLLIE_API_KEY') ?: '',
        'admin_api_token' => getenv('MACEMAY_ADMIN_API_TOKEN') ?: '',
        'currency' => getenv('MACEMAY_CURRENCY') ?: 'EUR',
        'public_base_url' => getenv('MACEMAY_PUBLIC_BASE_URL') ?: 'https://macemaycustom.fr',
    ];

    $localConfigFile = __DIR__ . '/config.local.php';
    if (is_file($localConfigFile)) {
        $localConfig = require $localConfigFile;
        if (is_array($localConfig)) {
            $config = array_merge($config, $localConfig);
        }
    }

    return $config;
}

function macemay_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function macemay_base_url(array $config = []): string
{
    $configuredBaseUrl = trim((string)($config['public_base_url'] ?? ''));
    if ($configuredBaseUrl !== '') {
        return rtrim($configuredBaseUrl, '/');
    }

    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/api'));
    $basePath = preg_replace('#/api$#', '', $scriptDir) ?: '';
    $basePath = rtrim($basePath, '/');

    return $scheme . '://' . $host . $basePath;
}

function macemay_orders_dir(): string
{
    $dir = __DIR__ . '/../data/orders';
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        macemay_json_response(['error' => 'Impossible de creer le dossier des commandes'], 500);
    }
    return $dir;
}

function macemay_clean_order_id(string $orderId): string
{
    return preg_replace('/[^A-Za-z0-9_-]/', '', $orderId) ?: '';
}

function macemay_order_file(string $orderId): string
{
    $safeId = macemay_clean_order_id($orderId);
    if ($safeId === '') {
        macemay_json_response(['error' => 'Numero de commande invalide'], 400);
    }
    return macemay_orders_dir() . '/' . $safeId . '.json';
}

function macemay_save_order(array $order): void
{
    $orderId = (string)($order['id'] ?? '');
    $file = macemay_order_file($orderId);
    file_put_contents($file, json_encode($order, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function macemay_load_order(string $orderId): ?array
{
    $file = macemay_order_file($orderId);
    if (!is_file($file)) {
        return null;
    }
    $decoded = json_decode((string)file_get_contents($file), true);
    return is_array($decoded) ? $decoded : null;
}

function macemay_list_orders(): array
{
    $files = glob(macemay_orders_dir() . '/*.json') ?: [];
    $orders = [];
    foreach ($files as $file) {
        $order = json_decode((string)file_get_contents($file), true);
        if (is_array($order)) {
            $orders[] = $order;
        }
    }

    usort($orders, static function (array $a, array $b): int {
        return strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? ''));
    });

    return $orders;
}

function macemay_find_order_by_payment(string $paymentId): ?array
{
    foreach (macemay_list_orders() as $order) {
        if (($order['molliePaymentId'] ?? '') === $paymentId) {
            return $order;
        }
    }
    return null;
}

function macemay_is_payable_plate_item(array $item): bool
{
    if (($item['type'] ?? '') === 'plaque') {
        return true;
    }

    $details = is_array($item['details'] ?? null) ? $item['details'] : [];
    return trim((string)($item['immatriculation'] ?? '')) !== ''
        || trim((string)($details['immat'] ?? '')) !== '';
}

function macemay_normalize_items(array $items): array
{
    if (!$items) {
        macemay_json_response(['error' => 'Panier vide'], 400);
    }

    $normalized = [];
    $total = 0.0;

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        if (!macemay_is_payable_plate_item($item)) {
            macemay_json_response(['error' => 'Seules les plaques sont payables en ligne'], 400);
        }

        $quantity = max(1, min(99, (int)($item['quantity'] ?? 1)));
        $price = round(max(0, (float)($item['price'] ?? 0)), 2);
        $lineTotal = round($price * $quantity, 2);
        $total += $lineTotal;

        $normalized[] = [
            'id' => (string)($item['id'] ?? ('item_' . bin2hex(random_bytes(4)))),
            'type' => (string)($item['type'] ?? 'produit'),
            'name' => substr((string)($item['name'] ?? 'Article Macemay custom'), 0, 180),
            'details' => is_array($item['details'] ?? null) ? $item['details'] : [],
            'price' => $price,
            'quantity' => $quantity,
            'lineTotal' => $lineTotal,
        ];
    }

    if (!$normalized || $total <= 0) {
        macemay_json_response(['error' => 'Montant de commande invalide'], 400);
    }

    return ['items' => $normalized, 'total' => round($total, 2)];
}

function macemay_mollie_request(string $method, string $path, ?array $payload, string $apiKey): array
{
    if (!function_exists('curl_init')) {
        macemay_json_response(['error' => 'Extension PHP cURL indisponible'], 500);
    }

    $ch = curl_init('https://api.mollie.com/v2/' . ltrim($path, '/'));
    $headers = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 20,
    ]);

    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    $body = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        macemay_json_response(['error' => 'Erreur reseau Mollie: ' . $curlError], 502);
    }

    $decoded = json_decode((string)$body, true);
    if (!is_array($decoded)) {
        macemay_json_response(['error' => 'Reponse Mollie illisible'], 502);
    }

    if ($httpCode >= 400) {
        macemay_json_response([
            'error' => $decoded['detail'] ?? $decoded['title'] ?? 'Erreur Mollie',
            'mollie' => $decoded,
        ], 502);
    }

    return $decoded;
}

function macemay_require_admin_token(array $config): void
{
    $expected = trim((string)($config['admin_api_token'] ?? ''));
    if ($expected === '') {
        macemay_json_response(['error' => 'Jeton admin API non configure'], 500);
    }

    $provided = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ($_GET['token'] ?? '');
    if (!hash_equals($expected, (string)$provided)) {
        macemay_json_response(['error' => 'Acces admin refuse'], 401);
    }
}
