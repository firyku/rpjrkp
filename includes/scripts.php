    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    <?php if ($isLoggedIn): ?>
    <script src="assets/storage-sync.js?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>"></script>
    <?php endif; ?>
    <script src="assets/app.php?v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>"></script>
