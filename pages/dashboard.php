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
        <div class="hero-media" aria-label="Video banner APDI">
          <video id="heroDreaminaVideo" autoplay muted loop playsinline controls preload="auto" aria-label="Video pemandangan desa untuk banner APDI">
            <source src="assets/hero-dreamina.mp4" type="video/mp4">
            Browser Anda tidak mendukung pemutar video.
          </video>
          <button class="hero-sound-toggle" id="heroSoundToggle" type="button" aria-pressed="false" aria-label="Nyalakan suara video">
            <i data-lucide="volume-x"></i>
            <span>Suara mati</span>
          </button>
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
            <label>
              <span>Background Cover</span>
              <input type="file" name="background_cover" accept="image/png,image/jpeg">
            </label>
            <label>
              <span>Foto Kades</span>
              <input type="file" name="foto_kades" accept="image/png,image/jpeg">
            </label>
            <label>
              <span>Gambar Cover RPJMDesa</span>
              <input type="file" name="gambar_cover_rpjmdesa" accept="image/png,image/jpeg">
            </label>
            <label>
              <span>Gambar Bagan Kelembagaan</span>
              <input type="file" name="gambar_bagan_kelembagaan" accept="image/png,image/jpeg">
            </label>
            <label>
              <span>Gambar Sketsa Desa</span>
              <input type="file" name="gambar_sketsa_desa" accept="image/png,image/jpeg">
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
                    <th>No. Tabel</th>
                    <th>Desa</th>
                    <th>Kecamatan</th>
                    <th>Kabupaten</th>
                    <th>Tahun</th>
                    <th>Kepala Desa</th>
                    <th>Jenis RPJMDes</th>
                    <th>Status</th>
                    <th>Logo Kementrian</th>
                    <th>Logo Kabupaten</th>
                    <th>Background Cover</th>
                    <th>Foto Kades</th>
                    <th>Cover RPJMDesa</th>
                    <th>Bagan Kelembagaan</th>
                    <th>Sketsa Desa</th>
                    <th>Waktu</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="desaDataRows">
                  <tr class="material-empty-row">
                    <td colspan="17">Belum ada Data Desa yang berhasil diinput.</td>
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

