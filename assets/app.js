const activitySearch = document.querySelector("#activitySearch");
const activityRows = Array.from(document.querySelectorAll("#activitiesTable tr"));
const rangeButtons = Array.from(document.querySelectorAll("[data-range]"));
const taskCount = document.querySelector("#taskCount");
const sideNavLinks = Array.from(document.querySelectorAll(".side-nav a"));
const viewLinks = Array.from(document.querySelectorAll("[data-view]"));
const materialMenuLinks = Array.from(document.querySelectorAll("[data-material-form]"));
const materialAutoForm = document.querySelector("#materialAutoFormFields");
const materialFormPanel = document.querySelector("#materialAutoForm");
const materialFormKicker = document.querySelector("#materialFormKicker");
const materialFormHeading = document.querySelector("#materialFormHeading");
const materialFormDescription = document.querySelector("#materialFormDescription");
const materialFormIcon = document.querySelector(".material-form-icon");
const materialResultHead = document.querySelector("#materialResultHead");
const materialResultRows = document.querySelector("#materialResultRows");
const clearMaterialTableButton = document.querySelector("#clearMaterialTable");
const addMaterialTableRowButton = document.querySelector("#addMaterialTableRow");
const desaDataForm = document.querySelector("#desaDataForm");
const desaDataRows = document.querySelector("#desaDataRows");
const clearDesaDataTableButton = document.querySelector("#clearDesaDataTable");
const visiDesaList = document.querySelector("#visiDesaList");
const addVisiDesaItemButton = document.querySelector("#addVisiDesaItem");
const dashboardView = document.querySelector("#dashboardView");
const adminView = document.querySelector("#adminView");
const heroDreaminaVideo = document.querySelector("#heroDreaminaVideo");
const heroSoundToggle = document.querySelector("#heroSoundToggle");

const adminConfig = {
  rpjmdesa: {
    title: "RPJMDesa",
    subtitle: "Form pengelolaan Rencana Pembangunan Jangka Menengah Desa.",
    formTitle: "Form RPJMDesa",
    docName: "RPJMDesa 2026-2031",
    year: "2026-2031",
    total: "24",
    review: "6",
    verified: "18",
    description: "Penguatan program prioritas desa berbasis kebutuhan masyarakat dan data musyawarah desa.",
  },
  rkpdesa: {
    title: "RKPDesa",
    subtitle: "Form pengelolaan Rencana Kerja Pemerintah Desa tahunan.",
    formTitle: "Form RKPDesa",
    docName: "RKPDesa Tahun 2026",
    year: "2026",
    total: "18",
    review: "4",
    verified: "14",
    description: "Penyusunan kegiatan tahunan desa berdasarkan pagu indikatif dan prioritas hasil musyawarah.",
  },
  apbdesa: {
    title: "APBDesa",
    subtitle: "Form pengelolaan Anggaran Pendapatan dan Belanja Desa.",
    formTitle: "Form APBDesa",
    docName: "APBDesa Tahun Anggaran 2026",
    year: "2026",
    total: "31",
    review: "8",
    verified: "23",
    description: "Penganggaran pendapatan, belanja, dan pembiayaan desa sesuai dokumen perencanaan.",
  },
};

const currentViewName = document.body?.dataset.currentView || "dashboard";
const activeMaterialModule = adminConfig[currentViewName] || adminConfig.rpjmdesa;
const materialStorageKey = `rpjrkp-material-inputs-${activeMaterialModule.title}`;
const desaDataStorageKey = "rpjrkp-dashboard-data-desa";
let currentMaterialFormKey = "dashboard";
let materialSavedRows = [];
let desaSavedRows = [];
let editingDesaRowId = null;
let editingMaterialRowId = null;
let currentMaterialSectionSteps = [];

if (heroDreaminaVideo) {
  let heroSoundEnabled = false;

  const syncHeroSoundButton = () => {
    if (!heroSoundToggle) {
      return;
    }

    const icon = heroSoundToggle.querySelector("i");
    const label = heroSoundToggle.querySelector("span");
    heroSoundToggle.setAttribute("aria-pressed", String(heroSoundEnabled));
    heroSoundToggle.setAttribute("aria-label", heroSoundEnabled ? "Matikan suara video" : "Nyalakan suara video");

    if (icon) {
      icon.setAttribute("data-lucide", heroSoundEnabled ? "volume-2" : "volume-x");
    }
    if (label) {
      label.textContent = heroSoundEnabled ? "Suara aktif" : "Suara mati";
    }
    if (window.lucide) {
      lucide.createIcons();
    }
  };

  const playHeroVideo = () => {
    heroDreaminaVideo.muted = !heroSoundEnabled;
    heroDreaminaVideo.volume = heroSoundEnabled ? 1 : 0;
    heroDreaminaVideo.loop = true;
    heroDreaminaVideo.playsInline = true;
    const playPromise = heroDreaminaVideo.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  };

  heroSoundToggle?.addEventListener("click", () => {
    heroSoundEnabled = !heroSoundEnabled;
    syncHeroSoundButton();
    playHeroVideo();
  });

  heroDreaminaVideo.addEventListener("volumechange", () => {
    const isSoundEnabled = !heroDreaminaVideo.muted && heroDreaminaVideo.volume > 0;
    if (isSoundEnabled !== heroSoundEnabled) {
      heroSoundEnabled = isSoundEnabled;
      syncHeroSoundButton();
    }
  });

  if (heroDreaminaVideo.readyState >= 2) {
    playHeroVideo();
  } else {
    heroDreaminaVideo.addEventListener("canplay", playHeroVideo, { once: true });
  }

  window.addEventListener("load", playHeroVideo);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      playHeroVideo();
    }
  });
}

function createReportTemplate(key, title) {
  return {
    key,
    icon: "files",
    title: `Form ${title}`,
    description: `Pengaturan kelengkapan ${title} untuk dokumen ${activeMaterialModule.title}.`,
    fields: [
      { label: "Nama Dokumen", name: `${key}_nama_dokumen`, type: "text", value: activeMaterialModule.docName },
      { label: "Tahun/Periode", name: `${key}_periode`, type: "text", value: activeMaterialModule.year },
      { label: "Judul Laporan", name: `${key}_judul_laporan`, type: "text", value: title },
      { label: "Status Cetak", name: `${key}_status_cetak`, type: "select", options: ["Draft", "Siap Cetak", "Sudah Dicetak", "Perlu Perbaikan"], value: "Draft" },
      { label: "Nomor Halaman", name: `${key}_nomor_halaman`, type: "text", placeholder: "Contoh: 1-4" },
      { label: "Catatan Kelengkapan", name: `${key}_catatan`, type: "textarea", full: true, placeholder: "Catatan hasil pengecekan dokumen" },
    ],
  };
}

function normalizeAccessName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "field";
}

function accessField(label, type = "text") {
  const selectOptions = {
    "Jenis_RPJMdes": ["Penyusunan", "Perubahan"],
    "STATUS PERDES_RPJMDes": ["Berlaku", "Perubahan", "Dicabut"],
    "STATUS PERDES_RKPDes": ["Berlaku", "Perubahan", "Dicabut"],
    "Jenis Musdes": ["Musdes Perencanaan", "Musdes Penyusunan", "Musrenbang Desa", "Musdes Penetapan"],
    "Bidang": ["Penyelenggaraan Pemerintahan Desa", "Pelaksanaan Pembangunan Desa", "Pembinaan Kemasyarakatan", "Pemberdayaan Masyarakat", "Penanggulangan Bencana, Keadaan Darurat dan Mendesak"],
    "BIDANG": ["Penyelenggaraan Pemerintahan Desa", "Pelaksanaan Pembangunan Desa", "Pembinaan Kemasyarakatan", "Pemberdayaan Masyarakat", "Penanggulangan Bencana, Keadaan Darurat dan Mendesak"],
    "Sumber Dana": ["PAD", "Dana Desa", "ADD", "PBH", "Bantuan Provinsi", "Bantuan Kabupaten", "Lain-lain"],
    "sumber dana": ["PAD", "Dana Desa", "ADD", "PBH", "Bantuan Provinsi", "Bantuan Kabupaten", "Lain-lain"],
    "Pola Pelaksanaan": ["Swakelola", "Kerja Sama Antar Desa", "Kerja Sama Pihak Ketiga"],
    "pola": ["Swakelola", "Kerja Sama Antar Desa", "Kerja Sama Pihak Ketiga"],
    "Jenis": ["Tanaman Pangan", "Perkebunan", "Buah-buahan"],
    "Jenis Ternak/Perikanan": ["Peternakan", "Perikanan Tangkap", "Perikanan Budidaya"],
    "Kondisi": ["Baik", "Rusak Ringan", "Rusak Sedang", "Rusak Berat"],
    "Kondisi Irigasi": ["Baik", "Rusak Ringan", "Rusak Sedang", "Rusak Berat"],
    "Jenis Permukiman": ["Perdesaan", "Perkotaan", "Pesisir", "Pegunungan", "Bantaran Sungai"],
    "Jenis Pembiayaan": ["Penerimaan Pembiayaan", "Pengeluaran Pembiayaan"],
  };
  if (selectOptions[label]) {
    return {label,name:normalizeAccessName(label),type:"select",options:selectOptions[label],value:selectOptions[label][0]};
  }
  return {
    label,
    name: normalizeAccessName(label),
    type,
    full: type === "textarea",
    placeholder: label,
  };
}

function accessFields(columns, textareaColumns = [], fileColumns = []) {
  const textareaSet = new Set(textareaColumns);
  const fileSet = new Set(fileColumns);
  return columns.map((label) => {
    if (fileSet.has(label)) return accessField(label, "file");
    return accessField(label, textareaSet.has(label) ? "textarea" : "text");
  });
}

const detailedProfileFields = accessFields([
  "Tahun Data", "Jumlah Penduduk Tahun Ini", "Jumlah Penduduk Tahun Sebelumnya", "Pertumbuhan Penduduk (%)", "Jumlah Laki-laki", "Jumlah Perempuan", "Jumlah Kepala Keluarga",
  "Penduduk Usia Kerja", "Angkatan Kerja", "Bekerja", "Pengangguran", "Bukan Angkatan Kerja", "Tingkat Partisipasi Angkatan Kerja (%)",
  "Tidak/Belum Sekolah", "Belum Tamat SD", "Tamat SD/Sederajat", "Tamat SMP/Sederajat", "Tamat SMA/Sederajat", "Diploma", "Sarjana", "Pascasarjana",
  "Jumlah Kelahiran", "Jumlah Kematian", "Kematian Bayi", "Ibu Hamil", "Balita", "Balita Gizi Buruk", "Penyandang Disabilitas", "Sarana Kesehatan", "Tenaga Kesehatan",
  "Jumlah Keluarga", "Keluarga Pra Sejahtera", "Keluarga Sejahtera I", "Penduduk Miskin", "Penerima Bantuan Sosial",
  "Jumlah UMKM", "Jumlah BUM Desa", "Pasar Desa", "Koperasi", "Usaha Perdagangan", "Usaha Jasa", "Pendapatan Rata-rata Penduduk",
  "Jenis", "Komoditi", "Produksi 3 Tahun Sebelumnya", "Satuan 3 Tahun Sebelumnya", "Produksi 2 Tahun Sebelumnya", "Satuan 2 Tahun Sebelumnya", "Produksi 1 Tahun Sebelumnya", "Satuan 1 Tahun Sebelumnya",
  "Jenis Ternak/Perikanan", "Komoditas Ternak/Perikanan", "Jumlah Populasi", "Produksi per Tahun", "Satuan Produksi",
  "Jenis Infrastruktur", "Lokasi Infrastruktur", "Volume", "Satuan", "Kondisi", "Tahun Pembangunan", "Keterangan Infrastruktur",
  "Nama/Jenis Irigasi", "Lokasi Irigasi", "Panjang (Meter)", "Luas Layanan (Ha)", "Kondisi Irigasi", "Jumlah Penerima Manfaat",
  "Jumlah Rumah", "Rumah Layak Huni", "Rumah Tidak Layak Huni", "Akses Air Bersih", "Akses Sanitasi", "Akses Listrik", "Jenis Permukiman", "Keterangan Pemukiman",
], ["Keterangan Infrastruktur", "Keterangan Pemukiman"]);

const materialFormTemplates = {
  dashboard: {
    key: "dashboard",
    icon: "layout-dashboard",
    title: "Form Dashboard",
    description: "Ringkasan cepat untuk memantau status dokumen, periode, dan catatan tindak lanjut.",
    fields: [
      { label: "Nama Dokumen", name: "nama_dokumen", type: "text", value: activeMaterialModule.docName },
      { label: "Periode", name: "periode", type: "text", value: activeMaterialModule.year },
      { label: "Status Proses", name: "status_proses", type: "select", options: ["Draft", "Review", "Terverifikasi", "Selesai"], value: "Review" },
      { label: "Operator", name: "operator", type: "text", placeholder: "Nama operator desa" },
      { label: "Catatan Dashboard", name: "catatan_dashboard", type: "textarea", full: true, value: activeMaterialModule.description },
    ],
  },
  profile: {
    key: "profile",
    icon: "user",
    title: "Form Profil Dokumen",
    description: "Data penyusun dan penanggung jawab dokumen perencanaan desa.",
    fields: [
      { label: "Nama Modul", name: "nama_modul", type: "text", value: activeMaterialModule.title },
      { label: "Nama Penyusun", name: "nama_penyusun", type: "text", placeholder: "Nama lengkap penyusun" },
      { label: "Jabatan", name: "jabatan", type: "select", options: ["Kepala Desa", "Sekretaris Desa", "Kaur Perencanaan", "Operator Desa"], value: "Kaur Perencanaan" },
      { label: "Telepon", name: "telepon", type: "tel", placeholder: "08xxxxxxxxxx" },
      { label: "Alamat Email", name: "email", type: "email", placeholder: "nama@desa.go.id" },
      { label: "Catatan Profil", name: "catatan_profil", type: "textarea", full: true, placeholder: "Tulis catatan profil dokumen" },
    ],
  },
  table: {
    key: "table",
    icon: "clipboard-list",
    title: "Form Daftar Program",
    description: "Input otomatis untuk daftar program, kegiatan, output, dan status usulan.",
    fields: [
      { label: "Bidang Program", name: "bidang_program", type: "select", options: ["Pemerintahan Desa", "Pembangunan Desa", "Pembinaan Kemasyarakatan", "Pemberdayaan Masyarakat", "Penanggulangan Bencana"], value: "Pembangunan Desa" },
      { label: "Nama Kegiatan", name: "nama_kegiatan", type: "text", placeholder: "Contoh: Pembangunan jalan lingkungan" },
      { label: "Output", name: "output", type: "text", placeholder: "Contoh: 250 meter" },
      { label: "Tahun", name: "tahun", type: "text", value: activeMaterialModule.year },
      { label: "Perkiraan Anggaran", name: "anggaran", type: "number", placeholder: "0" },
      { label: "Status Usulan", name: "status_usulan", type: "select", options: ["Usulan Baru", "Dalam Review", "Disetujui", "Ditunda"], value: "Dalam Review" },
    ],
  },
  typography: {
    key: "typography",
    icon: "file-text",
    title: "Form Bidang Kegiatan",
    description: "Pengaturan uraian bidang kegiatan, prioritas, sasaran, dan dasar pelaksanaan.",
    fields: [
      { label: "Judul Bidang", name: "judul_bidang", type: "text", placeholder: "Nama bidang kegiatan" },
      { label: "Prioritas", name: "prioritas", type: "select", options: ["Prioritas 1", "Prioritas 2", "Prioritas 3"], value: "Prioritas 1" },
      { label: "Sasaran", name: "sasaran", type: "text", placeholder: "Masyarakat / wilayah sasaran" },
      { label: "Sumber Data", name: "sumber_data", type: "text", placeholder: "Musdes, SDGs Desa, atau data lainnya" },
      { label: "Uraian Kegiatan", name: "uraian_kegiatan", type: "textarea", full: true, placeholder: "Jelaskan uraian bidang kegiatan" },
    ],
  },
  icons: {
    key: "icons",
    icon: "share-2",
    title: "Form Indikator",
    description: "Catat indikator, satuan, target, dan realisasi capaian dokumen.",
    fields: [
      { label: "Kode Indikator", name: "kode_indikator", type: "text", placeholder: "IK-001" },
      { label: "Nama Indikator", name: "nama_indikator", type: "text", placeholder: "Nama indikator capaian" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Unit, meter, persen, keluarga" },
      { label: "Target", name: "target", type: "number", placeholder: "0" },
      { label: "Realisasi", name: "realisasi", type: "number", placeholder: "0" },
      { label: "Keterangan", name: "keterangan", type: "textarea", full: true, placeholder: "Keterangan indikator" },
    ],
  },
  maps: {
    key: "maps",
    icon: "map-pin",
    title: "Form Lokasi",
    description: "Data lokasi kegiatan untuk dusun, RT/RW, alamat, koordinat, dan volume pekerjaan.",
    fields: [
      { label: "Dusun", name: "dusun", type: "text", placeholder: "Nama dusun" },
      { label: "RT/RW", name: "rt_rw", type: "text", placeholder: "Contoh: RT 01 / RW 02" },
      { label: "Alamat Lokasi", name: "alamat_lokasi", type: "text", placeholder: "Alamat atau titik lokasi" },
      { label: "Koordinat", name: "koordinat", type: "text", placeholder: "-7.000000, 110.000000" },
      { label: "Volume", name: "volume", type: "text", placeholder: "Contoh: 250 meter" },
      { label: "Catatan Lokasi", name: "catatan_lokasi", type: "textarea", full: true, placeholder: "Keterangan lokasi kegiatan" },
    ],
  },
  notifications: {
    key: "notifications",
    icon: "bell",
    title: "Form Notifikasi",
    description: "Buat pengingat untuk review, verifikasi, dan agenda penyusunan dokumen.",
    fields: [
      { label: "Judul Notifikasi", name: "judul_notifikasi", type: "text", placeholder: "Contoh: Review dokumen prioritas" },
      { label: "Penerima", name: "penerima", type: "select", options: ["Kepala Desa", "Sekretaris Desa", "BPD", "Tim Penyusun", "Operator Desa"], value: "Tim Penyusun" },
      { label: "Prioritas", name: "prioritas", type: "select", options: ["Normal", "Penting", "Mendesak"], value: "Penting" },
      { label: "Tanggal Pengingat", name: "tanggal_pengingat", type: "date" },
      { label: "Pesan", name: "pesan", type: "textarea", full: true, placeholder: "Tulis pesan notifikasi" },
    ],
  },
  input_daftar_isi: {
    key: "input_daftar_isi",
    icon: "list-tree",
    title: "Input Daftar Isi",
    description: "Form mengikuti tabel Access daftar isi RPJMDesa.",
    fields: accessFields(["Halaman", "ISI", "Kode", "Kode uraian", "Uraian"]),
  },
  input_data_umum: {
    key: "input_data_umum",
    icon: "database",
    title: "Input Data Umum",
    description: "Form mengikuti tabel Access Data Umum.",
    fields: accessFields([
      "ALAMAT DESA", "Baground Caver", "Desa", "Foto_Kades", "Gambar_cover_RPJMdesa",
      "Ganbar_Bagan_kelembagaan", "Ganbar_sketsa_desa", "Jenis_RPJMdes", "Jumlah Dusun (angka)",
      "Jumlah Dusun (huruf)", "Jumlah Kepala Keluarga (KK)", "Kabupaten", "Kecamatan", "LOGO KAB",
      "LOGO KEMENTRIAN", "Nama Kepala Desa", "Nama Ketua BPD", "Nama Ketua Tim", "Nama RKPDEsa",
      "Nama Sekretaris Desa", "No Perdes RKPdesa", "No Perdes RPJMDEs yg di cabut", "No sk tim penyusun",
      "No sk tim penyusun RPJMDes", "Peiode RPJMDes Lama yang di cabut (mulai - akhir)", "Perdes RPJMdesa",
      "Periode RPJMDesa Ke", "Provinsi", "STATUS PERDES_RKPDes", "STATUS PERDES_RPJMDes",
      "Tahun akhir Periode RPJMdesa", "Tahun Anggaran", "Tahun Awal Periode RPJMdesa", "tahun berjalan",
      "Tanggal Penetapan perdes", "Tanggal Pengundangan perdes", "Tanggal Pengundangan perdes RPJMDes",
      "Tanggal Penyusunan", "Tanggal_Penyusunan_RPJMDes", "Tentang_Perdes_RPJMDes",
      "Tgl Penetapan Perdes RPJMDesa", "Visi Desa",
    ], ["LOGO KEMENTRIAN", "Tentang_Perdes_RPJMDes"], ["Baground Caver", "Gambar_cover_RPJMdesa", "Ganbar_Bagan_kelembagaan", "Ganbar_sketsa_desa"]),
  },
  input_misi_desa: {
    key: "input_misi_desa",
    icon: "target",
    title: "Input Misi Desa",
    description: "Form mengikuti tabel Access misi.",
    fields: accessFields(["Misi Desa", "No Urut"], ["Misi Desa"]),
  },
  input_profil_desa: {
    key: "input_profil_desa",
    icon: "map-pinned",
    title: "Input Profil Desa",
    description: "Form mengikuti kolom tabel PROFIL pada Access.",
    fields: detailedProfileFields,
  },
  input_rktl: {
    key: "input_rktl",
    icon: "calendar-clock",
    title: "Input RKTL",
    description: "Form mengikuti tabel rktl RPJMdesa.",
    fields: accessFields(["BULAN", "HARI", "Jenis", "NO", "PUKUL", "TAHUN", "TANGGAL", "TEMPAT", "URAIAN"]),
  },
  input_musdes: {
    key: "input_musdes",
    icon: "users",
    title: "Input Musdes",
    description: "Form mengikuti tabel musdes RPJMDes.",
    fields: accessFields([
      "Jenis Musdes", "Narsum 1", "narsum 1 Dari Unsur", "Narsum 2", "narsum 2 Dari Unsur",
      "Narsum 3", "narsum 3 Dari Unsur", "Narsum 4", "narsum 4 Dari Unsur", "Narsum 5",
      "narsum 5 Dari Unsur", "Narsum 6", "narsum 6 Dari Unsur", "Narsum 7", "narsum 7 Dari Unsur",
      "Narsum 8", "narsum 8 Dari Unsur", "nomor", "Notulen", "Notulen Dari Unsur", "Pemimpin",
      "Pemimpin Dari Unsur", "Wakil Masyarakat",
    ]),
  },
  input_sejarah_desa: {
    key: "input_sejarah_desa",
    icon: "landmark",
    title: "Input Sejarah Desa",
    description: "Mencatat urutan tahun, peristiwa, dan keterangan sejarah desa.",
    fields: accessFields(["No", "Tahun", "Peristiwa", "Keterangan"], ["Peristiwa", "Keterangan"]),
  },
  input_renc_pendapatan: {
    key: "input_renc_pendapatan",
    icon: "wallet-cards",
    title: "Input Renc Pendapatan",
    description: "Form rencana pendapatan untuk lampiran perencanaan RPJMDesa.",
    fields: accessFields(["ADD", "BANKEU_Kab", "BANKEU_Prov", "DDS", "PAD", "PBH", "Tahun"]),
  },
  input_matrik: {
    key: "input_matrik",
    icon: "table-properties",
    title: "Input Matrik",
    description: "Form mengikuti tabel matrik RPJMDesa.",
    fields: accessFields([
      "Alamat", "Asal_usulan", "BIDANG", "Indikator", "KEGIATAN", "Kerjasama Antar Desa",
      "Kerjasama Pihak ke_3", "LOKASI (RT/RW)", "Lokasi_Dusun", "No", "Paket_kegiatan", "Satuan",
      "SDGS", "Sub_Bidang", "sumber dana", "swakelola", "th1", "th1 anggaran", "th2", "th2anggaran",
      "th3", "th3anggaran", "th4", "th4anggaran", "th5", "th5anggaran", "th6", "th6anggaran",
      "th7", "th7anggaran", "th8", "th8anggaran",
    ], ["Alamat"]),
  },
  input_musdus_kelompok: {
    key: "input_musdus_kelompok",
    icon: "messages-square",
    title: "Mudus/Kelompok",
    description: "Form mengikuti tabel musdus / kelompok RPJMDes.",
    fields: accessFields([
      "Hari Dan Tanggal", "Jabatan Kepala Dusun/Kepala Kelompok", "Jam", "Jenis Musdus/Nama Musdus",
      "Lokasi (Bila Dusun)", "Nama Kepala Dusun/Kepala Kelompok", "Narsum 1", "narsum 1 Dari Unsur",
      "Narsum 2", "narsum 2 Dari Unsur", "Narsum 3", "narsum 3 Dari Unsur", "Narsum 4",
      "narsum 4 Dari Unsur", "Narsum 5", "narsum 5 Dari Unsur", "nomor", "Notulen",
      "Notulen Dari Unsur", "Pemimpin", "Pemimpin Dari Unsur", "Tempat (musdus/kelompok)", "Wakil Masyarakat",
    ]),
  },
  sketsa_desa: {
    key: "sketsa_desa", icon: "map", title: "Sketsa Desa",
    description: "Input unsur, kondisi, masalah, dan potensi pada sketsa desa.",
    fields: accessFields(["No", "Unsur Sketsa Desa", "Kondisi", "Masalah", "Potensi", "Keterangan"], ["Kondisi", "Masalah", "Potensi", "Keterangan"]),
  },
  bagan_kelembagaan_input: {
    key: "bagan_kelembagaan_input", icon: "network", title: "Bagan Kelembagaan",
    description: "Input data kelembagaan desa dan hubungan antar-lembaga.",
    fields: accessFields(["No", "Nama Lembaga", "Dasar Hukum", "Jumlah Pengurus", "Ruang Lingkup Kegiatan", "Keterangan"]),
  },
  kalender_musim: {
    key: "kalender_musim", icon: "calendar-days", title: "Kalender Musim",
    description: "Input kejadian, kegiatan, dan kondisi desa menurut bulan.",
    fields: accessFields(["No", "Masalah/Kegiatan", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember", "Keterangan"]),
  },
  arah_kebijakan: {
    key: "arah_kebijakan", icon: "route", title: "Arah Kebijakan",
    description: "Input arah kebijakan pembangunan desa selama periode RPJMDesa.",
    fields: accessFields(["No", "Bidang", "Arah Kebijakan", "Strategi", "Sasaran", "Indikator"], ["Arah Kebijakan", "Strategi"]),
  },
  program_masuk_desa: {
    key: "program_masuk_desa",
    icon: "building-2",
    title: "Program Masuk Desa",
    description: "Form mengikuti tabel masuk desa.",
    fields: accessFields([
      "Bidang", "Lokasi Kegiatan (Dusun/RT/RW)", "Nama Program/ Kegiatan", "No Bidang",
      "No Kegiatan", "Pemerintah/Pemerintah Prov/ Pemerintah Pusat", "Satuan", "SDGS",
      "Tahun Pelaksanaan", "Total Pagu", "Volume",
    ]),
  },
  input_rekomendasi_sdgs: {
    key: "input_rekomendasi_sdgs",
    icon: "sparkles",
    title: "Input Rekomendasi SDGs",
    description: "Form mengikuti tabel eval_sdgs dan usulan sdgs.",
    fields: accessFields([
      "Data Eksisting", "indikator", "Jumlah (Rp)", "Mendukung SDGs Desa Ke-", "Nama Program",
      "No", "pola", "Satuan", "Sumber", "Tahun1", "Tahun1pelaksanaan", "Tahun2", "Tahun2pelaksanaan",
      "Tahun3", "Tahun3pelaksanaan", "Tahun4", "Tahun4pelaksanaan", "Tahun5", "Tahun5pelaksanaan",
      "Tahun6", "Tahun6pelaksanaan", "Tahun7", "Tahun7pelaksanaan", "Tahun8", "Tahun8pelaksanaan",
      "Tahun9", "Tahun9pelaksanaan", "Volume",
    ], ["Data Eksisting", "Nama Program"]),
  },
  input_prioritas: {
    key: "input_prioritas",
    icon: "arrow-up-narrow-wide",
    title: "Input Penentuan/Prioritas",
    description: "Form prioritas tindakan pemecahan masalah dan peringkat kegiatan.",
    fields: accessFields([
      "Dirasakan Oleh Banyak Orang", "Masalah", "Menghambat Peningkatan Pendapatan", "No",
      "Paket_Kegiatan", "Sangat Parah/ Mendesak", "Sering Terjadi/ Berulang",
      "Tersedia Potensi Untuk Memecahkan Masalah",
    ]),
  },
  inventaris_masalah: {
    key: "inventaris_masalah",
    icon: "circle-alert",
    title: "Daftar Inventaris Masalah",
    description: "Form inventaris masalah untuk bahan olah data perencanaan.",
    fields: accessFields(["Jenis Bidang/Urusan", "Kategori Potensi", "Kegiatan", "Keterangan", "Lembaga (bila Kelembagaan)", "Masalah", "No", "Penyebab", "Potensi", "Usulan"], ["Keterangan"]),
  },
  inventaris_potensi: {
    key: "inventaris_potensi",
    icon: "leaf",
    title: "Daftar Inventaris Potensi",
    description: "Form inventaris potensi desa untuk penyusunan RPJMDesa.",
    fields: accessFields(["Kategori Potensi", "No", "Penjelasan / Contoh"], ["Penjelasan / Contoh"]),
  },
  gagasan_dusun: {
    key: "gagasan_dusun",
    icon: "lightbulb",
    title: "Daftar Gagasan Dusun/Kelompok",
    description: "Form gagasan dusun/kelompok untuk rekapitulasi usulan RPJMDesa.",
    fields: accessFields(["LK", "Lokasi Kegiatan", "No", "NO SDGS", "Pengusul", "PR", "Prakiraan Volume & Satuan", "RTM", "SDGs Ke-", "Usulan Kegiatan"]),
  },
  tim_penyusun: {
    key: "tim_penyusun",
    icon: "users-round",
    title: "Susunan Tim Penyusun",
    description: "Form mengikuti tabel tim RPJMDes.",
    fields: accessFields(["Jabatan", "Kedudukan", "Nama", "No"]),
  },
  dasar_hukum_perdes: {
    key: "dasar_hukum_perdes",
    icon: "scroll-text",
    title: "Input Dasar Hukum Perdes",
    description: "Form mengikuti tabel dasar hukum RPJMDes.",
    fields: accessFields(["isi dasar hukum", "no"], ["isi dasar hukum"]),
  },
  dasar_hukum_sk: {
    key: "dasar_hukum_sk",
    icon: "file-check-2",
    title: "Input Dasar Hukum SK",
    description: "Form mengikuti tabel dasar hukum sk rpjmdeS.",
    fields: accessFields(["isi dasar hukum", "no"], ["isi dasar hukum"]),
  },
  ketentuan_umum_perdes: {
    key: "ketentuan_umum_perdes",
    icon: "book-open-text",
    title: "Isi Ketentuan Umum Perdes",
    description: "Form uraian ketentuan umum untuk naskah Perdes RPJMDesa.",
    fields: accessFields(["no", "uraian"], ["uraian"]),
  },
  cover: createReportTemplate("cover", "Cover"),
  cover_lampiran: createReportTemplate("cover_lampiran", "Cover Lampiran"),
  dokumen_1: createReportTemplate("dokumen_1", "Dokumen 1"),
  dokumen_2: createReportTemplate("dokumen_2", "Dokumen 2"),
  perdes: createReportTemplate("perdes", "Perdes"),
  ba_tim: {
    key: "ba_tim",
    icon: "file-signature",
    title: "BA Tim",
    description: "Form mengikuti tabel ba tim.",
    fields: [
      { label: "Hari", name: "hari", type: "text", placeholder: "Hari" },
      { label: "Tanggal (huruf)", name: "tanggal_huruf", type: "text", placeholder: "Tanggal dalam huruf" },
      { label: "Bulan (huruf)", name: "bulan_huruf", type: "text", placeholder: "Bulan dalam huruf" },
      { label: "Tahun (huruf)", name: "tahun_huruf", type: "text", placeholder: "Tahun dalam huruf" },
      { label: "Tempat", name: "tempat", type: "text", placeholder: "Tempat musyawarah" },
      { label: "Nama Pemimpin Musyawarah", name: "nama_pemimpin_musyawarah", type: "text", placeholder: "Nama pemimpin" },
      { label: "Nama Notulen Musyawarah", name: "nama_notulen_musyawarah", type: "text", placeholder: "Nama notulen" },
    ],
  },
  sk_tim: createReportTemplate("sk_tim", "SK Tim"),
  daftar_hadir: createReportTemplate("daftar_hadir", "Daftar Hadir"),
  peta_jalan_sdgs: createReportTemplate("peta_jalan_sdgs", "Peta Jalan SDGs"),
  laporan_program_masuk_desa: createReportTemplate("laporan_program_masuk_desa", "Program Masuk Desa"),
  ba_musdus_kelompok: createReportTemplate("ba_musdus_kelompok", "BA Musdus/Kelompok"),
  bagan_kelembagaan: createReportTemplate("bagan_kelembagaan", "Bagan Kelembagaan"),
  rancangan_rpjmdesa: createReportTemplate("rancangan_rpjmdesa", "Rancangan RPJMDesa"),
  dok_visi_misi_kades: createReportTemplate("dok_visi_misi_kades", "Dok. Visi Misi Kades"),
  dok_pokok_pikiran_bpd: createReportTemplate("dok_pokok_pikiran_bpd", "Dok. Pokok Pikiran BPD"),
  pengkajian_tindakan: createReportTemplate("pengkajian_tindakan", "Pengkajian Tindakan Pemecahan Masalah"),
  penentuan_tindakan: createReportTemplate("penentuan_tindakan", "Penentuan Tindakan Masalah"),
  rekap_gagasan_dusun: createReportTemplate("rekap_gagasan_dusun", "Rekapitulasi Gagasan Dusun/Kelompok"),
  sketsa_desa_laporan: createReportTemplate("sketsa_desa_laporan", "Sketsa Desa"),
  kalender_musim_laporan: createReportTemplate("kalender_musim_laporan", "Kalender Musim"),
  ba_musrenbangdes: createReportTemplate("ba_musrenbangdes", "BA Musrenbangdes"),
  ba_penetapan: createReportTemplate("ba_penetapan", "BA Pembahasan/Penetapan"),
  rkp_data_umum: {
    key: "rkp_data_umum", icon: "database", title: "Input Data Umum RKPDesa",
    description: "Identitas desa dan data pokok dokumen RKPDesa.",
    fields: accessFields(["Desa", "Kecamatan", "Kabupaten", "Provinsi", "Alamat Desa", "Nama Kepala Desa", "Nama Sekretaris Desa", "Nama Ketua BPD", "Nama Ketua Tim Penyusun", "Tahun Anggaran", "Nama RKPDesa", "No Perdes RKPDesa", "Status Perdes RKPDesa", "Tanggal Penyusunan", "Tanggal Penetapan Perdes", "Tanggal Pengundangan Perdes", "No SK Tim Penyusun", "Logo Kabupaten", "Foto Kepala Desa", "Gambar Cover RKPDesa"], ["Alamat Desa", "Logo Kabupaten", "Foto Kepala Desa", "Gambar Cover RKPDesa"]),
  },
  rkp_daftar_isi: {key:"rkp_daftar_isi",icon:"list-tree",title:"Input Daftar Isi RKPDesa",description:"Input susunan daftar isi dokumen RKPDesa.",fields:accessFields(["Kode","Kode Uraian","Uraian","Isi","Halaman"],["Uraian","Isi"])},
  rkp_misi_desa: {key:"rkp_misi_desa",icon:"target",title:"Input Misi Desa",description:"Input misi desa sebagai acuan RKPDesa.",fields:accessFields(["No Urut","Misi Desa"],["Misi Desa"])},
  rkp_profil_desa: {key:"rkp_profil_desa",icon:"map-pinned",title:"Input Profil Desa",description:"Profil desa dalam subbagian yang sama dengan aplikasi Access.",fields:detailedProfileFields},
  rkp_ba_tim_input: {key:"rkp_ba_tim_input",icon:"file-signature",title:"Input BA Tim",description:"Data berita acara pembentukan tim penyusun RKPDesa.",fields:accessFields(["Nomor Berita Acara","Hari","Tanggal","Bulan","Tahun","Pukul","Tempat","Pimpinan Rapat","Notulen","Agenda","Hasil Kesepakatan","Keterangan"],["Agenda","Hasil Kesepakatan","Keterangan"])},
  rkp_tim_penyusun: {
    key: "rkp_tim_penyusun", icon: "users-round", title: "Susunan Tim Penyusun RKPDesa",
    description: "Daftar tim penyusun beserta kedudukan dan jabatannya.",
    fields: accessFields(["No", "Nama", "Jabatan", "Kedudukan dalam Tim", "Unsur", "Keterangan"]),
  },
  rkp_musdes: {
    key: "rkp_musdes", icon: "messages-square", title: "Input Musdes RKPDesa",
    description: "Data pelaksanaan musyawarah desa penyusunan RKPDesa.",
    fields: accessFields(["Nomor", "Jenis Musdes", "Hari", "Tanggal", "Pukul", "Tempat", "Pemimpin", "Pemimpin dari Unsur", "Notulen", "Notulen dari Unsur", "Narasumber 1", "Narasumber 1 dari Unsur", "Narasumber 2", "Narasumber 2 dari Unsur", "Wakil Masyarakat", "Pokok Pembahasan", "Hasil Musyawarah"], ["Pokok Pembahasan", "Hasil Musyawarah"]),
  },
  rkp_rktl: {
    key: "rkp_rktl", icon: "calendar-clock", title: "Input RKTL RKPDesa",
    description: "Rencana kerja tindak lanjut penyusunan RKPDesa.",
    fields: accessFields(["No", "Uraian Kegiatan", "Jenis", "Hari", "Tanggal", "Bulan", "Tahun", "Pukul", "Tempat", "Penanggung Jawab", "Keterangan"], ["Uraian Kegiatan", "Keterangan"]),
  },
  rkp_pagu_indikatif: {
    key: "rkp_pagu_indikatif", icon: "badge-dollar-sign", title: "Pagu Indikatif Desa",
    description: "Sumber dan besaran pagu indikatif untuk penyusunan RKPDesa.",
    fields: accessFields(["No", "Sumber Dana", "Uraian", "Tahun Anggaran", "Jumlah (Rp)", "Keterangan"], ["Uraian", "Keterangan"]),
  },
  rkp_input_masalah: {key:"rkp_input_masalah",icon:"circle-alert",title:"Input Masalah",description:"Pencermatan masalah dari dokumen RPJMDesa untuk tahun RKPDesa.",fields:accessFields(["No","Bidang","Sub Bidang","Kegiatan RPJMDesa","Lokasi","Masalah","Penyebab","Potensi","Alternatif Tindakan","Keterangan"],["Masalah","Penyebab","Potensi","Alternatif Tindakan","Keterangan"])},
  rkp_rekomendasi_sdgs: {key:"rkp_rekomendasi_sdgs",icon:"sparkles",title:"Input Rekomendasi SDGs",description:"Rekomendasi program dan kegiatan berdasarkan SDGs Desa.",fields:accessFields(["No","Indikator","Data Eksisting","Nama Program","Volume","Satuan","Jumlah (Rp)","Sumber Dana","Mendukung SDGs Desa Ke-","Pola Pelaksanaan","Tahun Pelaksanaan"],["Data Eksisting","Nama Program"])},
  rkp_evaluasi_sebelumnya: {key:"rkp_evaluasi_sebelumnya",icon:"history",title:"Evaluasi RKPDesa Sebelumnya",description:"Evaluasi pelaksanaan program dan kegiatan RKPDesa tahun sebelumnya.",fields:accessFields(["No","Bidang","Sub Bidang","Kegiatan","Lokasi","Target Volume","Realisasi Volume","Target Anggaran","Realisasi Anggaran","Capaian (%)","Kendala","Tindak Lanjut","Keterangan"],["Kendala","Tindak Lanjut","Keterangan"])},
  rkp_program_masuk: {
    key: "rkp_program_masuk", icon: "building-2", title: "Program Masuk Desa",
    description: "Program pemerintah dan pihak lain yang masuk ke desa.",
    fields: accessFields(["No", "Bidang", "Sub Bidang", "Nama Program/Kegiatan", "Lokasi Kegiatan (Dusun/RT/RW)", "Volume", "Satuan", "Total Pagu", "Sumber Dana", "Pemerintah/Pemerintah Provinsi/Pemerintah Pusat", "Tahun Pelaksanaan", "SDGs Desa", "Keterangan"]),
  },
  rkp_rancangan_kegiatan: {
    key: "rkp_rancangan_kegiatan", icon: "notebook-tabs", title: "Rancangan Kegiatan RKPDesa",
    description: "Rancangan kegiatan berdasarkan hasil pencermatan dan musyawarah desa.",
    fields: accessFields(["No", "Bidang", "Sub Bidang", "Jenis Kegiatan", "Lokasi", "Volume", "Satuan", "Sasaran/Manfaat", "Waktu Pelaksanaan", "Pola Pelaksanaan", "Pelaksana Kegiatan", "Sumber Dana", "Prakiraan Biaya (Rp)", "SDGs Desa", "Keterangan"], ["Sasaran/Manfaat", "Keterangan"]),
  },
  rkp_matrik: {
    key: "rkp_matrik", icon: "table-properties", title: "Matrik RKPDesa",
    description: "Matrik program dan kegiatan RKPDesa tahun berjalan.",
    fields: accessFields(["No", "Bidang", "Sub Bidang", "Kegiatan", "Lokasi", "Volume", "Satuan", "Sasaran", "Waktu Pelaksanaan", "Jumlah (Rp)", "Sumber Dana", "Pola Pelaksanaan", "Pelaksana", "Indikator", "SDGs", "Keterangan"], ["Keterangan"]),
  },
  rkp_prioritas: {
    key: "rkp_prioritas", icon: "list-ordered", title: "Penentuan Prioritas Kegiatan",
    description: "Penilaian dan pemeringkatan usulan kegiatan RKPDesa.",
    fields: accessFields(["No", "Usulan Kegiatan", "Mendesak", "Dirasakan Banyak Orang", "Menghambat Pendapatan", "Sering Terjadi/Berulang", "Tersedia Potensi", "Nilai", "Peringkat", "Keterangan"]),
  },
  rkp_pendapatan: {
    key: "rkp_pendapatan", icon: "circle-dollar-sign", title: "Rencana Pendapatan Desa",
    description: "Rencana pendapatan untuk tahun anggaran RKPDesa.",
    fields: accessFields(["Tahun Anggaran", "Pendapatan Asli Desa (PAD)", "Dana Desa (DDS)", "Alokasi Dana Desa (ADD)", "Bagi Hasil Pajak dan Retribusi (PBH)", "Bantuan Keuangan Provinsi", "Bantuan Keuangan Kabupaten", "Pendapatan Lain-lain", "Jumlah Pendapatan", "Keterangan"]),
  },
  rkp_belanja: {
    key: "rkp_belanja", icon: "receipt-text", title: "Rencana Belanja Desa",
    description: "Rencana belanja per bidang dan kegiatan.",
    fields: accessFields(["No", "Bidang", "Sub Bidang", "Kegiatan", "Belanja Pegawai", "Belanja Barang dan Jasa", "Belanja Modal", "Belanja Tak Terduga", "Jumlah Belanja", "Sumber Dana", "Keterangan"]),
  },
  rkp_pembiayaan: {
    key: "rkp_pembiayaan", icon: "landmark", title: "Rencana Pembiayaan Desa",
    description: "Penerimaan dan pengeluaran pembiayaan tahun anggaran.",
    fields: accessFields(["No", "Jenis Pembiayaan", "Uraian", "Penerimaan Pembiayaan (Rp)", "Pengeluaran Pembiayaan (Rp)", "Pembiayaan Netto (Rp)", "Keterangan"], ["Uraian", "Keterangan"]),
  },
  rkp_dasar_hukum_perdes: {key:"rkp_dasar_hukum_perdes",icon:"scroll-text",title:"Dasar Hukum Perdes RKPDesa",description:"Dasar hukum penyusunan Perdes RKPDesa.",fields:accessFields(["No","Isi Dasar Hukum"],["Isi Dasar Hukum"])},
  rkp_dasar_hukum_sk: {key:"rkp_dasar_hukum_sk",icon:"file-check-2",title:"Dasar Hukum SK Tim",description:"Dasar hukum penetapan tim penyusun RKPDesa.",fields:accessFields(["No","Isi Dasar Hukum"],["Isi Dasar Hukum"])},
  rkp_ketentuan_umum: {key:"rkp_ketentuan_umum",icon:"book-open-text",title:"Ketentuan Umum Perdes RKPDesa",description:"Uraian istilah dan ketentuan umum pada Perdes.",fields:accessFields(["No","Uraian"],["Uraian"])},
  rkp_cover: createReportTemplate("rkp_cover", "Cover RKPDesa"),
  rkp_dokumen: createReportTemplate("rkp_dokumen", "Dokumen RKPDesa"),
  rkp_perdes: createReportTemplate("rkp_perdes", "Perdes RKPDesa"),
  rkp_sk_tim: createReportTemplate("rkp_sk_tim", "SK Tim Penyusun RKPDesa"),
  rkp_ba_tim: createReportTemplate("rkp_ba_tim", "BA Pembentukan Tim"),
  rkp_ba_musdes: createReportTemplate("rkp_ba_musdes", "BA Musdes RKPDesa"),
  rkp_ba_musrenbang: createReportTemplate("rkp_ba_musrenbang", "BA Musrenbangdes"),
  rkp_daftar_hadir: createReportTemplate("rkp_daftar_hadir", "Daftar Hadir"),
  rkp_lampiran_matrik: createReportTemplate("rkp_lampiran_matrik", "Lampiran Matrik RKPDesa"),
  rkp_pendahuluan: createReportTemplate("rkp_pendahuluan", "Pendahuluan"),
  rkp_laporan_daftar_isi: createReportTemplate("rkp_laporan_daftar_isi", "Daftar Isi"),
  rkp_bab_1: createReportTemplate("rkp_bab_1", "BAB I"),
  rkp_bab_2: createReportTemplate("rkp_bab_2", "BAB II"),
  rkp_bab_3: createReportTemplate("rkp_bab_3", "BAB III"),
  rkp_bab_4: createReportTemplate("rkp_bab_4", "BAB IV"),
  rkp_bab_5: createReportTemplate("rkp_bab_5", "BAB V"),
  rkp_checklist: createReportTemplate("rkp_checklist", "Checklist RKPDesa"),
  rkp_usulan_sdgs: createReportTemplate("rkp_usulan_sdgs", "Usulan Masyarakat Berdasarkan SDGs Desa"),
  rkp_kerjasama: createReportTemplate("rkp_kerjasama", "Daftar Kerjasama"),
  rkp_rancangan_laporan: createReportTemplate("rkp_rancangan_laporan", "Rancangan RKPDesa"),
  rkp_du_rkp: createReportTemplate("rkp_du_rkp", "DU-RKP"),
  rkp_ba_rancangan: createReportTemplate("rkp_ba_rancangan", "BA Hasil Penyusunan Rancangan RKP Desa"),
  rkp_ba_pengesahan: createReportTemplate("rkp_ba_pengesahan", "BA Musdes Pengesahan RKP Desa"),
  apb_data: {key:"apb_data",icon:"database",title:"Data APBDesa",description:"Identitas desa dan dokumen APBDesa.",fields:[
    accessField("Provinsi"),accessField("Kabupaten"),accessField("Kecamatan"),accessField("Desa"),accessField("Alamat Desa","textarea"),accessField("Nama Kepala Desa"),accessField("Nama Sekretaris Desa"),accessField("Tahun Anggaran"),
    {label:"Jenis Dokumen",name:"jenis_dokumen",type:"select",options:["APBDesa","Perubahan APBDesa"],value:"APBDesa"},accessField("Nomor Perdes"),accessField("Tanggal Perdes","date"),accessField("Nomor Perkades"),accessField("Tanggal Perkades","date"),accessField("Logo Kabupaten","file")
  ]},
  apb_akun: {key:"apb_akun",icon:"binary",title:"Akun/Rekening",description:"Referensi kode dan nama akun APBDesa.",fields:accessFields(["Kode Akun","Nama Akun","Kelompok","Jenis","Objek","Rincian Objek","Keterangan"],["Keterangan"])},
  apb_bidang: {key:"apb_bidang",icon:"layout-list",title:"Bidang",description:"Referensi bidang APBDesa.",fields:accessFields(["Kode Bidang","Nama Bidang","Uraian Bidang","Keterangan"],["Uraian Bidang","Keterangan"])},
  apb_subbidang: {key:"apb_subbidang",icon:"list-tree",title:"Sub Bidang",description:"Referensi sub bidang berdasarkan bidang APBDesa.",fields:accessFields(["Kode Bidang","Bidang","Kode Sub Bidang","Nama Sub Bidang","Keterangan"],["Keterangan"])},
  apb_kegiatan: {key:"apb_kegiatan",icon:"list-checks",title:"Input Kegiatan",description:"Daftar kegiatan berdasarkan bidang dan sub bidang.",fields:[
    accessField("Kode Bidang"),accessField("Bidang"),accessField("Kode Sub Bidang"),accessField("Sub Bidang"),accessField("Kode Kegiatan"),accessField("Nama Kegiatan"),accessField("Keluaran/Output"),accessField("Lokasi"),accessField("Volume"),accessField("Satuan"),accessField("Sasaran"),accessField("Waktu Pelaksanaan"),accessField("Tagging")
  ]},
  apb_paket_kegiatan: {key:"apb_paket_kegiatan",icon:"package-plus",title:"Input Paket Kegiatan",description:"Paket, pelaksana, lokasi, volume, dan sumber dana kegiatan.",fields:accessFields(["Kode Kegiatan","Nama Kegiatan","No Paket","Nama Paket Kegiatan","Pelaksana Kegiatan","Lokasi","Volume","Satuan","Sumber Dana","Pagu Anggaran","Keterangan"],["Keterangan"])},
  apb_pendapatan: {key:"apb_pendapatan",icon:"circle-dollar-sign",title:"Pendapatan",description:"Rincian anggaran pendapatan desa.",fields:accessFields(["Kode Rekening","Kelompok Pendapatan","Jenis Pendapatan","Objek Pendapatan","Rincian Objek","Uraian","Volume","Satuan","Harga Satuan","Anggaran","Sumber Dana","Keterangan"],["Keterangan"])},
  apb_pendapatan_perubahan: {key:"apb_pendapatan_perubahan",icon:"refresh-cw",title:"Pendapatan Perubahan",description:"Anggaran pendapatan sebelum dan setelah perubahan.",fields:accessFields(["Kode Rekening","Uraian Pendapatan","Anggaran Sebelum","Anggaran Setelah","Bertambah/Berkurang","Persentase","Keterangan"],["Keterangan"])},
  apb_belanja: {key:"apb_belanja",icon:"receipt-text",title:"Belanja",description:"Rincian belanja per bidang, kegiatan, dan rekening.",fields:accessFields(["Kode Bidang","Bidang","Kode Sub Bidang","Sub Bidang","Kode Kegiatan","Kegiatan","Kode Rekening","Jenis Belanja","Objek Belanja","Rincian Objek","Uraian Belanja","Volume","Satuan","Harga Satuan","Jumlah Anggaran","Sumber Dana","Tagging","Keterangan"],["Keterangan"])},
  apb_belanja_perubahan: {key:"apb_belanja_perubahan",icon:"refresh-cw",title:"Belanja Perubahan",description:"Rincian belanja sebelum dan setelah perubahan.",fields:accessFields(["Kode Bidang","Bidang","Kegiatan","Kode Rekening","Uraian Belanja","Anggaran Sebelum","Anggaran Setelah","Bertambah/Berkurang","Sumber Dana","Keterangan"],["Keterangan"])},
  apb_pembiayaan_1: {key:"apb_pembiayaan_1",icon:"landmark",title:"Penerimaan Pembiayaan",description:"Rincian penerimaan pembiayaan APBDesa.",fields:accessFields(["Kode Rekening","Kelompok Pembiayaan","Jenis Pembiayaan","Objek Pembiayaan","Rincian Objek","Uraian","Volume","Satuan","Harga Satuan","Jumlah Anggaran","Keterangan"],["Keterangan"])},
  apb_pembiayaan_1_perubahan: {key:"apb_pembiayaan_1_perubahan",icon:"refresh-cw",title:"Perubahan Penerimaan Pembiayaan",description:"Penerimaan pembiayaan sebelum dan setelah perubahan.",fields:accessFields(["Kode Rekening","Uraian","Anggaran Sebelum","Anggaran Setelah","Bertambah/Berkurang","Keterangan"],["Keterangan"])},
  apb_pembiayaan_2: {key:"apb_pembiayaan_2",icon:"hand-coins",title:"Pengeluaran Pembiayaan",description:"Rincian pengeluaran pembiayaan APBDesa.",fields:accessFields(["Kode Rekening","Kelompok Pembiayaan","Jenis Pembiayaan","Objek Pembiayaan","Rincian Objek","Uraian","Volume","Satuan","Harga Satuan","Jumlah Anggaran","Keterangan"],["Keterangan"])},
  apb_pembiayaan_2_perubahan: {key:"apb_pembiayaan_2_perubahan",icon:"refresh-cw",title:"Perubahan Pengeluaran Pembiayaan",description:"Pengeluaran pembiayaan sebelum dan setelah perubahan.",fields:accessFields(["Kode Rekening","Uraian","Anggaran Sebelum","Anggaran Setelah","Bertambah/Berkurang","Keterangan"],["Keterangan"])},
  apb_tagging: {key:"apb_tagging",icon:"tags",title:"Tagging",description:"Referensi tagging kegiatan dan belanja.",fields:accessFields(["Kode Tagging","Nama Tagging","Keterangan"],["Keterangan"])},
  apb_satuan: {key:"apb_satuan",icon:"ruler",title:"Satuan",description:"Referensi satuan volume dan harga.",fields:accessFields(["Kode Satuan","Nama Satuan","Jenis Satuan","Keterangan"],["Keterangan"])},
  apb_user: {key:"apb_user",icon:"users",title:"User",description:"Pengguna dan hak akses aplikasi APBDesa.",fields:[accessField("User ID"),accessField("Nama"),{label:"Status",name:"status",type:"select",options:["Administrator","Operator","Viewer"],value:"Operator"},accessField("Sandi","password"),{label:"Aktif",name:"aktif",type:"select",options:["Ya","Tidak"],value:"Ya"}]},
  apb_laporan_apbdes: createReportTemplate("apb_laporan_apbdes","APBDesa"),
  apb_laporan_pendapatan: createReportTemplate("apb_laporan_pendapatan","Pendapatan"),
  apb_laporan_belanja: createReportTemplate("apb_laporan_belanja","Belanja"),
  apb_laporan_pembiayaan_1: createReportTemplate("apb_laporan_pembiayaan_1","Pembiayaan 1"),
  apb_laporan_pembiayaan_2: createReportTemplate("apb_laporan_pembiayaan_2","Pembiayaan 2"),
  apb_penjabaran: createReportTemplate("apb_penjabaran","Penjabaran APBDesa"),
  apb_laporan_perubahan: createReportTemplate("apb_laporan_perubahan","Perubahan APBDesa"),
  apb_penjabaran_perubahan: createReportTemplate("apb_penjabaran_perubahan","Penjabaran Perubahan APBDesa"),
};

const theme = {
  primary: "#14558f",
  primaryDark: "#0e3d69",
  warning: "#f4b63f",
  accent: "#16807a",
  muted: "#5f7285",
  grid: "rgba(20, 85, 143, 0.09)",
};

const harvestData = {
  daily: {
    labels: ["07.00", "09.00", "11.00", "13.00", "15.00", "17.00"],
    fruits: [18, 32, 44, 42, 58, 72],
    herbs: [10, 18, 26, 34, 43, 55],
  },
  weekly: {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    fruits: [64, 72, 68, 83, 91, 118, 126],
    herbs: [46, 54, 61, 69, 74, 92, 104],
  },
  monthly: {
    labels: ["M1", "M2", "M3", "M4", "M5", "M6"],
    fruits: [220, 248, 286, 304, 338, 392],
    herbs: [184, 202, 244, 276, 297, 330],
  },
};

function filterActivities(keyword) {
  const normalized = keyword.trim().toLowerCase();

  activityRows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.hidden = normalized.length > 0 && !text.includes(normalized);
  });
}

activitySearch?.addEventListener("input", (event) => {
  filterActivities(event.target.value);
});

sideNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sideNavLinks.forEach((item) => item.classList.toggle("active", item === link));
  });
});

function setAdminView(viewName) {
  const config = adminConfig[viewName];
  if (!config || !dashboardView || !adminView) return;

  dashboardView.classList.add("is-hidden");
  adminView.classList.remove("is-hidden");

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setValue = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.value = value;
  };

  setText("#adminTitle", config.title);
  setText("#adminSubtitle", config.subtitle);
  setText("#adminFormTitle", config.formTitle);
  setValue("#adminDocName", config.docName);
  setValue("#adminYear", config.year);
  setValue("#adminDescription", config.description);
  setText("#adminTotalDocs", config.total);
  setText("#adminReviewDocs", config.review);
  setText("#adminVerifiedDocs", config.verified);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function setDashboardView() {
  dashboardView?.classList.remove("is-hidden");
  adminView?.classList.add("is-hidden");
}

function activateView(viewName) {
  if (viewName === "dashboard") {
    sideNavLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === "dashboard"));
    setDashboardView();
    return;
  }

  sideNavLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  setAdminView(viewName);
}

function createMaterialField(field) {
  const label = document.createElement("label");
  label.className = field.full ? "span-2" : "";

  const labelText = document.createElement("span");
  labelText.textContent = field.label;
  label.append(labelText);

  let control;
  if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = 4;
  } else if (field.type === "select") {
    control = document.createElement("select");
    (field.options || []).forEach((optionLabel) => {
      const option = document.createElement("option");
      option.value = optionLabel;
      option.textContent = optionLabel;
      option.selected = optionLabel === field.value;
      control.append(option);
    });
  } else if (field.type === "file") {
    control = document.createElement("input");
    control.type = "file";
    control.accept = field.accept || "image/*";
    const preview = document.createElement("img");
    preview.className = "material-file-preview";
    preview.hidden = true;
    preview.alt = "Pratinjau " + field.label;
    control.addEventListener("change", () => {
      const file = control.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          preview.src = reader.result;
          preview.hidden = false;
        });
        reader.readAsDataURL(file);
      } else {
        preview.hidden = true;
      }
    });
    label.append(preview);
  } else {
    control = document.createElement("input");
    control.type = field.type || "text";
  }

  control.name = field.name;
  if (field.placeholder) control.placeholder = field.placeholder;
  if (field.value && field.type !== "select" && field.type !== "file") control.value = field.value;
  label.append(control);

  return label;
}

const profileVillageSteps = [
  {title:"Pertumbuhan Penduduk",description:"Pertumbuhan, jenis kelamin, dan jumlah keluarga.",icon:"users",fields:["Tahun Data","Jumlah Penduduk Tahun Ini","Jumlah Penduduk Tahun Sebelumnya","Pertumbuhan Penduduk (%)","Jumlah Laki-laki","Jumlah Perempuan","Jumlah Kepala Keluarga"]},
  {title:"Angkatan Kerja",description:"Penduduk usia kerja, bekerja, dan pengangguran.",icon:"briefcase-business",fields:["Penduduk Usia Kerja","Angkatan Kerja","Bekerja","Pengangguran","Bukan Angkatan Kerja","Tingkat Partisipasi Angkatan Kerja (%)"]},
  {title:"Pendidikan",description:"Tingkat pendidikan penduduk desa.",icon:"graduation-cap",fields:["Tidak/Belum Sekolah","Belum Tamat SD","Tamat SD/Sederajat","Tamat SMP/Sederajat","Tamat SMA/Sederajat","Diploma","Sarjana","Pascasarjana"]},
  {title:"Kesehatan",description:"Kelahiran, kematian, gizi, sarana, dan tenaga kesehatan.",icon:"heart-pulse",fields:["Jumlah Kelahiran","Jumlah Kematian","Kematian Bayi","Ibu Hamil","Balita","Balita Gizi Buruk","Penyandang Disabilitas","Sarana Kesehatan","Tenaga Kesehatan"]},
  {title:"Kemiskinan",description:"Keluarga sejahtera, penduduk miskin, dan bantuan sosial.",icon:"hand-heart",fields:["Jumlah Keluarga","Keluarga Pra Sejahtera","Keluarga Sejahtera I","Penduduk Miskin","Penerima Bantuan Sosial"]},
  {title:"Ekonomi",description:"UMKM, BUM Desa, pasar, koperasi, serta kegiatan ekonomi.",icon:"chart-no-axes-combined",fields:["Jumlah UMKM","Jumlah BUM Desa","Pasar Desa","Koperasi","Usaha Perdagangan","Usaha Jasa","Pendapatan Rata-rata Penduduk"]},
  {title:"Pertanian",description:"Jenis, komoditas, dan produksi pertanian tiga tahun.",icon:"sprout",fields:["Jenis","Komoditi","Produksi 3 Tahun Sebelumnya","Satuan 3 Tahun Sebelumnya","Produksi 2 Tahun Sebelumnya","Satuan 2 Tahun Sebelumnya","Produksi 1 Tahun Sebelumnya","Satuan 1 Tahun Sebelumnya"]},
  {title:"Peternakan/Perikanan",description:"Populasi dan produksi peternakan atau perikanan.",icon:"fish",fields:["Jenis Ternak/Perikanan","Komoditas Ternak/Perikanan","Jumlah Populasi","Produksi per Tahun","Satuan Produksi"]},
  {title:"Infrastruktur",description:"Jenis, lokasi, volume, kondisi, dan tahun pembangunan.",icon:"construction",fields:["Jenis Infrastruktur","Lokasi Infrastruktur","Volume","Satuan","Kondisi","Tahun Pembangunan","Keterangan Infrastruktur"]},
  {title:"Irigasi",description:"Jaringan irigasi, luas layanan, kondisi, dan penerima manfaat.",icon:"waves",fields:["Nama/Jenis Irigasi","Lokasi Irigasi","Panjang (Meter)","Luas Layanan (Ha)","Kondisi Irigasi","Jumlah Penerima Manfaat"]},
  {title:"Pemukiman",description:"Kondisi rumah, air bersih, sanitasi, dan listrik.",icon:"house",fields:["Jumlah Rumah","Rumah Layak Huni","Rumah Tidak Layak Huni","Akses Air Bersih","Akses Sanitasi","Akses Listrik","Jenis Permukiman","Keterangan Pemukiman"]},
];

const accessDatasheetKeys = new Set([
  "input_daftar_isi", "input_misi_desa", "input_profil_desa", "input_rktl", "input_musdes",
  "input_renc_pendapatan", "input_matrik", "input_musdus_kelompok", "program_masuk_desa",
  "input_rekomendasi_sdgs", "input_prioritas", "inventaris_masalah", "inventaris_potensi",
  "gagasan_dusun", "tim_penyusun", "dasar_hukum_perdes", "dasar_hukum_sk", "ketentuan_umum_perdes",
  "sketsa_desa", "bagan_kelembagaan_input", "kalender_musim", "arah_kebijakan",
  "rkp_daftar_isi", "rkp_misi_desa", "rkp_profil_desa", "rkp_tim_penyusun", "rkp_musdes",
  "rkp_rktl", "rkp_pagu_indikatif", "rkp_program_masuk", "rkp_rancangan_kegiatan", "rkp_matrik",
  "rkp_prioritas", "rkp_pendapatan", "rkp_belanja", "rkp_pembiayaan", "rkp_input_masalah",
  "rkp_rekomendasi_sdgs", "rkp_evaluasi_sebelumnya", "rkp_dasar_hukum_perdes", "rkp_dasar_hukum_sk",
  "rkp_ketentuan_umum", "rkp_ba_tim_input",
  "apb_akun", "apb_bidang", "apb_subbidang", "apb_kegiatan", "apb_paket_kegiatan",
  "apb_pendapatan", "apb_pendapatan_perubahan", "apb_belanja", "apb_belanja_perubahan",
  "apb_pembiayaan_1", "apb_pembiayaan_1_perubahan", "apb_pembiayaan_2", "apb_pembiayaan_2_perubahan",
  "apb_tagging", "apb_satuan", "apb_user",
]);

function getProfileVillageStepIndex(field) {
  const stepIndex = profileVillageSteps.findIndex((step) => step.fields.includes(field.label));
  return stepIndex === -1 ? 0 : stepIndex;
}

function createMaterialSectionSteps(template) {
  if (["input_profil_desa", "rkp_profil_desa"].includes(template.key)) return profileVillageSteps;

  // Untuk form tabel (access datasheet), jangan pecah ke beberapa bagian
  if (accessDatasheetKeys.has(template.key)) {
    return [{ title: "Bagian 1", description: template.description, icon: "list-start", fields: (template.fields || []).map((f) => f.label) }];
  }

  const fields = template.fields || [];
  const stepCount = Math.max(1, Math.min(6, Math.ceil(fields.length / 4)));
  const fieldsPerStep = Math.max(1, Math.ceil(fields.length / stepCount));
  const icons = ["list-start", "list-todo", "clipboard-list", "files", "layout-list", "list-checks"];
  const steps = [];

  for (let index = 0; index < fields.length; index += fieldsPerStep) {
    const stepFields = fields.slice(index, index + fieldsPerStep);
    const stepNumber = steps.length + 1;
    steps.push({
      title: `Bagian ${stepNumber}`,
      description: `Lengkapi isian ${index + 1}–${index + stepFields.length} untuk ${template.title}.`,
      icon: icons[steps.length] || "circle-dot",
      fields: stepFields.map((field) => field.label),
    });
  }

  return steps.length ? steps : [{ title: "Bagian 1", description: template.description, icon: "list-start", fields: [] }];
}

function getMaterialSectionStepIndex(field) {
  const stepIndex = currentMaterialSectionSteps.findIndex((step) => step.fields.includes(field.label));
  return stepIndex === -1 ? 0 : stepIndex;
}

function activateMaterialSectionStep(stepIndex) {
  if (!materialAutoForm) return;
  const safeIndex = Math.max(0, Math.min(stepIndex, currentMaterialSectionSteps.length - 1));
  const step = currentMaterialSectionSteps[safeIndex];
  if (!step) return;

  materialAutoForm.querySelectorAll("[data-material-step-button]").forEach((button) => {
    const isActive = Number(button.dataset.materialStepButton) === safeIndex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "step" : "false");
  });

  materialAutoForm.querySelectorAll("[data-material-step-field]").forEach((field) => {
    field.hidden = Number(field.dataset.materialStepField) !== safeIndex;
  });

  const title = materialAutoForm.querySelector("#materialStepTitle");
  const description = materialAutoForm.querySelector("#materialStepDescription");
  if (title) title.textContent = step.title;
  if (description) description.textContent = step.description;
}

function createMaterialSectionNavigation(template, isProfileVillageForm) {
  const fragment = document.createDocumentFragment();
  const overview = document.createElement("section");
  overview.className = "profile-village-overview span-2";
  overview.innerHTML = `
    <div class="profile-village-mark"><i data-lucide="${isProfileVillageForm ? "map-pinned" : template.icon}"></i></div>
    <div class="profile-village-copy">
      <span>${isProfileVillageForm ? "PROFIL DESA" : activeMaterialModule.title.toUpperCase()}</span>
      <h3>${isProfileVillageForm ? "Data Profil dan Wilayah" : template.title}</h3>
      <p>${isProfileVillageForm ? "Lengkapi informasi desa secara bertahap melalui subbagian di bawah ini." : template.description}</p>
    </div>
    <div class="profile-village-status"><i data-lucide="${isProfileVillageForm ? "shield-check" : "list-checks"}"></i> ${isProfileVillageForm ? "RPJMDesa" : "Form Bertahap"}</div>
  `;
  fragment.append(overview);

  const stepper = document.createElement("nav");
  stepper.className = "profile-village-stepper span-2";
  stepper.style.setProperty("--material-step-count", String(Math.min(currentMaterialSectionSteps.length, 6)));
  stepper.setAttribute("aria-label", `Subbagian ${template.title}`);
  currentMaterialSectionSteps.forEach((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-step-button";
    button.dataset.materialStepButton = String(index);
    button.innerHTML = `
      <span class="profile-step-circle"><i data-lucide="${step.icon}"></i></span>
      <strong>${step.title}</strong>
      <small>${step.fields.length} isian</small>
    `;
    button.addEventListener("click", () => activateMaterialSectionStep(index));
    stepper.append(button);
  });
  fragment.append(stepper);

  const caption = document.createElement("div");
  caption.className = "profile-step-caption span-2";
  caption.innerHTML = `
    <div class="profile-step-caption-icon"><i data-lucide="info"></i></div>
    <div>
      <strong id="materialStepTitle">${currentMaterialSectionSteps[0].title}</strong>
      <p id="materialStepDescription">${currentMaterialSectionSteps[0].description}</p>
    </div>
  `;
  fragment.append(caption);
  return fragment;
}

function renderMaterialForm(formKey = "dashboard") {
  const template = materialFormTemplates[formKey] || materialFormTemplates.dashboard;
  if (!materialAutoForm || !template) return;
  currentMaterialFormKey = template.key;
  editingMaterialRowId = null;

  const title = `${template.title} ${activeMaterialModule.title}`;
  materialFormKicker && (materialFormKicker.textContent = activeMaterialModule.title);
  materialFormHeading && (materialFormHeading.textContent = title);
  materialFormDescription && (materialFormDescription.textContent = template.description);

  if (materialFormIcon) {
    materialFormIcon.innerHTML = `<i data-lucide="${template.icon}"></i>`;
  }

  materialAutoForm.innerHTML = "";
  const isProfileVillageForm = ["input_profil_desa", "rkp_profil_desa"].includes(template.key);
  const isSectionedMaterialForm = template.key !== "dashboard" && !accessDatasheetKeys.has(template.key);
  const isAccessDatasheet = accessDatasheetKeys.has(template.key);
  if (addMaterialTableRowButton) addMaterialTableRowButton.hidden = !isAccessDatasheet;
  if (clearMaterialTableButton) clearMaterialTableButton.hidden = !isAccessDatasheet;
  currentMaterialSectionSteps = isSectionedMaterialForm ? createMaterialSectionSteps(template) : [];
  materialAutoForm.classList.toggle("is-profile-village-form", isProfileVillageForm);
  materialAutoForm.classList.toggle("is-sectioned-material-form", isSectionedMaterialForm);
  materialAutoForm.classList.toggle("is-access-datasheet-form", isAccessDatasheet);

  // Sembunyikan panel hasil (Tabel yang berhasil di input) untuk form tabel
  const materialResultPanel = document.querySelector(".material-result-panel");
  if (materialResultPanel) {
    materialResultPanel.hidden = isAccessDatasheet;
  }
  materialFormPanel?.classList.toggle("is-profile-village-mode", isSectionedMaterialForm);
  adminView?.classList.toggle("is-profile-village-view", isSectionedMaterialForm);

  if (isSectionedMaterialForm) {
    materialAutoForm.append(createMaterialSectionNavigation(template, isProfileVillageForm));
  }

  const fieldsTarget = isAccessDatasheet ? document.createElement("div") : materialAutoForm;
  if (isAccessDatasheet) {
    fieldsTarget.className = "access-datasheet-fields span-2";
    materialAutoForm.append(fieldsTarget);
  }

  template.fields.forEach((field) => {
    const fieldControl = createMaterialField(field);
    if (isSectionedMaterialForm) {
      fieldControl.classList.add("profile-village-field");
      fieldControl.dataset.materialStepField = String(getMaterialSectionStepIndex(field));
    }
    fieldsTarget.append(fieldControl);
  });

  const actions = document.createElement("div");
  actions.className = "material-form-actions span-2";
  actions.innerHTML = `
    <button type="submit"><i data-lucide="save"></i>Simpan Data</button>
    <button type="reset"><i data-lucide="rotate-ccw"></i>Reset</button>
  `;
  materialAutoForm.append(actions);

  if (isSectionedMaterialForm) {
    activateMaterialSectionStep(0);
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  // Auto-fill LOGO KAB, Foto_Kades, and Masa Bakti RPJMDesa from saved desa data
  if (formKey === "input_data_umum" && desaSavedRows.length > 0) {
    const latestDesa = desaSavedRows[0];
    
    // Fill LOGO KAB display
    const logoKabField = materialAutoForm?.querySelector('[name="logo_kab"]');
    if (logoKabField && latestDesa.logo_kabupaten?.dataUrl) {
      const label = logoKabField.closest("label");
      if (label) {
        label.classList.add("desa-data-field");
        const span = label.querySelector("span");
        if (span) span.textContent = "Logo Kabupaten";
        logoKabField.style.display = "none";
        const existingImg = label.querySelector(".desa-sym-img");
        if (!existingImg) {
          const img = document.createElement("img");
          img.className = "desa-sym-img";
          img.src = latestDesa.logo_kabupaten.dataUrl;
          img.alt = "Logo Kabupaten";
          label.append(img);
        }
      }
    }
    
    // Fill Foto Kades display
    const fotoKadesField = materialAutoForm?.querySelector('[name="foto_kades"]');
    if (fotoKadesField && latestDesa.foto_kades?.dataUrl) {
      const label = fotoKadesField.closest("label");
      if (label) {
        label.classList.add("desa-data-field");
        const span = label.querySelector("span");
        if (span) span.textContent = "Foto Kepala Desa";
        fotoKadesField.style.display = "none";
        const existingImg = label.querySelector(".desa-sym-img");
        if (!existingImg) {
          const img = document.createElement("img");
          img.className = "desa-sym-img";
          img.src = latestDesa.foto_kades.dataUrl;
          img.alt = "Foto Kepala Desa";
          label.append(img);
        }
      }
    }
    
    // Fill Nama Kepala Desa from desa data
    const namaKadesField = materialAutoForm?.querySelector('[name="nama_kepala_desa"]');
    if (namaKadesField && latestDesa.nama_kepala_desa) {
      namaKadesField.value = latestDesa.nama_kepala_desa;
    }
    
    // Auto-fill other fields from desa data
    const desaField = materialAutoForm?.querySelector('[name="desa"]');
    if (desaField && latestDesa.desa) desaField.value = latestDesa.desa;
    
    const alamatField = materialAutoForm?.querySelector('[name="alamat_desa"]');
    if (alamatField && latestDesa.alamat_desa) alamatField.value = latestDesa.alamat_desa;
    
    const kabField = materialAutoForm?.querySelector('[name="kabupaten"]');
    if (kabField && latestDesa.kabupaten) kabField.value = latestDesa.kabupaten;
    
    const kecField = materialAutoForm?.querySelector('[name="kecamatan"]');
    if (kecField && latestDesa.kecamatan) kecField.value = latestDesa.kecamatan;
    
    const provField = materialAutoForm?.querySelector('[name="provinsi"]');
    if (provField && latestDesa.provinsi) provField.value = latestDesa.provinsi;
  }

  renderMaterialResultTable();
}

async function getMaterialFormValues() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = [];
  const filePromises = [];

  template.fields.forEach((field) => {
    const control = materialAutoForm?.elements[field.name];
    if (!control) return;
    if (field.type === "file") {
      const file = control.files?.[0];
      if (file) {
        const promise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            resolve({
              label: field.label,
              name: field.name,
              value: JSON.stringify({name: file.name, dataUrl: reader.result}),
            });
          });
          reader.addEventListener("error", () => {
            resolve({label: field.label, name: field.name, value: "-"});
          });
          reader.readAsDataURL(file);
        });
        filePromises.push(promise);
      } else {
        values.push({label: field.label, name: field.name, value: "-"});
      }
      return;
    }
    values.push({
      label: field.label,
      name: field.name,
      value: String(control.value || "").trim() || "-",
    });
  });

  const fileValues = await Promise.all(filePromises);
  return [...values, ...fileValues];
}

function getMaterialVisibleFields(template) {
  return template.fields || [];
}

function getMaterialValueMap(row) {
  if (row.valueMap) return row.valueMap;

  return (row.values || []).reduce((result, item) => {
    if (item.name) {
      result[item.name] = item.value;
    } else if (item.label) {
      result[item.label] = item.value;
    }
    return result;
  }, {});
}

function getMaterialRowValue(row, field) {
  const valueMap = getMaterialValueMap(row);
  const raw = valueMap[field.name] || valueMap[field.label] || "-";
  if (field.type === "file" && raw !== "-") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.dataUrl) return {_isFileValue: true, ...parsed};
    } catch (e) {}
  }
  return raw;
}

function isMaterialRowForTemplate(row, template) {
  return row.formKey ? row.formKey === template.key : row.form === template.title;
}

function renderMaterialResultHeader(template) {
  if (!materialResultHead) return;
  const visibleFields = getMaterialVisibleFields(template);
  const headerRow = document.createElement("tr");
  const table = materialResultHead.closest("table");

  let storedWidths = {};
  try {
    storedWidths = JSON.parse(localStorage.getItem(`${materialStorageKey}-column-widths-${template.key}`) || "{}");
  } catch (error) {
    storedWidths = {};
  }

  [...visibleFields.map((field) => field.label), "Aksi"].forEach((label, columnIndex) => {
    const headerCell = document.createElement("th");
    const columnKey = columnIndex < visibleFields.length ? visibleFields[columnIndex].name : "aksi";
    const savedWidth = Number(storedWidths[columnKey]) || (columnKey === "aksi" ? 168 : 150);
    headerCell.dataset.columnKey = columnKey;
    headerCell.dataset.columnIndex = String(columnIndex);
    headerCell.style.width = `${savedWidth}px`;
    headerCell.style.minWidth = `${savedWidth}px`;
    headerCell.style.maxWidth = `${savedWidth}px`;
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = "column-resize-handle";
    resizeHandle.dataset.resizeColumn = columnKey;
    resizeHandle.setAttribute("aria-label", `Ubah lebar kolom ${label}`);
    resizeHandle.title = "Tarik untuk mengubah lebar kolom";
    headerCell.append(labelSpan, resizeHandle);
    headerRow.append(headerCell);
  });

  if (table) {
    table.style.tableLayout = "fixed";
    const totalWidth = [...visibleFields.map((field) => field.name), "aksi"].reduce((sum, key) => sum + (Number(storedWidths[key]) || (key === "aksi" ? 168 : 150)), 0);
    table.style.minWidth = `${Math.max(960, totalWidth)}px`;
  }

  materialResultHead.innerHTML = "";
  materialResultHead.append(headerRow);
}

function applyMaterialColumnWidth(table, columnIndex, width) {
  const safeWidth = Math.max(90, Math.min(600, Math.round(width)));
  table?.querySelectorAll("tr").forEach((row) => {
    const cell = row.children[columnIndex];
    if (!cell) return;
    cell.style.width = `${safeWidth}px`;
    cell.style.minWidth = `${safeWidth}px`;
    cell.style.maxWidth = `${safeWidth}px`;
  });
  if (table) {
    const widths = Array.from(table.querySelectorAll("thead th")).map((cell) => parseFloat(cell.style.width) || 150);
    table.style.minWidth = `${Math.max(960, widths.reduce((sum, value) => sum + value, 0))}px`;
  }
  return safeWidth;
}

function createMaterialManualControl(field) {
  const control = document.createElement("div");
  control.className = "material-sheet-cell";
  control.contentEditable = "true";
  control.role = "textbox";
  control.dataset.manualField = field.name;
  control.dataset.placeholder = field.placeholder || field.label;
  control.dataset.fieldType = field.type || "text";
  control.setAttribute("aria-label", field.label);
  control.setAttribute("tabindex", "0");

  if (field.type === "select") {
    control.dataset.options = (field.options || []).join("|");
  }

  return control;
}

function renderMaterialManualInputRow(template, visibleFields) {
  const tableRow = document.createElement("tr");
  tableRow.className = "material-manual-row";
  tableRow.dataset.manualKey = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  visibleFields.forEach((field) => {
    const cell = document.createElement("td");
    cell.append(createMaterialManualControl(field));
    tableRow.append(cell);
  });

  const actionCell = document.createElement("td");
  actionCell.className = "table-action-buttons";
  const editButton = document.createElement("button");
  editButton.className = "material-save-row";
  editButton.type = "button";
  editButton.dataset.manualSave = template.key;
  editButton.setAttribute("aria-label", "Simpan baris baru");
  editButton.innerHTML = '<i data-lucide="save"></i>Simpan';

  const saveButton = document.createElement("button");
  saveButton.className = "material-delete-row";
  saveButton.type = "button";
  saveButton.dataset.manualClear = template.key;
  saveButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
  actionCell.append(editButton);
  actionCell.append(saveButton);
  tableRow.append(actionCell);

  materialResultRows.append(tableRow);

  if (window.lucide) {
    lucide.createIcons();
  }

  return tableRow;
}

function saveMaterialRows() {
  try {
    window.localStorage.setItem(materialStorageKey, JSON.stringify(materialSavedRows));
  } catch (error) {
    // Penyimpanan lokal tidak wajib; tabel tetap bekerja selama halaman aktif.
  }
}

function loadMaterialRows() {
  try {
    materialSavedRows = JSON.parse(window.localStorage.getItem(materialStorageKey) || "[]");
  } catch (error) {
    materialSavedRows = [];
  }
}

function renderMaterialResultTable() {
  if (!materialResultRows) return;
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const visibleFields = getMaterialVisibleFields(template);
  const filteredRows = materialSavedRows.filter((row) => isMaterialRowForTemplate(row, template));

  renderMaterialResultHeader(template);
  materialResultRows.innerHTML = "";

  filteredRows.forEach((row) => {
    const tableRow = document.createElement("tr");

    visibleFields.map((field) => getMaterialRowValue(row, field)).forEach((value) => {
      const cell = document.createElement("td");
      if (value && typeof value === "object" && value._isFileValue && value.dataUrl) {
        const img = document.createElement("img");
        img.className = "desa-logo-thumb";
        img.src = value.dataUrl;
        img.alt = value.name || "File";
        cell.append(img);
      } else {
        cell.textContent = value;
      }
      tableRow.append(cell);
    });

    const actionCell = document.createElement("td");
    actionCell.className = "table-action-buttons";
    const editButton = document.createElement("button");
    editButton.className = "material-edit-row";
    editButton.type = "button";
    editButton.dataset.editRowId = row.id;
    editButton.setAttribute("aria-label", "Edit baris");
    editButton.innerHTML = '<i data-lucide="pencil"></i>Edit';

    const deleteButton = document.createElement("button");
    deleteButton.className = "material-delete-row";
    deleteButton.type = "button";
    deleteButton.dataset.rowId = row.id;
    deleteButton.setAttribute("aria-label", "Hapus baris");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
    actionCell.append(editButton);
    actionCell.append(deleteButton);
    tableRow.append(actionCell);
    materialResultRows.append(tableRow);
  });

  renderMaterialManualInputRow(template, visibleFields);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function createMaterialSavedRow(template, values) {
  const normalizedValues = values.map((item) => ({
    label: item.label,
    name: item.name,
    value: String(item.value || "").trim() || "-",
  }));
  const valueMap = normalizedValues.reduce((result, item) => {
    result[item.name] = item.value;
    return result;
  }, {});
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    module: activeMaterialModule.title,
    formKey: template.key,
    form: template.title,
    status: "Berhasil di input",
    createdAt,
    valueMap,
    values: normalizedValues,
  };
}

function addMaterialSavedRow(template, values) {
  const savedRow = createMaterialSavedRow(template, values);

  if (editingMaterialRowId) {
    materialSavedRows = materialSavedRows.map((row) => {
      if (row.id !== editingMaterialRowId) return row;
      return {
        ...savedRow,
        id: editingMaterialRowId,
        createdAt: row.createdAt,
        updatedAt: savedRow.createdAt,
      };
    });
    editingMaterialRowId = null;
  } else {
    materialSavedRows.unshift(savedRow);
  }

  saveMaterialRows();
  renderMaterialResultTable();
}

async function addMaterialResultRow() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = await getMaterialFormValues();
  addMaterialSavedRow(template, values);
}

function getMaterialManualCellValue(control) {
  return String(control?.textContent || "").replace(/\s+/g, " ").trim();
}

function isMaterialManualRowFilled(row) {
  return Array.from(row?.querySelectorAll(".material-sheet-cell") || []).some((cell) => getMaterialManualCellValue(cell) !== "");
}

function ensureTrailingBlankMaterialRow() {
  if (!materialResultRows) return;
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const visibleFields = getMaterialVisibleFields(template);
  const manualRows = Array.from(materialResultRows.querySelectorAll(".material-manual-row"));
  const lastManualRow = manualRows[manualRows.length - 1];

  if (!lastManualRow || isMaterialManualRowFilled(lastManualRow)) {
    renderMaterialManualInputRow(template, visibleFields);
  }
}

function focusSiblingMaterialCell(control, direction) {
  const cells = Array.from(materialResultRows?.querySelectorAll(".material-sheet-cell") || []);
  const index = cells.indexOf(control);
  if (index === -1) return;

  const nextCell = cells[index + direction];
  if (nextCell) {
    nextCell.focus();
  } else if (direction > 0) {
    materialResultRows?.querySelector("[data-manual-save]")?.focus();
  }
}

function clearMaterialManualCells() {
  materialResultRows?.querySelectorAll(".material-manual-row:last-child .material-sheet-cell").forEach((cell) => {
    cell.textContent = "";
  });
  editingMaterialRowId = null;
}

function fillMaterialManualCells(row, template) {
  if (!row) return;
  editingMaterialRowId = row.id;
  const targetRow = materialResultRows?.querySelector(".material-manual-row") || renderMaterialManualInputRow(template, getMaterialVisibleFields(template));
  getMaterialVisibleFields(template).forEach((field) => {
    const cell = targetRow?.querySelector(`[data-manual-field="${field.name}"]`);
    if (cell) cell.textContent = getMaterialRowValue(row, field) === "-" ? "" : getMaterialRowValue(row, field);
  });
  ensureTrailingBlankMaterialRow();
}

function getFormValue(form, name) {
  return String(form?.elements[name]?.value || "").trim();
}

function getFileData(form, name) {
  const file = form?.elements[name]?.files?.[0];
  if (!file) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve({
        name: file.name,
        dataUrl: reader.result,
      });
    });
    reader.addEventListener("error", () => resolve(null));
    reader.readAsDataURL(file);
  });
}

function saveDesaRows() {
  try {
    window.localStorage.setItem(desaDataStorageKey, JSON.stringify(desaSavedRows));
  } catch (error) {
    // Data tetap tampil selama halaman aktif jika penyimpanan lokal tidak tersedia.
  }
}

function loadDesaRows() {
  try {
    desaSavedRows = JSON.parse(window.localStorage.getItem(desaDataStorageKey) || "[]");
  } catch (error) {
    desaSavedRows = [];
  }
}

function renderDesaDataTable() {
  if (!desaDataRows) return;
  desaDataRows.innerHTML = "";

  if (desaSavedRows.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "material-empty-row";
    emptyRow.innerHTML = '<td colspan="17">Belum ada Data Desa yang berhasil diinput.</td>';
    desaDataRows.append(emptyRow);
    return;
  }

  desaSavedRows.forEach((row, index) => {
    const tableRow = document.createElement("tr");
    [
      index + 1,
      row.desa,
      row.kecamatan,
      row.kabupaten,
      row.tahun_anggaran,
      row.nama_kepala_desa,
      row.jenis_rpjmdes,
      row.status_perdes_rpjmdes,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "-";
      tableRow.append(cell);
    });

    ["logo_kementrian", "logo_kabupaten"].forEach((key) => {
      const cell = document.createElement("td");
      if (row[key]?.dataUrl) {
        const image = document.createElement("img");
        image.className = "desa-logo-thumb";
        image.src = row[key].dataUrl;
        image.alt = row[key].name || "Logo";
        cell.append(image);
      } else {
        cell.textContent = "-";
      }
      tableRow.append(cell);
    });

    ["background_cover", "foto_kades", "gambar_cover_rpjmdesa", "gambar_bagan_kelembagaan", "gambar_sketsa_desa"].forEach((key) => {
      const cell = document.createElement("td");
      if (row[key]?.dataUrl) {
        const image = document.createElement("img");
        image.className = "desa-logo-thumb";
        image.src = row[key].dataUrl;
        image.alt = row[key].name || key;
        cell.append(image);
      } else {
        cell.textContent = "-";
      }
      tableRow.append(cell);
    });

    const timeCell = document.createElement("td");
    timeCell.textContent = row.updatedAt ? `${row.createdAt} / edit ${row.updatedAt}` : row.createdAt;
    tableRow.append(timeCell);

    const actionCell = document.createElement("td");
    actionCell.className = "table-action-buttons";
    const editButton = document.createElement("button");
    editButton.className = "material-edit-row";
    editButton.type = "button";
    editButton.dataset.editDesaRowId = row.id;
    editButton.setAttribute("aria-label", "Edit data desa");
    editButton.innerHTML = '<i data-lucide="pencil"></i>Edit';

    const deleteButton = document.createElement("button");
    deleteButton.className = "material-delete-row";
    deleteButton.type = "button";
    deleteButton.dataset.desaRowId = row.id;
    deleteButton.setAttribute("aria-label", "Hapus data desa");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
    actionCell.append(editButton);
    actionCell.append(deleteButton);
    tableRow.append(actionCell);
    desaDataRows.append(tableRow);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

async function collectDesaFormData(existingRow = null) {
  if (!desaDataForm) return;
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const logoKementrian = await getFileData(desaDataForm, "logo_kementrian");
  const logoKabupaten = await getFileData(desaDataForm, "logo_kabupaten");
  const backgroundCover = await getFileData(desaDataForm, "background_cover");
  const fotoKades = await getFileData(desaDataForm, "foto_kades");
  const gambarCoverRpjmdesa = await getFileData(desaDataForm, "gambar_cover_rpjmdesa");
  const gambarBaganKelembagaan = await getFileData(desaDataForm, "gambar_bagan_kelembagaan");
  const gambarSketsaDesa = await getFileData(desaDataForm, "gambar_sketsa_desa");

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    desa: getFormValue(desaDataForm, "desa"),
    kecamatan: getFormValue(desaDataForm, "kecamatan"),
    kabupaten: getFormValue(desaDataForm, "kabupaten"),
    provinsi: getFormValue(desaDataForm, "provinsi"),
    tahun_anggaran: getFormValue(desaDataForm, "tahun_anggaran"),
    tahun_berjalan: getFormValue(desaDataForm, "tahun_berjalan"),
    visi_desa: getFormValue(desaDataForm, "visi_desa"),
    misi_desa: getFormValue(desaDataForm, "misi_desa"),
    nama_kepala_desa: getFormValue(desaDataForm, "nama_kepala_desa"),
    nama_sekretaris_desa: getFormValue(desaDataForm, "nama_sekretaris_desa"),
    nama_ketua_tim: getFormValue(desaDataForm, "nama_ketua_tim"),
    nama_ketua_bpd: getFormValue(desaDataForm, "nama_ketua_bpd"),
    no_sk_tim_penyusun: getFormValue(desaDataForm, "no_sk_tim_penyusun"),
    jenis_rpjmdes: getFormValue(desaDataForm, "jenis_rpjmdes"),
    perdes_rpjmdesa: getFormValue(desaDataForm, "perdes_rpjmdesa"),
    status_perdes_rpjmdes: getFormValue(desaDataForm, "status_perdes_rpjmdes"),
    tanggal_penyusunan_rpjmdes: getFormValue(desaDataForm, "tanggal_penyusunan_rpjmdes"),
    tanggal_pengundangan_perdes_rpjmdes: getFormValue(desaDataForm, "tanggal_pengundangan_perdes_rpjmdes"),
    alamat_desa: getFormValue(desaDataForm, "alamat_desa"),
    jumlah_dusun: getFormValue(desaDataForm, "jumlah_dusun"),
    jumlah_kk: getFormValue(desaDataForm, "jumlah_kk"),
    jarak_ke_kabupaten: getFormValue(desaDataForm, "jarak_ke_kabupaten"),
    luas_wilayah: getFormValue(desaDataForm, "luas_wilayah"),
    jumlah_rt: getFormValue(desaDataForm, "jumlah_rt"),
    mata_pencaharian: getFormValue(desaDataForm, "mata_pencaharian"),
    agama_mayoritas: getFormValue(desaDataForm, "agama_mayoritas"),
    komoditas_utama: getFormValue(desaDataForm, "komoditas_utama"),
    batas_wilayah: getFormValue(desaDataForm, "batas_wilayah"),
    profil_desa: getFormValue(desaDataForm, "profil_desa"),
    logo_kementrian: logoKementrian || existingRow?.logo_kementrian || null,
    logo_kabupaten: logoKabupaten || existingRow?.logo_kabupaten || null,
    background_cover: backgroundCover || existingRow?.background_cover || null,
    foto_kades: fotoKades || existingRow?.foto_kades || null,
    gambar_cover_rpjmdesa: gambarCoverRpjmdesa || existingRow?.gambar_cover_rpjmdesa || null,
    gambar_bagan_kelembagaan: gambarBaganKelembagaan || existingRow?.gambar_bagan_kelembagaan || null,
    gambar_sketsa_desa: gambarSketsaDesa || existingRow?.gambar_sketsa_desa || null,
    tentang_perdes_rpjmdes: getFormValue(desaDataForm, "tentang_perdes_rpjmdes"),
    createdAt,
  };
}

function fillDesaForm(row) {
  if (!desaDataForm || !row) return;
  [
    "desa",
    "kecamatan",
    "kabupaten",
    "provinsi",
    "tahun_anggaran",
    "tahun_berjalan",
    "visi_desa",
    "misi_desa",
    "nama_kepala_desa",
    "nama_sekretaris_desa",
    "nama_ketua_tim",
    "nama_ketua_bpd",
    "no_sk_tim_penyusun",
    "jenis_rpjmdes",
    "perdes_rpjmdesa",
    "status_perdes_rpjmdes",
    "tanggal_penyusunan_rpjmdes",
    "tanggal_pengundangan_perdes_rpjmdes",
    "alamat_desa",
    "jumlah_dusun",
    "jumlah_kk",
    "jarak_ke_kabupaten",
    "luas_wilayah",
    "jumlah_rt",
    "mata_pencaharian",
    "agama_mayoritas",
    "komoditas_utama",
    "batas_wilayah",
    "profil_desa",
    "tentang_perdes_rpjmdes",
  ].forEach((name) => {
    if (desaDataForm.elements[name]) {
      desaDataForm.elements[name].value = row[name] || "";
    }
  });
}

function setDesaSubmitMode(isEditing) {
  const submitButton = desaDataForm?.querySelector('[type="submit"]');
  if (!submitButton) return;
  submitButton.innerHTML = isEditing
    ? '<i data-lucide="save"></i>Update Data Desa'
    : '<i data-lucide="save"></i>Simpan Data Desa';
  if (window.lucide) lucide.createIcons();
}

async function addDesaDataRow() {
  const existingRow = editingDesaRowId ? desaSavedRows.find((row) => row.id === editingDesaRowId) : null;
  const formData = await collectDesaFormData(existingRow);
  if (!formData) return;

  if (editingDesaRowId) {
    desaSavedRows = desaSavedRows.map((row) => {
      if (row.id !== editingDesaRowId) return row;
      return {
        ...formData,
        id: editingDesaRowId,
        createdAt: row.createdAt,
        updatedAt: formData.createdAt,
      };
    });
    editingDesaRowId = null;
    setDesaSubmitMode(false);
  } else {
    desaSavedRows.unshift(formData);
  }

  saveDesaRows();
  renderDesaDataTable();
}

materialMenuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    materialMenuLinks.forEach((item) => item.classList.toggle("active", item === link));
    renderMaterialForm(link.dataset.materialForm);
    document.querySelector("#materialAutoForm")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

materialAutoForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = materialAutoForm.querySelector('[type="submit"]');
  if (!submitButton) return;
  await addMaterialResultRow();
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i data-lucide="check"></i>Tersimpan';
  submitButton.classList.add("is-saved");
  if (window.lucide) lucide.createIcons();
  window.setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.classList.remove("is-saved");
    if (window.lucide) lucide.createIcons();
  }, 1400);
});

materialResultRows?.addEventListener("click", (event) => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;

  const manualSaveButton = event.target.closest("[data-manual-save]");
  if (manualSaveButton) {
    const manualRow = manualSaveButton.closest(".material-manual-row");
    const values = getMaterialVisibleFields(template).map((field) => {
      const control = manualRow?.querySelector(`[data-manual-field="${field.name}"]`);
      return {
        label: field.label,
        name: field.name,
        value: getMaterialManualCellValue(control) || "-",
      };
    });

    addMaterialSavedRow(template, values);
    return;
  }

  const manualClearButton = event.target.closest("[data-manual-clear]");
  if (manualClearButton) {
    const manualRow = manualClearButton.closest(".material-manual-row");
    const manualRows = Array.from(materialResultRows.querySelectorAll(".material-manual-row"));
    if (manualRows.length > 1 && manualRow && !manualRow.isSameNode(manualRows[manualRows.length - 1])) {
      manualRow.remove();
    } else {
      clearMaterialManualCells();
    }
    ensureTrailingBlankMaterialRow();
    return;
  }

  const editButton = event.target.closest("[data-edit-row-id]");
  if (editButton) {
    const row = materialSavedRows.find((item) => item.id === editButton.dataset.editRowId);
    fillMaterialManualCells(row, template);
    materialResultRows.querySelector(".material-sheet-cell")?.focus();
    return;
  }

  const deleteButton = event.target.closest("[data-row-id]");
  if (!deleteButton) return;
  if (editingMaterialRowId === deleteButton.dataset.rowId) {
    editingMaterialRowId = null;
  }
  materialSavedRows = materialSavedRows.filter((row) => row.id !== deleteButton.dataset.rowId);
  saveMaterialRows();
  renderMaterialResultTable();
});

materialResultRows?.addEventListener("keydown", (event) => {
  const cell = event.target.closest(".material-sheet-cell");
  if (!cell) return;

  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    cell.closest(".material-manual-row")?.querySelector("[data-manual-save]")?.click();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    focusSiblingMaterialCell(cell, event.shiftKey ? -1 : 1);
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    focusSiblingMaterialCell(cell, event.shiftKey ? -1 : 1);
  }
});

materialResultRows?.addEventListener("input", (event) => {
  const cell = event.target.closest(".material-sheet-cell");
  if (!cell) return;
  ensureTrailingBlankMaterialRow();
});

document.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".column-resize-handle");
  if (!handle) return;
  event.preventDefault();
  const header = handle.closest("th");
  const table = header?.closest("table");
  if (!header || !table) return;

  const startX = event.clientX;
  const startWidth = header.getBoundingClientRect().width;
  const columnIndex = Number(header.dataset.columnIndex);
  const columnKey = header.dataset.columnKey;
  handle.classList.add("is-resizing");
  document.body.classList.add("is-resizing-column");

  const onMove = (moveEvent) => {
    applyMaterialColumnWidth(table, columnIndex, startWidth + moveEvent.clientX - startX);
  };
  const onEnd = () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onEnd);
    handle.classList.remove("is-resizing");
    document.body.classList.remove("is-resizing-column");
    const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
    let widths = {};
    try { widths = JSON.parse(localStorage.getItem(`${materialStorageKey}-column-widths-${template.key}`) || "{}"); } catch (error) { widths = {}; }
    widths[columnKey] = Math.round(header.getBoundingClientRect().width);
    try { localStorage.setItem(`${materialStorageKey}-column-widths-${template.key}`, JSON.stringify(widths)); } catch (error) {}
  };
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onEnd, {once:true});
});

clearMaterialTableButton?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  materialSavedRows = materialSavedRows.filter((row) => !isMaterialRowForTemplate(row, template));
  saveMaterialRows();
  renderMaterialResultTable();
});

addMaterialTableRowButton?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const row = renderMaterialManualInputRow(template, getMaterialVisibleFields(template));
  row?.querySelector(".material-sheet-cell")?.focus();
  row?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});
});

desaDataForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const wasEditing = Boolean(editingDesaRowId);
  const submitButton = desaDataForm.querySelector('[type="submit"]');
  if (!submitButton) return;
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i data-lucide="loader-circle"></i>Menyimpan...';
  if (window.lucide) lucide.createIcons();
  await addDesaDataRow();
  submitButton.innerHTML = wasEditing
    ? '<i data-lucide="check"></i>Data Desa Diperbarui'
    : '<i data-lucide="check"></i>Data Desa Tersimpan';
  if (window.lucide) lucide.createIcons();
  window.setTimeout(() => {
    setDesaSubmitMode(false);
    if (window.lucide) lucide.createIcons();
  }, 1400);
});

desaDataForm?.addEventListener("reset", () => {
  editingDesaRowId = null;
  window.setTimeout(() => setDesaSubmitMode(false), 0);
});

desaDataRows?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-desa-row-id]");
  if (editButton) {
    const row = desaSavedRows.find((item) => item.id === editButton.dataset.editDesaRowId);
    if (!row) return;
    editingDesaRowId = row.id;
    fillDesaForm(row);
    setDesaSubmitMode(true);
    document.querySelector("#inputDataDesa")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const deleteButton = event.target.closest("[data-desa-row-id]");
  if (!deleteButton) return;
  if (editingDesaRowId === deleteButton.dataset.desaRowId) {
    editingDesaRowId = null;
    setDesaSubmitMode(false);
  }
  desaSavedRows = desaSavedRows.filter((row) => row.id !== deleteButton.dataset.desaRowId);
  saveDesaRows();
  renderDesaDataTable();
});

clearDesaDataTableButton?.addEventListener("click", () => {
  desaSavedRows = [];
  editingDesaRowId = null;
  setDesaSubmitMode(false);
  saveDesaRows();
  renderDesaDataTable();
});

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const viewName = link.dataset.view;
    activateView(viewName);
  });
});

const initialHash = window.location.hash.replace("#", "");
if (adminConfig[initialHash]) {
  activateView(initialHash);
}

renderMaterialForm("dashboard");
loadMaterialRows();
renderMaterialResultTable();
loadDesaRows();
renderDesaDataTable();

let harvestChart;

const harvestCanvas = document.querySelector("#harvestChart");
const distributionCanvas = document.querySelector("#distributionChart");

if (window.Chart && harvestCanvas) {
  harvestChart = new Chart(harvestCanvas, {
    type: "line",
    data: {
      labels: harvestData.daily.labels,
      datasets: [
        {
          label: "Dokumen Masuk",
          data: harvestData.daily.fruits,
          borderColor: theme.primary,
          backgroundColor: "rgba(20, 85, 143, 0.16)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 3,
        },
        {
          label: "Terverifikasi",
          data: harvestData.daily.herbs,
          borderColor: theme.warning,
          backgroundColor: "rgba(244, 182, 63, 0.18)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 3,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          labels: {
            color: theme.muted,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "#222222",
          padding: 12,
          titleColor: "#ffffff",
          bodyColor: "#f7f7f7",
        },
      },
      scales: {
        x: {
          ticks: { color: theme.muted },
          grid: { color: "transparent" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: theme.muted },
          grid: { color: theme.grid },
        },
      },
    },
  });

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const range = button.dataset.range;
      rangeButtons.forEach((item) => item.classList.toggle("active", item === button));
      harvestChart.data.labels = harvestData[range].labels;
      harvestChart.data.datasets[0].data = harvestData[range].fruits;
      harvestChart.data.datasets[1].data = harvestData[range].herbs;
      harvestChart.update();
    });
  });
}

if (window.Chart && distributionCanvas) {
  new Chart(distributionCanvas, {
    type: "doughnut",
    data: {
      labels: ["Terverifikasi", "Dalam Review", "Draft"],
      datasets: [
        {
          data: [68, 21, 11],
          backgroundColor: [theme.primary, theme.warning, theme.accent],
          borderColor: "#ffffff",
          borderWidth: 6,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#222222",
          padding: 12,
        },
      },
    },
  });
}

if (window.bootstrap) {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    new bootstrap.Tooltip(element);
  });
}

if (window.lucide) {
  lucide.createIcons();
}
// --- EXCEL IMPORT / EXPORT LOGIC ---
const exportExcelBtn = document.querySelector("#exportExcelBtn");
const importExcelBtn = document.querySelector("#importExcelBtn");
const importExcelFile = document.querySelector("#importExcelFile");

exportExcelBtn?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const filteredRows = materialSavedRows.filter(row => row.formKey === currentMaterialFormKey || row.form === template.title);
  if (filteredRows.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const data = filteredRows.map((row, index) => {
    const item = { "No": index + 1 };
    template.fields.forEach(field => {
      const valObj = row.values ? row.values.find(v => v.name === field.name || v.label === field.label) : null;
      item[field.label] = valObj ? valObj.value : "-";
    });
    return item;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tersimpan");
  XLSX.writeFile(workbook, `data_${currentMaterialFormKey}.xlsx`);
});

importExcelBtn?.addEventListener("click", () => {
  importExcelFile?.click();
});

importExcelFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
      const createdAt = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      json.forEach((item) => {
        const values = [];
        template.fields.forEach(field => {
          const val = item[field.label] !== undefined ? String(item[field.label]) : "-";
          values.push({
            label: field.label,
            name: field.name,
            value: val
          });
        });

        materialSavedRows.unshift({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          module: activeMaterialModule.title,
          form: template.title,
          formKey: currentMaterialFormKey,
          summary: summarizeMaterialValues(values),
          status: "Berhasil di input",
          createdAt,
          values
        });
      });

      saveMaterialRows();
      renderMaterialResultTable();
      importExcelFile.value = "";
      alert(`Berhasil mengimport ${json.length} baris data!`);
    } catch(err) {
      alert("Format berkas Excel tidak sesuai / gagal di-import!");
    }
  };
  reader.readAsArrayBuffer(file);
});

