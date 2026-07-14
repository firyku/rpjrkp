          <nav class="material-menu" aria-label="Sub menu <?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?>">
            <a class="material-menu-root" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
            <details class="material-menu-group">
              <summary><i data-lucide="database"></i><span>Input Data</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_daftar_isi">Input Daftar Isi</a>
                <a href="#materialAutoForm" data-material-form="rkp_data_umum">Input Data Umum</a>
                <a href="#materialAutoForm" data-material-form="rkp_misi_desa">Input Misi Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_profil_desa">Input Profil Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_tim_input">Input BA Tim</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="wallet-cards"></i><span>Input Keuangan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_pendapatan">Input Rencana Pendapatan</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="scan-search"></i><span>Pencermatan RPJMDesa</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_input_masalah">Input Masalah</a>
                <a href="#materialAutoForm" data-material-form="rkp_rekomendasi_sdgs">Input Rekomendasi SDGs</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="history"></i><span>Evaluasi RKPDesa Sebelumnya</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_evaluasi_sebelumnya">Evaluasi RKPDesa Sebelumnya</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="users-round"></i><span>Input Tim Penyusun</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_tim_penyusun">Susunan Tim Penyusun</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="scroll-text"></i><span>Dasar Hukum</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_dasar_hukum_perdes">Dasar Hukum Perdes</a>
                <a href="#materialAutoForm" data-material-form="rkp_dasar_hukum_sk">Dasar Hukum SK Tim</a>
              </div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="book-open-text"></i><span>Uraian Perdes</span></summary>
              <div class="material-submenu"><a href="#materialAutoForm" data-material-form="rkp_ketentuan_umum">Isi Ketentuan Umum Perdes</a></div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="notebook-tabs"></i><span>Rancangan RKPDesa</span></summary>
              <div class="material-submenu"><a href="#materialAutoForm" data-material-form="rkp_rancangan_kegiatan">Rancangan RKPDesa</a></div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="landmark"></i><span>Kebijakan Pembiayaan</span></summary>
              <div class="material-submenu"><a href="#materialAutoForm" data-material-form="rkp_pembiayaan">Kebijakan Pembiayaan</a></div>
            </details>
            <details class="material-menu-group">
              <summary><i data-lucide="files"></i><span>Laporan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="rkp_cover">Cover RKPDesa</a>
                <a href="#materialAutoForm" data-material-form="rkp_pendahuluan">Pendahuluan</a>
                <a href="#materialAutoForm" data-material-form="rkp_laporan_daftar_isi">Daftar Isi</a>
                <a href="#materialAutoForm" data-material-form="rkp_bab_1">BAB I</a>
                <a href="#materialAutoForm" data-material-form="rkp_bab_2">BAB II</a>
                <a href="#materialAutoForm" data-material-form="rkp_bab_3">BAB III</a>
                <a href="#materialAutoForm" data-material-form="rkp_bab_4">BAB IV</a>
                <a href="#materialAutoForm" data-material-form="rkp_bab_5">BAB V</a>
                <a href="#materialAutoForm" data-material-form="rkp_checklist">Checklist</a>
                <a href="#materialAutoForm" data-material-form="rkp_perdes">Perdes RKPDesa</a>
                <a href="#materialAutoForm" data-material-form="rkp_sk_tim">SK Tim Penyusun</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_tim">BA Pembentukan Tim</a>
                <a href="#materialAutoForm" data-material-form="rkp_daftar_hadir">Daftar Hadir</a>
                <a href="#materialAutoForm" data-material-form="rkp_program_masuk">Program Masuk Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_rktl">RKTL</a>
                <a href="#materialAutoForm" data-material-form="rkp_musdes">Musdes</a>
                <a href="#materialAutoForm" data-material-form="rkp_prioritas">Prioritas Program</a>
                <a href="#materialAutoForm" data-material-form="rkp_usulan_sdgs">Usulan Masyarakat Berdasarkan SDGs Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_kerjasama">Daftar Kerjasama</a>
                <a href="#materialAutoForm" data-material-form="rkp_rancangan_laporan">Rancangan RKPDesa</a>
                <a href="#materialAutoForm" data-material-form="rkp_du_rkp">DU-RKP</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_rancangan">BA Hasil Penyusunan Rancangan</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_musdes">BA Musdes Perencanaan Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_musrenbang">Musrenbang Desa RKP Desa</a>
                <a href="#materialAutoForm" data-material-form="rkp_ba_pengesahan">BA Musdes Pengesahan RKP Desa</a>
              </div>
            </details>
          </nav>

