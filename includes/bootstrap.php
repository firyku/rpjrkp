<?php
session_start();

$appTitle = 'Aplikasi Perencanaan Desa';
$isLoggedIn = $_SESSION['is_logged_in'] ?? false;
$loginError = '';
$turnstileSiteKey = '1x00000000000000000000AA';
$turnstileSecretKey = '1x0000000000000000000000000000000AA';

function verifyTurnstile(string $token, string $secretKey): bool
{
    if (in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1'], true) && $token !== '') {
        return true;
    }

    if ($token === '') {
        return false;
    }

    $payload = http_build_query([
        'secret' => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $response = false;

    if (function_exists('curl_init')) {
        $curl = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $response = curl_exec($curl);
        curl_close($curl);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $payload,
                'timeout' => 8,
            ],
        ]);
        $response = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
    }

    if ($response === false) {
        return false;
    }

    $result = json_decode($response, true);
    return (bool) ($result['success'] ?? false);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $turnstileToken = $_POST['cf-turnstile-response'] ?? '';

    if ($username !== 'admin' || $password !== 'admin123') {
        $loginError = 'Username atau password tidak sesuai.';
    } elseif (!verifyTurnstile($turnstileToken, $turnstileSecretKey)) {
        $loginError = 'Verifikasi Cloudflare belum berhasil.';
    } else {
        $_SESSION['is_logged_in'] = true;
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    }
}

if (($_GET['action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

$cacheVersion = 'apdi-28';
$adminPages = [
    'rpjmdesa' => [
        'title' => 'RPJMDesa',
        'subtitle' => 'Form pengelolaan Rencana Pembangunan Jangka Menengah Desa.',
        'formTitle' => 'Form RPJMDesa',
        'docName' => 'RPJMDesa 2026-2031',
        'year' => '2026-2031',
        'total' => '24',
        'review' => '6',
        'verified' => '18',
        'description' => 'Penguatan program prioritas desa berbasis kebutuhan masyarakat dan data musyawarah desa.',
    ],
    'rkpdesa' => [
        'title' => 'RKPDesa',
        'subtitle' => 'Form pengelolaan Rencana Kerja Pemerintah Desa tahunan.',
        'formTitle' => 'Form RKPDesa',
        'docName' => 'RKPDesa Tahun 2026',
        'year' => '2026',
        'total' => '18',
        'review' => '4',
        'verified' => '14',
        'description' => 'Penyusunan kegiatan tahunan desa berdasarkan pagu indikatif dan prioritas hasil musyawarah.',
    ],
    'apbdesa' => [
        'title' => 'APBDesa',
        'subtitle' => 'Form pengelolaan Anggaran Pendapatan dan Belanja Desa.',
        'formTitle' => 'Form APBDesa',
        'docName' => 'APBDesa Tahun Anggaran 2026',
        'year' => '2026',
        'total' => '31',
        'review' => '8',
        'verified' => '23',
        'description' => 'Penganggaran pendapatan, belanja, dan pembiayaan desa sesuai dokumen perencanaan.',
    ],
];
$currentView = $_GET['view'] ?? 'dashboard';
if ($currentView !== 'dashboard' && !array_key_exists($currentView, $adminPages)) {
    $currentView = 'dashboard';
}
$activeAdmin = $adminPages[$currentView] ?? $adminPages['rpjmdesa'];
$isAdminView = $currentView !== 'dashboard';
