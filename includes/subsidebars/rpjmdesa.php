          <nav class="material-menu" aria-label="Sub menu <?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?>">
            <a class="material-menu-root" href="?view=dashboard&v=<?= htmlspecialchars($cacheVersion, ENT_QUOTES, 'UTF-8') ?>#overview"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
            <a class="material-menu-root" href="#accessImportPanel" data-access-import><i data-lucide="database-zap"></i><span>Export</span></a>

            <details class="material-menu-group">
              <summary><i data-lucide="database"></i><span>Input Data</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="input_daftar_isi">Input Daftar Isi</a>
                <a href="#materialAutoForm" data-material-form="input_data_umum">Input Data Umum</a>
                <a href="#materialAutoForm" data-material-form="input_misi_desa">Input Misi Desa</a>
                <a href="#materialAutoForm" data-material-form="input_profil_desa">Input Profil Desa</a>
                <a href="#materialAutoForm" data-material-form="input_rktl">Input RKTL</a>
                <a href="#materialAutoForm" data-material-form="input_musdes">Input Musdes</a>
                <a href="#materialAutoForm" data-material-form="input_sejarah_desa">Input Sejarah Desa</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="clipboard-list"></i><span>Input Perencanaan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="input_renc_pendapatan">Input Renc Pendapatan</a>
                <a href="#materialAutoForm" data-material-form="input_matrik">Input Matrik</a>
                <a href="#materialAutoForm" data-material-form="input_musdus_kelompok">Mudus/Kelompok</a>
                <a href="#materialAutoForm" data-material-form="sketsa_desa">Sketsa Desa</a>
                <a href="#materialAutoForm" data-material-form="bagan_kelembagaan_input">Bagan Kelembagaan</a>
                <a href="#materialAutoForm" data-material-form="kalender_musim">Kalender Musim</a>
                <a href="#materialAutoForm" data-material-form="arah_kebijakan">Arah Kebijakan</a>
              </div>
            </details>

            <details class="material-menu-group">
              <summary><i data-lucide="sliders-horizontal"></i><span>Olah Data Perencanaan</span></summary>
              <div class="material-submenu">
                <a href="#materialAutoForm" data-material-form="input_rekomendasi_sdgs">Input Rekomendasi SDGs</a>
                <a href="#materialAutoForm" data-material-form="input_prioritas">Input Penentuan/Prioritas</a>
                <a href="#materialAutoForm" data-material-form="dtsen">DTSen Desil 1–4</a>
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
                <span class="material-report-group">Laporan Cover</span>
                <a href="#materialAutoForm" data-material-form="cover">Cover</a>
                <a href="#materialAutoForm" data-material-form="cover_lampiran">Cover Lampiran</a>
                <span class="material-report-group">Laporan Dokumen</span>
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
                <a href="#materialAutoForm" data-material-form="sketsa_desa_laporan">Sketsa Desa</a>
                <a href="#materialAutoForm" data-material-form="kalender_musim_laporan">Kalender Musim</a>
                <span class="material-report-group">Lampiran</span>
                <a href="#materialAutoForm" data-material-form="inventaris_masalah">Daftar Inventaris Masalah</a>
                <a href="#materialAutoForm" data-material-form="inventaris_potensi">Daftar Inventaris Potensi</a>
                <a href="#materialAutoForm" data-material-form="pengkajian_tindakan">Pengkajian Tindakan Pemecahan Masalah</a>
                <a href="#materialAutoForm" data-material-form="penentuan_tindakan">Penentuan Tindakan Masalah</a>
                <a href="#materialAutoForm" data-material-form="input_prioritas">Penentuan Peringkat Tindakan</a>
                <a href="#materialAutoForm" data-material-form="gagasan_dusun">Daftar Gagasan Dusun/Kelompok</a>
                <a href="#materialAutoForm" data-material-form="rekap_gagasan_dusun">Rekapitulasi Gagasan Dusun/Kelompok</a>
                <a href="#materialAutoForm" data-material-form="rancangan_rpjmdesa">Rancangan RPJMDesa</a>
                <a href="#materialAutoForm" data-material-form="dok_visi_misi_kades">Dok. Visi Misi Kades</a>
                <a href="#materialAutoForm" data-material-form="dok_pokok_pikiran_bpd">Dok. Pokok Pikiran BPD</a>
                <a href="#materialAutoForm" data-material-form="ba_musrenbangdes">BA Musrenbangdes</a>
                <a href="#materialAutoForm" data-material-form="ba_penetapan">BA Pembahasan/Penetapan</a>
              </div>
            </details>
          </nav>

