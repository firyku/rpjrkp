          <nav class="material-menu" aria-label="Sub menu APBDesa">
            <a class="material-menu-root" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
            <details class="material-menu-group">
              <summary><i data-lucide="database"></i><span>Data</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="apb_data">Data APBDesa</a>
                <a href="#materialAutoForm" data-material-form="apb_akun">Akun/Rekening</a>
                <a href="#materialAutoForm" data-material-form="apb_bidang">Bidang</a>
                <a href="#materialAutoForm" data-material-form="apb_subbidang">Sub Bidang</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="list-checks"></i><span>Kegiatan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="apb_kegiatan">Input Kegiatan</a>
                <a href="#materialAutoForm" data-material-form="apb_paket_kegiatan">Input Paket Kegiatan</a>
              </div>
            </details>
            <details class="material-menu-group"><summary><i data-lucide="circle-dollar-sign"></i><span>Pendapatan</span></summary><div class="material-submenu"><a href="#materialAutoForm" data-material-form="apb_pendapatan">Pendapatan</a><a href="#materialAutoForm" data-material-form="apb_pendapatan_perubahan">Pendapatan Perubahan</a></div></details>
            <details class="material-menu-group"><summary><i data-lucide="receipt-text"></i><span>Belanja</span></summary><div class="material-submenu"><a href="#materialAutoForm" data-material-form="apb_belanja">Belanja</a><a href="#materialAutoForm" data-material-form="apb_belanja_perubahan">Belanja Perubahan</a></div></details>
            <details class="material-menu-group"><summary><i data-lucide="landmark"></i><span>Pembiayaan 1</span></summary><div class="material-submenu"><a href="#materialAutoForm" data-material-form="apb_pembiayaan_1">Penerimaan Pembiayaan</a><a href="#materialAutoForm" data-material-form="apb_pembiayaan_1_perubahan">Perubahan Penerimaan</a></div></details>
            <details class="material-menu-group"><summary><i data-lucide="hand-coins"></i><span>Pembiayaan 2</span></summary><div class="material-submenu"><a href="#materialAutoForm" data-material-form="apb_pembiayaan_2">Pengeluaran Pembiayaan</a><a href="#materialAutoForm" data-material-form="apb_pembiayaan_2_perubahan">Perubahan Pengeluaran</a></div></details>
            <details class="material-menu-group">
              <summary><i data-lucide="files"></i><span>Pelaporan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="apb_laporan_apbdes">APBDesa</a>
                <a href="#materialAutoForm" data-material-form="apb_laporan_pendapatan">Pendapatan</a>
                <a href="#materialAutoForm" data-material-form="apb_laporan_belanja">Belanja</a>
                <a href="#materialAutoForm" data-material-form="apb_laporan_pembiayaan_1">Pembiayaan 1</a>
                <a href="#materialAutoForm" data-material-form="apb_laporan_pembiayaan_2">Pembiayaan 2</a>
                <a href="#materialAutoForm" data-material-form="apb_penjabaran">Penjabaran APBDesa</a>
                <a href="#materialAutoForm" data-material-form="apb_laporan_perubahan">Perubahan APBDesa</a>
                <a href="#materialAutoForm" data-material-form="apb_penjabaran_perubahan">Penjabaran Perubahan</a>
              </div>
            </details>
            <details class="material-menu-group"><summary><i data-lucide="settings-2"></i><span>Pengaturan</span></summary><div class="material-submenu"><a href="#materialAutoForm" data-material-form="apb_tagging">Tagging</a><a href="#materialAutoForm" data-material-form="apb_satuan">Satuan</a><a href="#materialAutoForm" data-material-form="apb_user">User</a></div></details>
          </nav>

