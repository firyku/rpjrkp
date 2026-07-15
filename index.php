<?php require __DIR__ . '/includes/bootstrap.php'; ?>
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
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/style.css?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>">
    <link rel="stylesheet" href="assets/styles.css?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>">
    <?php if (!$isLoggedIn): ?>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <?php endif; ?>
  </head>
  <body data-current-view="<?= htmlspecialchars($currentView, ENT_QUOTES, 'UTF-8') ?>">
    <?php if (!$isLoggedIn): ?>
    <?php require __DIR__ . '/includes/login.php'; ?>
    <?php else: ?>
    <div class="app-layout">
      <?php require __DIR__ . '/includes/sidebar.php'; ?>

      <main class="main-content">
        <header class="topbar">
          <?php if ($isAdminView): ?>
          <a class="template-verify" href="#" aria-label="Verifikasi Email Anda">
            <i data-lucide="badge-alert"></i>
            <span>Verifikasi Email Anda</span>
          </a>
          <div class="template-account" aria-label="Akun pengguna">
            <i data-lucide="user-round"></i>
            <span>Desa Gendayakan, Kecamatan Paranggupito, Kabupaten Wonogiri</span>
            <i data-lucide="chevron-down"></i>
          </div>
          <?php elseif ($currentView === 'rkpdesa'): ?>
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
          <?php endif; ?>
        </header>

      <?php require __DIR__ . '/pages/' . ($isAdminView ? $currentView : 'dashboard') . '.php'; ?>
      </main>
    </div>
    <?php endif; ?>

    <?php require __DIR__ . '/includes/scripts.php'; ?>
  </body>
</html>
