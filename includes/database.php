<?php
declare(strict_types=1);

function appDatabase(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $configFile = __DIR__ . '/database.local.php';
    if (!is_file($configFile)) {
        throw new RuntimeException('Konfigurasi database belum tersedia.');
    }

    $config = require $configFile;
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['host'] ?? '127.0.0.1',
        $config['port'] ?? 3306,
        $config['database'] ?? ''
    );

    $pdo = new PDO($dsn, $config['username'] ?? '', $config['password'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS app_storage (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_key VARCHAR(100) NOT NULL,
            storage_key VARCHAR(191) NOT NULL,
            storage_value LONGTEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uq_user_storage (user_key, storage_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    return $pdo;
}
