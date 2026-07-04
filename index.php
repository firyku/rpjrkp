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

$cacheVersion = 'apdi-9';
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
?>
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($appTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://unpkg.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/styles.css?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>">
    <?php if (!$isLoggedIn): ?>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <?php endif; ?>
  </head>
  <body data-current-view="<?= htmlspecialchars($currentView, ENT_QUOTES, 'UTF-8') ?>">
    <?php if (!$isLoggedIn): ?>
    <main class="login-page">
      <section class="login-card">
        <a class="brand login-brand" href="#" aria-label="Aplikasi Perencanaan Desa">
          <span class="brand-mark"><i data-lucide="leaf"></i></span>
          <span>Aplikasi Perencanaan Desa</span>
        </a>
        <span class="pill-label">Sistem Desa</span>
        <h1>Login Sistem</h1>
        <p>Masuk untuk menampilkan sidebar dan mengelola Dashboard, RPJMDesa, RKPDesa, serta APBDesa.</p>
        <?php if ($loginError !== ''): ?>
        <div class="login-alert" role="alert"><?= htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endif; ?>
        <form method="post" class="login-form">
          <input type="hidden" name="action" value="login">
          <label class="form-field">
            <span>Username</span>
            <input type="text" name="username" placeholder="Masukkan username" autocomplete="username" required>
          </label>
          <label class="form-field">
            <span>Password</span>
            <input type="password" name="password" placeholder="Masukkan password" autocomplete="current-password" required>
          </label>
          <div class="turnstile-wrap">
            <span>Verifikasi Cloudflare</span>
            <div class="cf-turnstile" data-sitekey="<?= htmlspecialchars($turnstileSiteKey, ENT_QUOTES, 'UTF-8') ?>" data-theme="light"></div>
          </div>
          <button class="btn btn-primary" type="submit">
            <i data-lucide="log-in"></i>
            Login Sistem
          </button>
          <small class="login-hint">Demo lokal: username <b>admin</b>, password <b>admin123</b>.</small>
        </form>
      </section>
    </main>
    <?php else: ?>
    <div class="app-layout">
      <aside class="sidebar" aria-label="Navigasi utama">
        <a class="brand" href="#overview" aria-label="Aplikasi Perencanaan Desa">
          <span class="brand-mark"><i data-lucide="leaf"></i></span>
          <span>Aplikasi Perencanaan Desa</span>
        </a>

        <div class="notice-card">
          <span>APDI</span>
          <strong>Aplikasi Perencanaan Desa Terintegrasi</strong>
        </div>

        <nav class="side-nav">
          <a class="<?= $currentView === 'dashboard' ? 'active' : '' ?>" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview" data-view="dashboard"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
          <a class="<?= $currentView === 'rpjmdesa' ? 'active' : '' ?>" href="?view=rpjmdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="rpjmdesa"><i data-lucide="map"></i><span>RPJMDesa</span></a>
          <a class="<?= $currentView === 'rkpdesa' ? 'active' : '' ?>" href="?view=rkpdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="rkpdesa"><i data-lucide="clipboard-check"></i><span>RKPDesa</span></a>
          <a class="<?= $currentView === 'apbdesa' ? 'active' : '' ?>" href="?view=apbdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="apbdesa"><i data-lucide="landmark"></i><span>APBDesa</span></a>
        </nav>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <label class="search-field">
            <i data-lucide="search"></i>
            <input id="activitySearch" type="search" placeholder="Cari dokumen, program, lokasi" aria-label="Cari dokumen">
          </label>
          <button class="icon-btn" type="button" aria-label="Notifikasi" data-bs-toggle="tooltip" data-bs-title="Notifikasi">
            <i data-lucide="bell"></i>
            <span class="notif-dot"></span>
          </button>
          <button class="task-button" type="button" aria-label="Catatan kegiatan">
            <i data-lucide="clipboard-list"></i>
            <span id="taskCount">0</span>
          </button>
          <a class="btn btn-outline-primary logout-button" href="?action=logout">
            <i data-lucide="log-out"></i>
            Keluar
          </a>
        </header>

      <?php if (!$isAdminView): ?>
      <div id="dashboardView">
      <section class="hero-band" id="overview">
        <div class="hero-copy">
          <span class="pill-label">Aplikasi Perencanaan Desa Terintegrasi (APDI)</span>
          <h1>Kelola Perencanaan Desa Dalam Satu Sistem</h1>
          <div class="hero-intro-copy">
            <p class="highlight">Rumah Aplikasi Desa adalah salah satu Pegiat yang fokus mengembangkan Aplikasi sederhana untuk mempermudah kerja-kerja cepat yang efektif, efisien dan akurat dalam rangka pengabdiannya untuk bersama-sama bagian dari kemajuan dan kemandirian Desa. Banyak Aplikasi yang di buat oleh Rumah Aplikasi Desa sangat sederhana, sesuai dengan masukan dari kepala desa, perangkat desa dan pelaku desa lain, sehingga harapannya dapat mudah di gunakan oleh Kepala Desa, Perangkat Desa, Pendamping Desa dan pihak desa lain.</p>
            <p>Ketentuan Umum dalam Peraturan Menteri Desa, PDTI Nomor 21 Tahun 2020 tentang Pedoman Umum Pembangunan Desa dan Pemberdayaan Masyarakat Desa, yang dimaksud Pembangunan Desa adalah upaya peningkatan kualitas hidup dan kehidupan untuk sebesar-besarnya kemakmuran masyarakat desa. Maka sesuai pasal 14, Pembangunan Desa dilaksanakan dengan tahapan: 1). Pendataan Desa; 2). Perencanaan Pembangunan Desa; 3). pelaksanaan Pembangunan Desa; dan 4). pertanggungjawaban Pembangunan Desa.</p>
            <p>Sebagai implementasi point di atas, langkah awal pembangunan Desa diharuskan memiliki Perencanaan Pembangunan Desa yang disusun oleh Pemerintah Desa sesuai dengan Kewenangan Desa berdasarkan hak asal-usul dan kewenangan berskala lokal Desa dengan mengacu pada perencanaan pembangunan kabupaten/kota dengan melibatkan unsur masyarakat desa.</p>
            <p>Muatan perencanaan Desa yang akan disusun pada Aplikasi ini adalah Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) seperti yang tersurat dalam Peraturan Menteri Desa, PDTI Nomor 21 Tahun 2020 tentang Pedoman Umum Pembangunan Desa dan Pemberdayaan Masyarakat Desa, Pembangunan Desa pada Bagian Ketiga yang mengatur tata cara penyusunan dokumen perencanaan pembangunan Desa yang diupayakan untuk pencapaian SDGs Desa.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#inputDataDesa">
              <i data-lucide="badge-check"></i>
              Input Data Desa
            </a>
            <button class="btn btn-warning" type="button">
              <i data-lucide="bar-chart-3"></i>
              Statistik Perencanaan
            </button>
          </div>
        </div>
        <div class="hero-media" aria-label="Banner APDI">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" alt="Pemandangan desa dan area persawahan">
          <div class="hero-stat">
            <strong>73</strong>
            <span>Dokumen aktif</span>
          </div>
        </div>
      </section>

      <section class="container-fluid dashboard-wrap">
        <section class="metric-grid" aria-label="Metrik perencanaan desa">
          <article class="metric-card">
            <span>Dokumen aktif</span>
            <strong>73</strong>
            <small><i data-lucide="trending-up"></i> 18 dokumen terverifikasi</small>
          </article>
          <article class="metric-card">
            <span>Program prioritas</span>
            <strong>28</strong>
            <small><i data-lucide="clipboard-check"></i> 9 perlu tindak lanjut</small>
          </article>
          <article class="metric-card">
            <span>Operator desa</span>
            <strong>74</strong>
            <small><i data-lucide="users"></i> 12 kelompok dampingan</small>
          </article>
          <article class="metric-card">
            <span>Verifikasi data</span>
            <strong>94,8%</strong>
            <small><i data-lucide="route"></i> 16 lokasi kegiatan</small>
          </article>
        </section>

        <section class="desa-input-panel" id="inputDataDesa" aria-live="polite">
          <div class="desa-input-header">
            <div>
              <p class="section-kicker">Input Data Desa</p>
              <h2>Form Data Umum Desa</h2>
              <p>Field mengikuti tabel <strong>Data Umum</strong> pada aplikasi Access RPJMDesa.</p>
            </div>
            <div class="desa-input-badge">
              <i data-lucide="database"></i>
              Tabel Access: Data Umum
            </div>
          </div>

          <form class="desa-data-form" id="desaDataForm" autocomplete="off">
            <label>
              <span>Desa</span>
              <input type="text" name="desa" value="Gudangharjo" required>
            </label>
            <label>
              <span>Kecamatan</span>
              <input type="text" name="kecamatan" value="Paranggupito" required>
            </label>
            <label>
              <span>Kabupaten</span>
              <input type="text" name="kabupaten" value="Wonogiri" required>
            </label>
            <label>
              <span>Provinsi</span>
              <input type="text" name="provinsi" value="Jawa Tengah" required>
            </label>
            <label>
              <span>Tahun Anggaran</span>
              <input type="text" name="tahun_anggaran" value="2026">
            </label>
            <label>
              <span>Tahun Berjalan</span>
              <input type="number" name="tahun_berjalan" value="2025">
            </label>
            <div class="span-2 desa-field-group">
              <span>Visi Desa</span>
              <div class="repeat-input-list" id="visiDesaList">
                <div class="repeat-input-row">
                  <b>1</b>
                  <input type="text" name="visi_desa_item[]" value="Gudangharjo Mandiri, berkelanjutan" required>
                  <button class="repeat-remove" type="button" data-remove-visi aria-label="Hapus visi desa"><i data-lucide="trash-2"></i></button>
                </div>
              </div>
              <button class="repeat-add" id="addVisiDesaItem" type="button"><i data-lucide="plus"></i>Tambah Visi Desa</button>
              <input type="hidden" name="visi_desa" value="Gudangharjo Mandiri, berkelanjutan">
            </div>
            <label class="span-2">
              <span>Misi Desa</span>
              <textarea name="misi_desa" rows="4">1. Mewujudkan tata kelola pemerintahan yang baik
2. Meningkatkan kualitas SDM masyarakat
3. Meningkatkan partisipasi semua masyarakat dalam pembangunan</textarea>
            </label>
            <label>
              <span>Nama Kepala Desa</span>
              <input type="text" name="nama_kepala_desa" value="SRIYONO">
            </label>
            <label>
              <span>Nama Sekretaris Desa</span>
              <input type="text" name="nama_sekretaris_desa" value="EDY RACHMAT CAHYONO">
            </label>
            <label>
              <span>Nama Ketua Tim</span>
              <input type="text" name="nama_ketua_tim" value="Fitriana">
            </label>
            <label>
              <span>Nama Ketua BPD</span>
              <input type="text" name="nama_ketua_bpd" value="Joko Ratmanto">
            </label>
            <label>
              <span>No SK Tim Penyusun</span>
              <input type="text" name="no_sk_tim_penyusun" value="5 Tahun 2025">
            </label>
            <label>
              <span>Jenis RPJMDes</span>
              <select name="jenis_rpjmdes">
                <option>Awal</option>
                <option selected>Perubahan</option>
              </select>
            </label>
            <label>
              <span>Perdes RPJMDesa</span>
              <input type="text" name="perdes_rpjmdesa" value="2 Tahun 2025">
            </label>
            <label>
              <span>Status Perdes RPJMDes</span>
              <select name="status_perdes_rpjmdes">
                <option>RANCANGAN PERATURAN DESA</option>
                <option selected>PERATURAN DESA</option>
              </select>
            </label>
            <label>
              <span>Tanggal Penyusunan RPJMDes</span>
              <input type="text" name="tanggal_penyusunan_rpjmdes" value="19 Mei 2025">
            </label>
            <label>
              <span>Tanggal Pengundangan Perdes RPJMDes</span>
              <input type="text" name="tanggal_pengundangan_perdes_rpjmdes" value="19 Juni 2025">
            </label>
            <label>
              <span>Alamat Desa</span>
              <input type="text" name="alamat_desa" value="Jl. Pantai Nampu Km.2">
            </label>
            <label>
              <span>Jumlah Dusun</span>
              <input type="number" name="jumlah_dusun" value="5">
            </label>
            <label>
              <span>Jumlah Kepala Keluarga (KK)</span>
              <input type="number" name="jumlah_kk" value="2500">
            </label>
            <label>
              <span>Jarak Ke Kabupaten</span>
              <input type="text" name="jarak_ke_kabupaten" value="30 Km">
            </label>
            <label>
              <span>Luas Wilayah (Ha)</span>
              <input type="text" name="luas_wilayah" value="60 Ha">
            </label>
            <label>
              <span>Jumlah RT</span>
              <input type="text" name="jumlah_rt" value="14">
            </label>
            <label>
              <span>Mata Pencaharian Terbanyak</span>
              <input type="text" name="mata_pencaharian" value="Bertani/beternak">
            </label>
            <label>
              <span>Agama Mayoritas</span>
              <input type="text" name="agama_mayoritas" value="Islam">
            </label>
            <label>
              <span>Komoditas Utama</span>
              <input type="text" name="komoditas_utama" value="Padi, Jagung, Kacang, Ubi-Ubian">
            </label>
            <div class="span-2 desa-field-group">
              <span>Batas Wilayah Desa</span>
              <div class="boundary-grid">
                <label>
                  <span>Utara</span>
                  <input type="text" name="batas_utara" value="Ketos">
                </label>
                <label>
                  <span>Timur</span>
                  <input type="text" name="batas_timur" value="Johunut">
                </label>
                <label>
                  <span>Selatan</span>
                  <input type="text" name="batas_selatan" value="Paranggupito">
                </label>
                <label>
                  <span>Barat</span>
                  <input type="text" name="batas_barat" value="Gendayakan">
                </label>
              </div>
              <input type="hidden" name="batas_wilayah" value="Utara: Ketos&#10;Timur: Johunut&#10;Selatan: Paranggupito&#10;Barat: Gendayakan">
            </div>
            <label class="span-2">
              <span>Profil Desa</span>
              <textarea name="profil_desa" rows="4">Desa Gudangharjo memiliki karakter wilayah pertanian dan perkebunan dengan komoditas utama padi, jagung, kacang, dan ubi-ubian.</textarea>
            </label>
            <label>
              <span>Logo Kementrian</span>
              <input type="file" name="logo_kementrian" accept="image/*">
            </label>
            <label>
              <span>Logo Kabupaten</span>
              <input type="file" name="logo_kabupaten" accept="image/*">
            </label>
            <label class="span-2">
              <span>Isian Tentang Perdes RPJMDesa</span>
              <textarea name="tentang_perdes_rpjmdes" rows="4">PERUBAHAN ATAS PERATURAN DESA NOMOR 3 TAHUN 2020 TENTANG RENCANA PEMBANGUNAN JANGKA MENENGAH DESA GUDANGHARJO KECAMATAN PARANGGUPITO TAHUN 2021 - 2028</textarea>
            </label>
            <div class="desa-form-actions span-2">
              <button class="btn btn-primary" type="submit"><i data-lucide="save"></i>Simpan Data Desa</button>
              <button class="btn btn-warning" type="reset"><i data-lucide="rotate-ccw"></i>Reset</button>
            </div>
          </form>

          <div class="desa-table-panel">
            <div class="desa-table-header">
              <h3>Data Desa berhasil diinput</h3>
              <button class="material-clear-table" id="clearDesaDataTable" type="button"><i data-lucide="trash-2"></i>Hapus Tabel</button>
            </div>
            <div class="material-table-wrap">
              <table class="material-result-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Desa</th>
                    <th>Kecamatan</th>
                    <th>Kabupaten</th>
                    <th>Tahun</th>
                    <th>Kepala Desa</th>
                    <th>Jenis RPJMDes</th>
                    <th>Status</th>
                    <th>Logo Kementrian</th>
                    <th>Logo Kabupaten</th>
                    <th>Waktu</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="desaDataRows">
                  <tr class="material-empty-row">
                    <td colspan="12">Belum ada Data Desa yang berhasil diinput.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="work-grid">
          <article class="panel sales-panel">
            <div class="panel-header">
              <div>
                <p class="section-kicker">Statistik dokumen</p>
                <h2>Perkembangan input perencanaan desa</h2>
              </div>
              <div class="segmented" role="group" aria-label="Periode grafik">
                <button class="active" type="button" data-range="daily">Hari</button>
                <button type="button" data-range="weekly">Minggu</button>
                <button type="button" data-range="monthly">Bulan</button>
              </div>
            </div>
            <div class="chart-area">
              <canvas id="harvestChart" aria-label="Grafik perkembangan dokumen"></canvas>
            </div>
          </article>

          <article class="panel pickup-panel" id="rkpdesa">
            <div class="panel-header">
              <div>
                <p class="section-kicker">Status dokumen</p>
                <h2>Komposisi verifikasi data</h2>
              </div>
              <button class="icon-btn soft" type="button" aria-label="Atur distribusi" data-bs-toggle="tooltip" data-bs-title="Atur distribusi">
                <i data-lucide="settings-2"></i>
              </button>
            </div>
            <div class="donut-area">
              <canvas id="distributionChart" aria-label="Grafik status dokumen"></canvas>
            </div>
            <div class="delivery-list">
              <span><b class="dot green"></b> Terverifikasi <strong>68%</strong></span>
              <span><b class="dot yellow"></b> Dalam Review <strong>21%</strong></span>
              <span><b class="dot orange"></b> Draft <strong>11%</strong></span>
            </div>
          </article>

          <aside class="side-stack" id="inventory">
            <article class="panel inventory-panel">
              <div class="panel-header">
                <div>
                  <p class="section-kicker">Kelengkapan</p>
                  <h2>Dokumen prioritas</h2>
                </div>
              </div>
              <div class="stock-list">
                <div>
                  <span>RPJMDesa</span>
                  <strong>18%</strong>
                  <div class="progress" role="progressbar" aria-label="Avocado stock" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar danger" style="width: 18%"></div>
                  </div>
                </div>
                <div>
                  <span>RKPDesa</span>
                  <strong>37%</strong>
                  <div class="progress" role="progressbar" aria-label="Almond stock" aria-valuenow="37" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar warning" style="width: 37%"></div>
                  </div>
                </div>
                <div>
                  <span>APBDesa</span>
                  <strong>64%</strong>
                  <div class="progress" role="progressbar" aria-label="Spinach stock" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar good" style="width: 64%"></div>
                  </div>
                </div>
              </div>
            </article>

            <article class="panel category-panel">
              <div class="panel-header">
                <div>
                  <p class="section-kicker">Menu Desa</p>
                  <h2>Menu sesuai sidebar</h2>
                </div>
              </div>
              <div class="category-grid">
                <a href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview" data-view="dashboard">
                  <i data-lucide="layout-dashboard"></i>
                  <span>Dashboard</span>
                </a>
                <a href="?view=rpjmdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="rpjmdesa">
                  <i data-lucide="map"></i>
                  <span>RPJMDesa</span>
                </a>
                <a href="?view=rkpdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="rkpdesa">
                  <i data-lucide="clipboard-check"></i>
                  <span>RKPDesa</span>
                </a>
                <a href="?view=apbdesa&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>" data-view="apbdesa">
                  <i data-lucide="landmark"></i>
                  <span>APBDesa</span>
                </a>
              </div>
            </article>

            <article class="promo-panel">
              <img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=900&q=80" alt="Kegiatan musyawarah dan pengelolaan desa">
              <div>
                <span>Agenda desa</span>
                <strong>Musyawarah dan verifikasi dokumen perencanaan</strong>
                <button class="btn btn-dark" type="button">Lihat Agenda</button>
              </div>
            </article>
          </aside>
        </section>
      </section>
      </div>
      <?php endif; ?>

      <?php if ($isAdminView): ?>
      <section class="material-admin-view" id="adminView" aria-live="polite" tabindex="-1">
        <aside class="material-sidebar">
          <div class="material-brand">
            <i data-lucide="atom"></i>
            <strong><?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?></strong>
          </div>
          <?php if ($currentView === 'rpjmdesa'): ?>
          <nav class="material-menu" aria-label="Sub menu <?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?>">
            <a class="material-menu-root" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>

            <details class="material-menu-group" open>
              <summary><i data-lucide="database"></i><span>Input Data</span></summary>
              <div class="material-submenu">
                <a class="baru" href="#materialAutoForm" data-material-form="input_daftar_isi">Input Daftar Isi</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_data_umum">Input Data Umum</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_misi_desa">Input Misi Desa</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_sejarah_desa">Input Profil Desa</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_rktl">Input RKTL</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_musdes">Input Musdes</a>
                <a class="baru" href="#materialAutoForm" data-material-form="input_data_penting">Input Data Penting</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="clipboard-list"></i><span>Input Perencanaan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="input_renc_pendapatan">Input Renc Pendapatan</a>
                <a href="#materialAutoForm" data-material-form="input_matrik">Input Matrik</a>
                <a href="#materialAutoForm" data-material-form="input_musdus_kelompok">Mudus/Kelompok</a>
                <a href="#materialAutoForm" data-material-form="program_masuk_desa">Program Masuk Desa</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="sliders-horizontal"></i><span>Olah Data Perencanaan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="input_rekomendasi_sdgs">Input Rekomendasi SDGs</a>
                <a href="#materialAutoForm" data-material-form="input_prioritas">Input Penentuan/Prioritas</a>
                <a href="#materialAutoForm" data-material-form="inventaris_masalah">Inventaris Masalah</a>
                <a href="#materialAutoForm" data-material-form="inventaris_potensi">Inventaris Potensi</a>
                <a href="#materialAutoForm" data-material-form="gagasan_dusun">Gagasan Dusun/Kelompok</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="users-round"></i><span>Tim Penyusun</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="tim_penyusun">Susunan Tim Penyusun</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="scroll-text"></i><span>Dasar Hukum</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="dasar_hukum_perdes">Input Dasar Hukum Perdes</a>
                <a href="#materialAutoForm" data-material-form="dasar_hukum_sk">Input Dasar Hukum SK</a>
                <a href="#materialAutoForm" data-material-form="ketentuan_umum_perdes">Isi Ketentuan Umum Perdes</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="files"></i><span>Laporan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="cover">Cover</a>
                <a href="#materialAutoForm" data-material-form="cover_lampiran">Cover Lampiran</a>
                <a href="#materialAutoForm" data-material-form="dokumen_1">Dokumen 1</a>
                <a href="#materialAutoForm" data-material-form="dokumen_2">Dokumen 2</a>
                <a href="#materialAutoForm" data-material-form="perdes">Perdes</a>
                <a href="#materialAutoForm" data-material-form="ba_tim">BA Tim</a>
                <a href="#materialAutoForm" data-material-form="sk_tim">SK Tim</a>
                <a href="#materialAutoForm" data-material-form="daftar_hadir">Daftar Hadir</a>
                <a href="#materialAutoForm" data-material-form="peta_jalan_sdgs">Peta Jalan SDGs</a>
                <a href="#materialAutoForm" data-material-form="laporan_program_masuk_desa">Program Masuk Desa</a>
                <a href="#materialAutoForm" data-material-form="ba_musdus_kelompok">BA Musdus/Kelompok</a>
                <a href="#materialAutoForm" data-material-form="bagan_kelembagaan">Bagan Kelembagaan</a>
                <a href="#materialAutoForm" data-material-form="rancangan_rpjmdesa">Rancangan RPJMDesa</a>
                <a href="#materialAutoForm" data-material-form="dok_visi_misi_kades">Dok. Visi Misi Kades</a>
                <a href="#materialAutoForm" data-material-form="dok_pokok_pikiran_bpd">Dok. Pokok Pikiran BPD</a>
              </div>
            </details>
          </nav>
          <?php else: ?>
          <nav class="material-menu" aria-label="Sub menu <?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?>">
            <a href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
            <a href="#materialAutoForm" data-material-form="profile"><i data-lucide="user"></i><span>Profil Dokumen</span></a>
            <a href="#materialAutoForm" data-material-form="table"><i data-lucide="clipboard-list"></i><span>Daftar Program</span></a>
            <a href="#materialAutoForm" data-material-form="typography"><i data-lucide="file-text"></i><span>Bidang Kegiatan</span></a>
            <a href="#materialAutoForm" data-material-form="icons"><i data-lucide="share-2"></i><span>Indikator</span></a>
            <a href="#materialAutoForm" data-material-form="maps"><i data-lucide="map-pin"></i><span>Lokasi</span></a>
            <a href="#materialAutoForm" data-material-form="notifications"><i data-lucide="bell"></i><span>Notifikasi</span></a>
          </nav>
          <?php endif; ?>
          <a class="material-upgrade" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>">
            <i data-lucide="upload"></i>
            Kembali Dashboard
          </a>
        </aside>

        <div class="material-main">
          <header class="material-topbar">
            <h1 id="adminTitle"><?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?></h1>
            <div class="material-tools">
              <label>
                <input type="search" placeholder="Search">
                <button type="button" aria-label="Search"><i data-lucide="search"></i></button>
              </label>
              <button type="button" aria-label="Apps"><i data-lucide="layout-grid"></i></button>
              <button class="has-count" type="button" aria-label="Notifications"><i data-lucide="bell"></i><span>5</span></button>
              <button type="button" aria-label="User"><i data-lucide="user"></i></button>
            </div>
          </header>

          <section class="material-stat-grid">
            <article class="material-stat-card">
              <div class="material-icon orange"><i data-lucide="copy"></i></div>
              <div>
                <span>Total Dokumen</span>
                <strong id="adminTotalDocs"><?= htmlspecialchars($activeAdmin['total'], ENT_QUOTES, 'UTF-8') ?>/50</strong>
              </div>
              <small><i data-lucide="triangle-alert"></i> Lengkapi dokumen prioritas</small>
            </article>
            <article class="material-stat-card">
              <div class="material-icon green"><i data-lucide="store"></i></div>
              <div>
                <span>Terverifikasi</span>
                <strong id="adminVerifiedDocs"><?= htmlspecialchars($activeAdmin['verified'], ENT_QUOTES, 'UTF-8') ?></strong>
              </div>
              <small><i data-lucide="calendar-days"></i> Last 24 Hours</small>
            </article>
            <article class="material-stat-card">
              <div class="material-icon red"><i data-lucide="info"></i></div>
              <div>
                <span>Menunggu Review</span>
                <strong id="adminReviewDocs"><?= htmlspecialchars($activeAdmin['review'], ENT_QUOTES, 'UTF-8') ?></strong>
              </div>
              <small><i data-lucide="tag"></i> Tracked from Github</small>
            </article>
            <article class="material-stat-card">
              <div class="material-icon cyan"><i data-lucide="accessibility"></i></div>
              <div>
                <span>Operator Aktif</span>
                <strong>+245</strong>
              </div>
              <small><i data-lucide="refresh-cw"></i> Just Updated</small>
            </article>
          </section>

          <section class="material-chart-grid">
            <article class="material-chart-card">
              <div class="material-chart green">
                <svg viewBox="0 0 360 180" aria-hidden="true">
                  <polyline points="10,135 55,115 105,150 155,115 210,92 265,114 320,36" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                  <g fill="rgba(255,255,255,.9)">
                    <circle cx="10" cy="135" r="8"/><circle cx="55" cy="115" r="8"/><circle cx="105" cy="150" r="8"/><circle cx="155" cy="115" r="8"/><circle cx="210" cy="92" r="8"/><circle cx="265" cy="114" r="8"/><circle cx="320" cy="36" r="8"/>
                  </g>
                </svg>
              </div>
              <h2>Progres Perencanaan</h2>
              <p><i data-lucide="arrow-up"></i> 55% peningkatan input hari ini.</p>
              <small><i data-lucide="clock"></i> diperbarui 4 menit lalu</small>
            </article>
            <article class="material-chart-card">
              <div class="material-chart orange">
                <svg viewBox="0 0 360 180" aria-hidden="true">
                  <g fill="rgba(255,255,255,.88)">
                    <rect x="18" y="70" width="14" height="82"/><rect x="46" y="88" width="14" height="64"/><rect x="74" y="110" width="14" height="42"/><rect x="102" y="36" width="14" height="116"/><rect x="130" y="68" width="14" height="84"/><rect x="158" y="86" width="14" height="66"/><rect x="186" y="108" width="14" height="44"/><rect x="214" y="90" width="14" height="62"/><rect x="242" y="65" width="14" height="87"/><rect x="270" y="55" width="14" height="97"/><rect x="298" y="40" width="14" height="112"/><rect x="326" y="16" width="14" height="136"/>
                  </g>
                </svg>
              </div>
              <h2>Dokumen Terinput</h2>
              <p>Rekap dokumen berdasarkan tahapan verifikasi.</p>
              <small><i data-lucide="clock"></i> diperbarui 2 hari lalu</small>
            </article>
            <article class="material-chart-card">
              <div class="material-chart red">
                <svg viewBox="0 0 360 180" aria-hidden="true">
                  <polyline points="20,130 70,35 120,92 170,120 220,126 270,137 320,142" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                  <g fill="rgba(255,255,255,.9)">
                    <circle cx="20" cy="130" r="8"/><circle cx="70" cy="35" r="8"/><circle cx="120" cy="92" r="8"/><circle cx="170" cy="120" r="8"/><circle cx="220" cy="126" r="8"/><circle cx="270" cy="137" r="8"/><circle cx="320" cy="142" r="8"/>
                  </g>
                </svg>
              </div>
              <h2>Kegiatan Selesai</h2>
              <p>Program yang sudah dilengkapi data pendukung.</p>
              <small><i data-lucide="clock"></i> diperbarui 2 hari lalu</small>
            </article>
          </section>

          <section class="material-form-panel" id="materialAutoForm" aria-live="polite">
            <div class="material-form-header">
              <div class="material-form-icon"><i id="materialFormIcon" data-lucide="layout-dashboard"></i></div>
              <div>
                <span id="materialFormKicker"><?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?></span>
                <h2 id="materialFormHeading">Form Dashboard <?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?></h2>
                <p id="materialFormDescription">Klik menu sidebar samping untuk membuat form sesuai kebutuhan modul.</p>
              </div>
            </div>
            <form class="material-auto-form" id="materialAutoFormFields" autocomplete="off"></form>
          </section>

          <section class="material-result-panel" aria-live="polite">
            <div class="material-result-header">
              <div>
                <span>Data Tersimpan</span>
                <h2>Tabel yang berhasil di input</h2>
                <p>Setiap data dari form otomatis masuk ke tabel ini setelah tombol Simpan Data ditekan.</p>
              </div>
              <button class="material-clear-table" id="clearMaterialTable" type="button">
                <i data-lucide="trash-2"></i>
                Hapus Tabel
              </button>
            </div>
            <div class="material-table-wrap">
              <table class="material-result-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Modul</th>
                    <th>Form</th>
                    <th>Ringkasan Input</th>
                    <th>Status</th>
                    <th>Waktu</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="materialResultRows">
                  <tr class="material-empty-row">
                    <td colspan="7">Belum ada data yang berhasil di input.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
      <?php endif; ?>
      </main>
    </div>
    <?php endif; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <script src="assets/app.js?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>"></script>
  </body>
</html>
