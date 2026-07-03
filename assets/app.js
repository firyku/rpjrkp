const activitySearch = document.querySelector("#activitySearch");
const activityRows = Array.from(document.querySelectorAll("#activitiesTable tr"));
const rangeButtons = Array.from(document.querySelectorAll("[data-range]"));
const taskCount = document.querySelector("#taskCount");
const sideNavLinks = Array.from(document.querySelectorAll(".side-nav a"));
const viewLinks = Array.from(document.querySelectorAll("[data-view]"));
const materialMenuLinks = Array.from(document.querySelectorAll("[data-material-form]"));
const materialAutoForm = document.querySelector("#materialAutoFormFields");
const materialFormKicker = document.querySelector("#materialFormKicker");
const materialFormHeading = document.querySelector("#materialFormHeading");
const materialFormDescription = document.querySelector("#materialFormDescription");
const materialFormIcon = document.querySelector(".material-form-icon");
const materialResultHead = document.querySelector("#materialResultHead");
const materialResultRows = document.querySelector("#materialResultRows");
const clearMaterialTableButton = document.querySelector("#clearMaterialTable");
const desaDataForm = document.querySelector("#desaDataForm");
const desaDataRows = document.querySelector("#desaDataRows");
const clearDesaDataTableButton = document.querySelector("#clearDesaDataTable");
const visiDesaList = document.querySelector("#visiDesaList");
const addVisiDesaItemButton = document.querySelector("#addVisiDesaItem");
const dashboardView = document.querySelector("#dashboardView");
const adminView = document.querySelector("#adminView");

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
  return {
    label,
    name: normalizeAccessName(label),
    type,
    full: type === "textarea",
    placeholder: label,
  };
}

function accessFields(columns, textareaColumns = []) {
  const textareaSet = new Set(textareaColumns);
  return columns.map((label) => accessField(label, textareaSet.has(label) ? "textarea" : "text"));
}

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
    ], ["Baground Caver", "Foto_Kades", "Gambar_cover_RPJMdesa", "Ganbar_Bagan_kelembagaan", "Ganbar_sketsa_desa", "LOGO KAB", "LOGO KEMENTRIAN", "Tentang_Perdes_RPJMDes"]),
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
    fields: accessFields([
      "Agama Mayoritas", "angka rata - rata curah hujan per tahunn", "Jarak Ke-Kabupaten",
      "Jumlah Kematian Bayi tiga Tahun Terakhir", "Jumlah RT", "Komoditas Utama (bila lebih satu (,))",
      "Luas Wilayah (Ha)", "Mata Pencarian Terbanyak", "Profil Pada Semester", "Profil Tahun",
      "Sebagian Besar Lahan", "SEbelah barat", "SEbelah selatan", "SEbelah timur", "SEbelah Utara",
      "Suhu Rata-Rata 0C maksimum", "Suhu Rata-Rata 0C minimum",
    ]),
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
  input_data_penting: {
    key: "input_data_penting",
    icon: "badge-info",
    title: "Input Data Penting",
    description: "Data kunci dari tabel Data Umum untuk kebutuhan dokumen RPJMDesa.",
    fields: accessFields([
      "Jenis_RPJMdes", "Jumlah Dusun (angka)", "Jumlah Dusun (huruf)", "Jumlah Kepala Keluarga (KK)",
      "No Perdes RPJMDEs yg di cabut", "No sk tim penyusun RPJMDes",
      "Peiode RPJMDes Lama yang di cabut (mulai - akhir)", "Perdes RPJMdesa", "Periode RPJMDesa Ke",
      "STATUS PERDES_RPJMDes", "Tahun akhir Periode RPJMdesa", "Tahun Awal Periode RPJMdesa",
      "Tanggal Pengundangan perdes RPJMDes", "Tanggal_Penyusunan_RPJMDes", "Tentang_Perdes_RPJMDes",
      "Tgl Penetapan Perdes RPJMDesa", "Visi Desa",
    ], ["Tentang_Perdes_RPJMDes"]),
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
  } else {
    control = document.createElement("input");
    control.type = field.type || "text";
  }

  control.name = field.name;
  if (field.placeholder) control.placeholder = field.placeholder;
  if (field.value && field.type !== "select") control.value = field.value;
  label.append(control);

  return label;
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
  template.fields.forEach((field) => {
    materialAutoForm.append(createMaterialField(field));
  });

  const actions = document.createElement("div");
  actions.className = "material-form-actions span-2";
  actions.innerHTML = `
    <button type="submit"><i data-lucide="save"></i>Simpan Data</button>
    <button type="reset"><i data-lucide="rotate-ccw"></i>Reset</button>
  `;
  materialAutoForm.append(actions);

  if (window.lucide) {
    lucide.createIcons();
  }

  renderMaterialResultTable();
}

function getMaterialFormValues() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = [];

  template.fields.forEach((field) => {
    const control = materialAutoForm?.elements[field.name];
    if (!control) return;
    values.push({
      label: field.label,
      name: field.name,
      value: String(control.value || "").trim() || "-",
    });
  });

  return values;
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
  return valueMap[field.name] || valueMap[field.label] || "-";
}

function isMaterialRowForTemplate(row, template) {
  return row.formKey ? row.formKey === template.key : row.form === template.title;
}

function renderMaterialResultHeader(template) {
  if (!materialResultHead) return;
  const visibleFields = getMaterialVisibleFields(template);
  const headerRow = document.createElement("tr");
  const table = materialResultHead.closest("table");

  [...visibleFields.map((field) => field.label), "Aksi"].forEach((label) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = label;
    headerRow.append(headerCell);
  });

  if (table) {
    table.style.minWidth = `${Math.max(960, (visibleFields.length + 1) * 150)}px`;
  }

  materialResultHead.innerHTML = "";
  materialResultHead.append(headerRow);
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
  editButton.className = "material-edit-row";
  editButton.type = "button";
  editButton.dataset.manualSave = template.key;
  editButton.innerHTML = '<i data-lucide="pencil"></i>Edit';

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
      cell.textContent = value;
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

function addMaterialResultRow() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = getMaterialFormValues();
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
    emptyRow.innerHTML = '<td colspan="12">Belum ada Data Desa yang berhasil diinput.</td>';
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

materialAutoForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = materialAutoForm.querySelector('[type="submit"]');
  if (!submitButton) return;
  addMaterialResultRow();
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

clearMaterialTableButton?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  materialSavedRows = materialSavedRows.filter((row) => !isMaterialRowForTemplate(row, template));
  saveMaterialRows();
  renderMaterialResultTable();
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
