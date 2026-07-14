<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

if (!($_SESSION['is_logged_in'] ?? false)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Sesi login diperlukan.']);
    exit;
}

require dirname(__DIR__) . '/includes/database.php';

$userKey = 'admin';

try {
    $pdo = appDatabase();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $statement = $pdo->prepare('SELECT storage_key, storage_value FROM app_storage WHERE user_key = ?');
        $statement->execute([$userKey]);
        $items = [];
        foreach ($statement->fetchAll() as $row) {
            $items[$row['storage_key']] = $row['storage_value'];
        }
        echo json_encode(['ok' => true, 'items' => $items], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Metode tidak diizinkan.']);
        exit;
    }

    $payload = json_decode((string) file_get_contents('php://input'), true);
    $key = trim((string) ($payload['key'] ?? ''));
    $value = (string) ($payload['value'] ?? '');

    if ($key === '' || strlen($key) > 191 || !str_starts_with($key, 'rpjrkp-')) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'message' => 'Kunci penyimpanan tidak valid.']);
        exit;
    }

    $statement = $pdo->prepare(
        'INSERT INTO app_storage (user_key, storage_key, storage_value) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE storage_value = VALUES(storage_value), updated_at = CURRENT_TIMESTAMP'
    );
    $statement->execute([$userKey, $key, $value]);
    echo json_encode(['ok' => true]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Database tidak dapat diakses.']);
}
