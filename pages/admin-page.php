      <section class="material-admin-view" id="adminView" aria-live="polite" tabindex="-1">
        <aside class="material-sidebar">
          <div class="material-brand">
            <i data-lucide="atom"></i>
            <strong><?= htmlspecialchars($activeAdmin['title'], ENT_QUOTES, 'UTF-8') ?></strong>
          </div>
          <?php require __DIR__ . '/../includes/subsidebars/' . $currentView . '.php'; ?>
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
              <div class="material-icon cyan"><i data-lucide="calendar-range"></i></div>
              <div>
                <span>RPJMDesa Masa Jabatan</span>
                <strong><?= htmlspecialchars($activeAdmin['year'] ?? '-', ENT_QUOTES, 'UTF-8') ?></strong>
              </div>
              <small><i data-lucide="clock"></i> <?= htmlspecialchars($activeAdmin['year'] ?? '-', ENT_QUOTES, 'UTF-8') ?></small>
            </article>
          </section>

          <section class="material-chart-grid">
            <article class="material-chart-card identity-card">
              <div class="material-chart identity-visual green">
                <img id="rpjmLogoKabupaten" alt="Logo Kabupaten" hidden>
                <i id="rpjmLogoPlaceholder" data-lucide="landmark"></i>
              </div>
              <h2 id="rpjmNamaDesa">Nama Desa</h2>
              <p>Logo Kabupaten</p>
            </article>
            <article class="material-chart-card identity-card">
              <div class="material-chart identity-visual orange">
                <img id="rpjmFotoKades" alt="Foto Kepala Desa" hidden>
                <i id="rpjmFotoPlaceholder" data-lucide="user-round"></i>
              </div>
              <h2 id="rpjmNamaKades">Nama Kepala Desa</h2>
              <p>Foto Kepala Desa</p>
            </article>
            <article class="material-chart-card identity-card tenure-card">
              <div class="material-chart tenure-visual red">
                <i data-lucide="calendar-range"></i>
                <span>RPJMDesa</span>
                <strong id="rpjmMasaJabatan">2026 s/d 2031</strong>
              </div>
              <h2>RPJMDesa Masa Jabatan</h2>
              <p id="rpjmMasaJabatanCaption">2026 s/d 2031</p>
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
              <div class="material-result-actions">
                <button class="material-add-table-row" id="addMaterialTableRow" type="button">
                  <i data-lucide="plus"></i>Tambah Baris
                </button>
                <button class="material-clear-table" id="clearMaterialTable" type="button">
                  <i data-lucide="trash-2"></i>Hapus Tabel
                </button>
              </div>
            </div>
            <div class="material-table-wrap">
              <table class="material-result-table">
                <thead id="materialResultHead">
                  <tr>
                    <th>Nama Dokumen</th>
                    <th>Periode</th>
                    <th>Status Proses</th>
                    <th>Operator</th>
                    <th>Catatan Dashboard</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="materialResultRows">
                  <tr class="material-empty-row">
                    <td colspan="6">Belum ada data yang berhasil di input.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
