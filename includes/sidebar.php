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
