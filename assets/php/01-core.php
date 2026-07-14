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

function updateRpjmIdentityCards() {
  const data = desaSavedRows[0] || {};
  const logo = document.querySelector("#rpjmLogoKabupaten");
  const logoPlaceholder = document.querySelector("#rpjmLogoPlaceholder");
  const foto = document.querySelector("#rpjmFotoKades");
  const fotoPlaceholder = document.querySelector("#rpjmFotoPlaceholder");
  const namaDesa = document.querySelector("#rpjmNamaDesa");
  const namaKades = document.querySelector("#rpjmNamaKades");
  const masa = document.querySelector("#rpjmMasaJabatan");
  const masaCaption = document.querySelector("#rpjmMasaJabatanCaption");

  const syncImage = (image, placeholder, fileData) => {
    if (!image || !placeholder) return;
    const source = fileData?.dataUrl || "";
    image.hidden = !source;
    placeholder.hidden = Boolean(source);
    if (source) image.src = source;
  };

  syncImage(logo, logoPlaceholder, data.logo_kabupaten);
  syncImage(foto, fotoPlaceholder, data.foto_kades);
  if (namaDesa) namaDesa.textContent = data.desa || "Nama Desa";
  if (namaKades) namaKades.textContent = data.nama_kepala_desa || "Nama Kepala Desa";

  const awal = data.tahun_awal_periode_rpjmdesa || activeMaterialModule.year?.split("-")[0] || "-";
  const akhir = data.tahun_akhir_periode_rpjmdesa || activeMaterialModule.year?.split("-")[1] || "-";
  const periode = `${awal} s/d ${akhir}`;
  if (masa) masa.textContent = periode;
  if (masaCaption) masaCaption.textContent = periode;
}

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

