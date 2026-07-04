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
    fields: [
      { label: "Kode", name: "kode", type: "text", placeholder: "Contoh: BAB I" },
      { label: "Isi", name: "isi", type: "text", placeholder: "Judul daftar isi" },
      { label: "Kode Uraian", name: "kode_uraian", type: "text", placeholder: "Kode uraian" },
      { label: "Halaman", name: "halaman", type: "number", placeholder: "0" },
      { label: "Uraian", name: "uraian", type: "textarea", full: true, placeholder: "Uraian isi dokumen" },
    ],
  },
  input_data_umum: {
    key: "input_data_umum",
    icon: "database",
    title: "Input Data Umum",
    description: "Form ringkas tabel Data Umum untuk identitas RPJMDesa.",
    fields: [
      { label: "Desa (huruf Kecil)", name: "desa", type: "select", options: ["Gudangharjo"], value: "Gudangharjo" },
      { label: "Nama Ketua Tim Penyusun", name: "nama_ketua_tim_penyusun", type: "text", value: "Fitriana" },
      { label: "Kecamatan (huruf Kecil)", name: "kecamatan", type: "text", value: "Paranggupito" },
      { label: "Nama Ketua BPD", name: "nama_ketua_bpd", type: "text", value: "Joko Ratmanto" },
      { label: "Kabupaten (huruf Kecil)", name: "kabupaten", type: "text", value: "Wonogiri" },
      { label: "Nomor SK Tim Penyusun", name: "nomor_sk_tim_penyusun", type: "text", value: "5 Tahun 2025" },
      { label: "Provinsi (huruf Kecil)", name: "provinsi", type: "text", value: "Jawa Tengah" },
      { label: "Jenis RPJMDesa", name: "jenis_rpjmdesa", type: "select", options: ["Perubahan", "Murni"], value: "Perubahan" },
      { label: "Visi Desa", name: "visi_desa", type: "textarea", value: "\"Gudangharjo Mandiri, berkelanjutan\"" },
      { label: "Isian Tentang Perdes RPJMDesa", name: "isian_tentang_perdes_rpjmdesa", type: "textarea", value: "PERUBAHAN ATAS PERATURAN DESA NOMOR 3 TAHUN 2020 TENTANG RENCANA PEMBANGUNAN JANGKA MENENGAH DESA DESA GUDANGHARJO KECAMATAN PARANGGUPITO TAHUN 2021 - 2028" },
      { label: "Nama Kepala Desa", name: "nama_kepala_desa", type: "text", value: "SRIYONO" },
      { label: "Tanggal Pengundangan Perdes RPJMDesa", name: "tanggal_pengundangan_perdes_rpjmdesa", type: "text", value: "19 Juni 2025" },
      { label: "Nama Sekretaris Desa", name: "nama_sekretaris_desa", type: "text", value: "EDY RACHMAT CAHYONO" },
      { label: "Alamat Desa", name: "alamat_desa", type: "text", value: "Jl. Pantai Nampu Km.2" },
      { label: "Perdes RPJMDesa", name: "perdes_rpjmdesa", type: "text", value: "2 Tahun 2025" },
      { label: "Status Perdes RPJMDesa", name: "status_perdes_rpjmdesa", type: "select", options: ["PERATURAN DESA", "RANCANGAN PERATURAN DESA"], value: "PERATURAN DESA" },
    ],
  },
  input_misi_desa: {
    key: "input_misi_desa",
    icon: "target",
    title: "Input Misi Desa",
    description: "Form mengikuti tabel Access misi.",
    fields: [
      { label: "Misi Desa", name: "misi_list", type: "mission_list", full: true },
    ],
  },
  input_sejarah_desa: {
    key: "input_sejarah_desa",
    icon: "book-open",
    title: "Input Sejarah Desa",
    description: "Form mengikuti tabel sejarah pada Access.",
    fields: [
      { label: "Uraian Sejarah", name: "uraian_sejarah", type: "textarea", full: true, placeholder: "Uraian sejarah desa" }
    ]
  },
  input_sejarah_kades: {
    key: "input_sejarah_kades",
    icon: "users",
    title: "Sejarah Jabatan Kepala Desa",
    description: "Form mengikuti tabel nm_KADES pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Nama Kepala Desa", name: "nama_kepala_desa", type: "text", placeholder: "Nama Kepala Desa" },
      { label: "Tahun", name: "tahun", type: "text", placeholder: "Contoh: 2021-2027" }
    ]
  },
  input_profil_pendidikan: {
    key: "input_profil_pendidikan",
    icon: "graduation-cap",
    title: "Input Profil Tentang Pendidikan",
    description: "Form mengikuti tabel pendidikan pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Pendidikan", name: "pendidikan", type: "text", placeholder: "Tingkat pendidikan" },
      { label: "L (Laki-laki)", name: "l", type: "number", placeholder: "Jumlah Laki-laki" },
      { label: "P (Perempuan)", name: "p", type: "number", placeholder: "Jumlah Perempuan" },
      { label: "Jumlah", name: "jumlah", type: "number", placeholder: "Total" }
    ]
  },
  input_profil_kesehatan: {
    key: "input_profil_kesehatan",
    icon: "activity",
    title: "Input Profil Tentang Kesehatan",
    description: "Form mengikuti tabel kesehatan pada Access.",
    fields: [
      { label: "Uraian", name: "uraian", type: "text", placeholder: "Uraian kondisi kesehatan" },
      { label: "T1 (Tahun 1)", name: "t1", type: "number", placeholder: "Jumlah" },
      { label: "T2 (Tahun 2)", name: "t2", type: "number", placeholder: "Jumlah" },
      { label: "T3 (Tahun 3)", name: "t3", type: "number", placeholder: "Jumlah" }
    ]
  },
  input_profil_pekerjaan: {
    key: "input_profil_pekerjaan",
    icon: "briefcase",
    title: "Input Profil Tentang Mata Pencaharian",
    description: "Form mengikuti tabel pekerjaan pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Pekerjaan", name: "pekerjaan", type: "text", placeholder: "Jenis pekerjaan" },
      { label: "Jumlah", name: "jumlah", type: "text", placeholder: "Jumlah pekerja" }
    ]
  },
  input_profil_agama: {
    key: "input_profil_agama",
    icon: "bookmark",
    title: "Input Profil Tentang Agama",
    description: "Form mengikuti tabel agama pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Agama", name: "agama", type: "text", placeholder: "Nama agama" },
      { label: "Jumlah", name: "jumlah", type: "number", placeholder: "Jumlah penganut" }
    ]
  },
  input_profil_infrastruktur: {
    key: "input_profil_infrastruktur",
    icon: "wrench",
    title: "Input Profil Tentang Infrastruktur",
    description: "Form mengikuti tabel jalan pada Access.",
    fields: [
      { label: "No", name: "no", type: "text", placeholder: "1" },
      { label: "Jenis", name: "jenis", type: "text", placeholder: "Jenis infrastruktur" },
      { label: "Uraian", name: "uraian", type: "text", placeholder: "Uraian" },
      { label: "Baik", name: "baik", type: "number", placeholder: "Kondisi baik" },
      { label: "Satuan Baik", name: "satuan_baik", type: "text", placeholder: "Satuan" },
      { label: "Rusak", name: "rusak", type: "number", placeholder: "Kondisi rusak" },
      { label: "Satuan Rusak", name: "satuan_rusak", type: "text", placeholder: "Satuan" },
      { label: "Jumlah", name: "jumlah", type: "number", placeholder: "Total" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Satuan" }
    ]
  },
  input_profil_irigasi: {
    key: "input_profil_irigasi",
    icon: "droplets",
    title: "Input Profil Tentang Irigasi",
    description: "Form mengikuti tabel irigasi pada Access.",
    fields: [
      { label: "No", name: "no", type: "text", placeholder: "1" },
      { label: "Uraian", name: "uraian", type: "text", placeholder: "Uraian irigasi" },
      { label: "Baik", name: "baik", type: "number", placeholder: "Kondisi baik" },
      { label: "Rusak", name: "rusak", type: "number", placeholder: "Kondisi rusak" },
      { label: "Jumlah", name: "jumlah", type: "number", placeholder: "Total" }
    ]
  },
  input_profil_pemukiman: {
    key: "input_profil_pemukiman",
    icon: "home",
    title: "Input Profil Tentang Pemukiman",
    description: "Form mengikuti tabel RTLH pada Access.",
    fields: [
      { label: "No", name: "no", type: "text", placeholder: "1" },
      { label: "Uraian", name: "uraian", type: "text", placeholder: "Uraian pemukiman" },
      { label: "Baik", name: "baik", type: "number", placeholder: "Kondisi baik" },
      { label: "Satuan Baik", name: "satuan_baik", type: "text", placeholder: "Satuan" },
      { label: "Rusak", name: "rusak", type: "number", placeholder: "Kondisi rusak" },
      { label: "Satuan Rusak", name: "satuan_rusak", type: "text", placeholder: "Satuan" },
      { label: "Jumlah", name: "jumlah", type: "number", placeholder: "Total" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Satuan" }
    ]
  },
  input_dusun: {
    key: "input_dusun",
    icon: "map-pin",
    title: "Input Dusun",
    description: "Form mengikuti tabel Dusun pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Nama Dusun", name: "nama_dusun", type: "text", placeholder: "Nama Dusun" },
      { label: "Jumlah RW", name: "jumlah_rw", type: "number", placeholder: "Jumlah RW" },
      { label: "Jumlah RT", name: "jumlah_rt", type: "number", placeholder: "Jumlah RT" },
      { label: "Nama Kepala Dusun", name: "nama_kepala_dusun", type: "text", placeholder: "Nama Kepala Dusun" }
    ]
  },
  input_sotk: {
    key: "input_sotk",
    icon: "network",
    title: "Input SOTK",
    description: "Form mengikuti tabel sotk pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Nama", name: "nama", type: "text", placeholder: "Nama lengkap" },
      { label: "Jabatan", name: "jabatan", type: "text", placeholder: "Jabatan SOTK" }
    ]
  },
  input_bpd: {
    key: "input_bpd",
    icon: "user-check",
    title: "Input Data BPD",
    description: "Form mengikuti tabel bpd pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Nama", name: "nama", type: "text", placeholder: "Nama lengkap" },
      { label: "Jabatan", name: "jabatan", type: "text", placeholder: "Jabatan BPD" }
    ]
  },
  input_profil_penduduk: {
    key: "input_profil_penduduk",
    icon: "trending-up",
    title: "Input Profil Tentang Pertumbuhan Penduduk",
    description: "Form mengikuti tabel pertumbuhan penduduk pada Access.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Kelompok Umur (Tahun)", name: "kelompok_umur", type: "text", placeholder: "Contoh: 0-4" },
      { label: "Laki-Laki (jiwa)", name: "laki_laki", type: "number", placeholder: "Jumlah Laki-laki" },
      { label: "Perempuan (jiwa)", name: "perempuan", type: "number", placeholder: "Jumlah Perempuan" },
      { label: "Jumlah (Jiwa)", name: "jumlah", type: "number", placeholder: "Total" }
    ]
  },
  input_data_dusun: {
    key: "input_data_dusun",
    icon: "map",
    title: "Input Data Dusun",
    description: "Form pendataan rinci untuk kependudukan per Dusun.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Nama Dusun", name: "nama_dusun", type: "text", placeholder: "Nama Dusun" },
      { label: "Nama Ketua RT", name: "nama_ketua_rt", type: "text", placeholder: "Nama Ketua RT" },
      { label: "Jumlah Penduduk (Laki-Laki)", name: "jml_l", type: "number", placeholder: "Jumlah L" },
      { label: "Jumlah Penduduk (Perempuan)", name: "jml_p", type: "number", placeholder: "Jumlah P" }
    ]
  },
  input_rktl: {
    key: "input_rktl",
    icon: "calendar-clock",
    title: "Input RKTL",
    description: "Form mengikuti tabel rktl RPJMdesa.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Hari", name: "hari", type: "text", placeholder: "Contoh: Senin" },
      { label: "Tanggal", name: "tanggal", type: "date" },
      { label: "Bulan", name: "bulan", type: "text", placeholder: "Nama bulan" },
      { label: "Tahun", name: "tahun", type: "number", value: "2026" },
      { label: "Pukul", name: "pukul", type: "text", placeholder: "Contoh: 09.00 WIB" },
      { label: "Tempat", name: "tempat", type: "text", placeholder: "Tempat kegiatan" },
      { label: "Jenis", name: "jenis", type: "select", options: ["RPJMDesa", "Musdes", "Musdus/Kelompok", "Verifikasi"], value: "RPJMDesa" },
      { label: "Uraian", name: "uraian", type: "textarea", full: true, placeholder: "Uraian rencana tindak lanjut" },
    ],
  },
  input_musdes: {
    key: "input_musdes",
    icon: "users",
    title: "Input Musdes",
    description: "Form mengikuti tabel musdes RPJMDes.",
    fields: [
      { label: "Nomor", name: "nomor", type: "number", placeholder: "1" },
      { label: "Jenis Musdes", name: "jenis_musdes", type: "text", placeholder: "Jenis musyawarah desa" },
      { label: "Pemimpin", name: "pemimpin", type: "text", placeholder: "Nama pemimpin" },
      { label: "Pemimpin Dari Unsur", name: "pemimpin_unsur", type: "text", placeholder: "Unsur pemimpin" },
      { label: "Notulen", name: "notulen", type: "text", placeholder: "Nama notulen" },
      { label: "Notulen Dari Unsur", name: "notulen_unsur", type: "text", placeholder: "Unsur notulen" },
      { label: "Narasumber 1", name: "narsum_1", type: "text", placeholder: "Nama narasumber" },
      { label: "Narasumber 1 Dari Unsur", name: "narsum_1_unsur", type: "text", placeholder: "Unsur narasumber" },
      { label: "Wakil Masyarakat", name: "wakil_masyarakat", type: "textarea", full: true, placeholder: "Daftar wakil masyarakat" },
    ],
  },
  input_data_penting: {
    key: "input_data_penting",
    icon: "badge-info",
    title: "Input Data Penting",
    description: "Data kunci dari tabel Data Umum untuk kebutuhan dokumen RPJMDesa.",
    fields: [
      { label: "Periode RPJMDesa Ke", name: "periode_rpjmdesa_ke", type: "text", placeholder: "Contoh: Ke-2" },
      { label: "Tahun Awal Periode RPJMDesa", name: "tahun_awal_periode", type: "number", placeholder: "2026" },
      { label: "Tahun Akhir Periode RPJMDesa", name: "tahun_akhir_periode", type: "number", placeholder: "2031" },
      { label: "Jumlah Dusun (angka)", name: "jumlah_dusun_angka", type: "number", placeholder: "0" },
      { label: "Jumlah Dusun (huruf)", name: "jumlah_dusun_huruf", type: "text", placeholder: "Contoh: Lima" },
      { label: "Jumlah Kepala Keluarga (KK)", name: "jumlah_kk", type: "number", placeholder: "0" },
      { label: "Tanggal Penyusunan RPJMDes", name: "tanggal_penyusunan_rpjmdes", type: "text", placeholder: "Contoh: 19 Mei 2025" },
      { label: "Tentang Perdes RPJMDes", name: "tentang_perdes_rpjmdes", type: "textarea", full: true, placeholder: "Uraian tentang Perdes RPJMDes" },
    ],
  },
  input_renc_pendapatan: {
    key: "input_renc_pendapatan",
    icon: "wallet-cards",
    title: "Input Renc Pendapatan",
    description: "Form rencana pendapatan untuk lampiran perencanaan RPJMDesa.",
    fields: [
      { label: "Kode Pendapatan", name: "kode_pendapatan", type: "text", placeholder: "Kode rekening" },
      { label: "Uraian Pendapatan", name: "uraian_pendapatan", type: "text", placeholder: "Uraian pendapatan" },
      { label: "Tahun Ke-1", name: "tahun_1", type: "number", placeholder: "0" },
      { label: "Tahun Ke-2", name: "tahun_2", type: "number", placeholder: "0" },
      { label: "Tahun Ke-3", name: "tahun_3", type: "number", placeholder: "0" },
      { label: "Sumber Dana", name: "sumber_dana", type: "text", placeholder: "Contoh: DD, ADD, PADes" },
      { label: "Keterangan", name: "keterangan", type: "textarea", full: true, placeholder: "Catatan rencana pendapatan" },
    ],
  },
  input_matrik: {
    key: "input_matrik",
    icon: "table-properties",
    title: "Input Matrik",
    description: "Form mengikuti tabel matrik RPJMDesa.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Paket Kegiatan", name: "paket_kegiatan", type: "text", placeholder: "Nama paket kegiatan" },
      { label: "Bidang", name: "bidang", type: "text", placeholder: "Bidang" },
      { label: "Sub Bidang", name: "sub_bidang", type: "text", placeholder: "Sub bidang" },
      { label: "Kegiatan", name: "kegiatan", type: "text", placeholder: "Nama kegiatan" },
      { label: "Lokasi (RT/RW)", name: "lokasi_rt_rw", type: "text", placeholder: "Lokasi kegiatan" },
      { label: "Volume Tahun 1", name: "th1", type: "number", placeholder: "0" },
      { label: "Volume Tahun 2", name: "th2", type: "number", placeholder: "0" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Satuan" },
      { label: "Anggaran Tahun 1", name: "th1_anggaran", type: "number", placeholder: "0" },
      { label: "Sumber Dana", name: "sumber_dana", type: "text", placeholder: "Sumber dana" },
      { label: "Asal Usulan", name: "asal_usulan", type: "text", placeholder: "Asal usulan" },
      { label: "SDGs", name: "sdgs", type: "text", placeholder: "SDGs terkait" },
      { label: "Pola Pelaksanaan", name: "pola_pelaksanaan", type: "select", options: ["Swakelola", "Kerjasama Antar Desa", "Kerjasama Pihak ke-3"], value: "Swakelola" },
    ],
  },
  input_musdus_kelompok: {
    key: "input_musdus_kelompok",
    icon: "messages-square",
    title: "Mudus/Kelompok",
    description: "Form mengikuti tabel musdus / kelompok RPJMDes.",
    fields: [
      { label: "Nomor", name: "nomor", type: "number", placeholder: "1" },
      { label: "Jenis Musdus/Nama Musdus", name: "jenis_musdus", type: "text", placeholder: "Nama musdus/kelompok" },
      { label: "Pemimpin", name: "pemimpin", type: "text", placeholder: "Nama pemimpin" },
      { label: "Pemimpin Dari Unsur", name: "pemimpin_unsur", type: "text", placeholder: "Unsur pemimpin" },
      { label: "Notulen", name: "notulen", type: "text", placeholder: "Nama notulen" },
      { label: "Lokasi (Bila Dusun)", name: "lokasi_dusun", type: "number", placeholder: "Kode lokasi" },
      { label: "Jam", name: "jam", type: "text", placeholder: "Contoh: 09.00 WIB" },
      { label: "Hari Dan Tanggal", name: "hari_tanggal", type: "text", placeholder: "Hari dan tanggal" },
      { label: "Tempat", name: "tempat", type: "text", placeholder: "Tempat musdus/kelompok" },
      { label: "Nama Kepala Dusun/Kelompok", name: "nama_kepala_dusun_kelompok", type: "text", placeholder: "Nama kepala dusun/kelompok" },
      { label: "Wakil Masyarakat", name: "wakil_masyarakat", type: "textarea", full: true, placeholder: "Daftar wakil masyarakat" },
    ],
  },
  program_masuk_desa: {
    key: "program_masuk_desa",
    icon: "building-2",
    title: "Program Masuk Desa",
    description: "Form mengikuti tabel masuk desa.",
    fields: [
      { label: "No Bidang", name: "no_bidang", type: "text", placeholder: "Kode bidang" },
      { label: "Bidang", name: "bidang", type: "text", placeholder: "Nama bidang" },
      { label: "No Kegiatan", name: "no_kegiatan", type: "text", placeholder: "Nomor kegiatan" },
      { label: "Nama Program/Kegiatan", name: "nama_program_kegiatan", type: "text", placeholder: "Nama program/kegiatan" },
      { label: "Pelaksana Pemerintah", name: "pelaksana_pemerintah", type: "text", placeholder: "Pusat/Provinsi/Kabupaten" },
      { label: "SDGs", name: "sdgs", type: "text", placeholder: "SDGs terkait" },
      { label: "Tahun Pelaksanaan", name: "tahun_pelaksanaan", type: "number", placeholder: "2026" },
      { label: "Lokasi Kegiatan", name: "lokasi_kegiatan", type: "text", placeholder: "Dusun/RT/RW" },
      { label: "Volume", name: "volume", type: "text", placeholder: "Volume" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Satuan" },
      { label: "Total Pagu", name: "total_pagu", type: "number", placeholder: "0" },
    ],
  },
  input_rekomendasi_sdgs: {
    key: "input_rekomendasi_sdgs",
    icon: "sparkles",
    title: "Input Rekomendasi SDGs",
    description: "Form mengikuti tabel eval_sdgs dan usulan sdgs.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Indikator", name: "indikator", type: "number", placeholder: "0" },
      { label: "Nama Program", name: "nama_program", type: "text", placeholder: "Nama program" },
      { label: "Mendukung SDGs Desa Ke-", name: "mendukung_sdgs", type: "number", placeholder: "0" },
      { label: "Data Eksisting", name: "data_eksisting", type: "text", placeholder: "Kondisi awal" },
      { label: "Volume", name: "volume", type: "number", placeholder: "0" },
      { label: "Satuan", name: "satuan", type: "text", placeholder: "Satuan" },
      { label: "Jumlah (Rp)", name: "jumlah_rp", type: "number", placeholder: "0" },
      { label: "Sumber", name: "sumber", type: "text", placeholder: "Sumber pendanaan" },
      { label: "Pola", name: "pola", type: "text", placeholder: "Pola pelaksanaan" },
    ],
  },
  input_prioritas: {
    key: "input_prioritas",
    icon: "arrow-up-narrow-wide",
    title: "Input Penentuan/Prioritas",
    description: "Form prioritas tindakan pemecahan masalah dan peringkat kegiatan.",
    fields: [
      { label: "No Prioritas", name: "no_prioritas", type: "number", placeholder: "1" },
      { label: "Masalah/Kebutuhan", name: "masalah_kebutuhan", type: "text", placeholder: "Masalah atau kebutuhan" },
      { label: "Tindakan Pemecahan", name: "tindakan_pemecahan", type: "text", placeholder: "Tindakan pemecahan" },
      { label: "Bidang", name: "bidang", type: "text", placeholder: "Bidang kegiatan" },
      { label: "Nilai Prioritas", name: "nilai_prioritas", type: "number", placeholder: "0" },
      { label: "Keterangan", name: "keterangan", type: "textarea", full: true, placeholder: "Catatan prioritas" },
    ],
  },
  inventaris_masalah: {
    key: "inventaris_masalah",
    icon: "circle-alert",
    title: "Daftar Inventaris Masalah",
    description: "Form inventaris masalah untuk bahan olah data perencanaan.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Bidang", name: "bidang", type: "text", placeholder: "Bidang masalah" },
      { label: "Masalah", name: "masalah", type: "textarea", full: true, placeholder: "Uraian masalah" },
      { label: "Lokasi", name: "lokasi", type: "text", placeholder: "Dusun/RT/RW" },
      { label: "Penyebab", name: "penyebab", type: "text", placeholder: "Penyebab masalah" },
      { label: "Alternatif Pemecahan", name: "alternatif_pemecahan", type: "textarea", full: true, placeholder: "Alternatif pemecahan masalah" },
    ],
  },
  inventaris_potensi: {
    key: "inventaris_potensi",
    icon: "leaf",
    title: "Daftar Inventaris Potensi",
    description: "Form inventaris potensi desa untuk penyusunan RPJMDesa.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Kategori Potensi", name: "kategori_potensi", type: "text", placeholder: "Kategori potensi" },
      { label: "Potensi", name: "potensi", type: "textarea", full: true, placeholder: "Uraian potensi" },
      { label: "Lokasi", name: "lokasi", type: "text", placeholder: "Lokasi potensi" },
      { label: "Manfaat", name: "manfaat", type: "textarea", full: true, placeholder: "Manfaat potensi bagi desa" },
    ],
  },
  gagasan_dusun: {
    key: "gagasan_dusun",
    icon: "lightbulb",
    title: "Daftar Gagasan Dusun/Kelompok",
    description: "Form gagasan dusun/kelompok untuk rekapitulasi usulan RPJMDesa.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Dusun/Kelompok", name: "dusun_kelompok", type: "text", placeholder: "Nama dusun/kelompok" },
      { label: "Gagasan Kegiatan", name: "gagasan_kegiatan", type: "textarea", full: true, placeholder: "Uraian gagasan kegiatan" },
      { label: "Pengusul", name: "pengusul", type: "text", placeholder: "Nama pengusul" },
      { label: "Lokasi", name: "lokasi", type: "text", placeholder: "Lokasi kegiatan" },
      { label: "Prakiraan Volume/Satuan", name: "prakiraan_volume_satuan", type: "text", placeholder: "Contoh: 250 meter" },
    ],
  },
  tim_penyusun: {
    key: "tim_penyusun",
    icon: "users-round",
    title: "Susunan Tim Penyusun",
    description: "Form mengikuti tabel tim RPJMDes.",
    fields: [
      { label: "No", name: "no", type: "text", placeholder: "1" },
      { label: "Nama", name: "nama", type: "text", placeholder: "Nama anggota tim" },
      { label: "Jabatan", name: "jabatan", type: "text", placeholder: "Jabatan perangkat/lembaga" },
      { label: "Kedudukan", name: "kedudukan", type: "select", options: ["Pembina", "Ketua", "Sekretaris", "Anggota", "Narasumber"], value: "Anggota" },
    ],
  },
  dasar_hukum_perdes: {
    key: "dasar_hukum_perdes",
    icon: "scroll-text",
    title: "Input Dasar Hukum Perdes",
    description: "Form mengikuti tabel dasar hukum RPJMDes.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Isi Dasar Hukum", name: "isi_dasar_hukum", type: "textarea", full: true, placeholder: "Tuliskan isi dasar hukum Perdes" },
    ],
  },
  dasar_hukum_sk: {
    key: "dasar_hukum_sk",
    icon: "file-check-2",
    title: "Input Dasar Hukum SK",
    description: "Form mengikuti tabel dasar hukum sk rpjmdeS.",
    fields: [
      { label: "No", name: "no", type: "number", placeholder: "1" },
      { label: "Isi Dasar Hukum", name: "isi_dasar_hukum", type: "textarea", full: true, placeholder: "Tuliskan isi dasar hukum SK" },
    ],
  },
  ketentuan_umum_perdes: {
    key: "ketentuan_umum_perdes",
    icon: "book-open-text",
    title: "Isi Ketentuan Umum Perdes",
    description: "Form uraian ketentuan umum untuk naskah Perdes RPJMDesa.",
    fields: [
      { label: "No Uraian", name: "no_uraian", type: "number", placeholder: "1" },
      { label: "Istilah", name: "istilah", type: "text", placeholder: "Contoh: Desa" },
      { label: "Uraian Ketentuan", name: "uraian_ketentuan", type: "textarea", full: true, placeholder: "Isi ketentuan umum Perdes" },
    ],
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
    const container = document.createElement("div");
    container.className = "paragraph-list-container";
    container.style.cssText = "display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 8px;";

    const listWrapper = document.createElement("div");
    listWrapper.className = "paragraph-list-wrapper";
    listWrapper.style.cssText = "display: flex; flex-direction: column; gap: 8px; width: 100%;";
    container.append(listWrapper);

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = field.name;
    hiddenInput.value = field.value || "-";
    container.append(hiddenInput);

    const updateHiddenValue = () => {
      const textareas = listWrapper.querySelectorAll(".paragraph-text");
      const items = [];
      textareas.forEach(ta => {
        const val = ta.value.trim();
        if (val) {
          items.push(val);
        }
      });
      hiddenInput.value = items.join("\n\n") || "-";
    };

    const addParagraphRow = (text = "") => {
      const row = document.createElement("div");
      row.className = "paragraph-item-row";
      row.style.cssText = "display: flex; gap: 10px; align-items: center; width: 100%;";

      const textInput = document.createElement("textarea");
      textInput.rows = 2;
      textInput.placeholder = field.placeholder || "Tuliskan paragraf...";
      textInput.value = text;
      textInput.style.cssText = "flex: 1; min-height: 50px; padding: 8px; border: 1px solid #d1d5db; outline: none; resize: vertical; border-radius: 4px;";
      textInput.className = "paragraph-text";
      textInput.addEventListener("input", updateHiddenValue);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
      deleteBtn.className = "btn btn-outline-danger";
      deleteBtn.style.cssText = "padding: 6px 10px; min-height: 40px; display: flex; align-items: center; justify-content: center;";
      deleteBtn.addEventListener("click", () => {
        row.remove();
        updateHiddenValue();
      });

      row.append(textInput, deleteBtn);
      listWrapper.append(row);
      updateHiddenValue();
      if (window.lucide) lucide.createIcons();
    };

    const initialText = field.value || "";
    if (initialText && initialText !== "-") {
      const paragraphs = initialText.split(/\n\n+/);
      paragraphs.forEach(p => addParagraphRow(p));
    } else {
      addParagraphRow("");
    }

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-outline-primary align-self-start";
    addBtn.style.cssText = "display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; padding: 6px 12px;";
    addBtn.innerHTML = '<i data-lucide="plus"></i> Tambah Paragraf';
    addBtn.addEventListener("click", () => {
      addParagraphRow("");
    });

    container.append(addBtn);
    label.append(container);
  } else if (field.type === "select") {
    control = document.createElement("select");
    control.name = field.name;
    (field.options || []).forEach((optionLabel) => {
      const option = document.createElement("option");
      option.value = optionLabel;
      option.textContent = optionLabel;
      option.selected = optionLabel === field.value;
      control.append(option);
    });
    label.append(control);
  } else if (field.type === "mission_list") {
    const container = document.createElement("div");
    container.className = "mission-list-container";
    container.style.cssText = "display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 8px;";

    const listWrapper = document.createElement("div");
    listWrapper.className = "mission-list-wrapper";
    listWrapper.style.cssText = "display: flex; flex-direction: column; gap: 12px; width: 100%;";
    container.append(listWrapper);

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = field.name;
    hiddenInput.value = "-";
    container.append(hiddenInput);

    const updateHiddenValue = () => {
      const rows = listWrapper.querySelectorAll(".mission-item-row");
      const items = [];
      rows.forEach(row => {
        const noVal = row.querySelector(".mission-no").value.trim();
        const txtVal = row.querySelector(".mission-text").value.trim();
        if (noVal || txtVal) {
          items.push(`${noVal}. ${txtVal}`);
        }
      });
      hiddenInput.value = items.join(" | ") || "-";
    };

    const addMissionRow = (num = "", text = "") => {
      const row = document.createElement("div");
      row.className = "mission-item-row";
      row.style.cssText = "display: flex; gap: 12px; align-items: center; width: 100%;";

      const numInput = document.createElement("input");
      numInput.type = "number";
      numInput.placeholder = "No";
      numInput.value = num;
      numInput.style.cssText = "width: 70px; min-height: 44px; padding: 0 10px; border: 1px solid #d1d5db; outline: none; border-radius: 4px;";
      numInput.className = "mission-no";
      numInput.addEventListener("input", updateHiddenValue);

      const textInput = document.createElement("textarea");
      textInput.rows = 2;
      textInput.placeholder = "Tuliskan misi desa";
      textInput.value = text;
      textInput.style.cssText = "flex: 1; min-height: 44px; padding: 10px; border: 1px solid #d1d5db; outline: none; resize: vertical; border-radius: 4px;";
      textInput.className = "mission-text";
      textInput.addEventListener("input", updateHiddenValue);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
      deleteBtn.className = "btn btn-outline-danger";
      deleteBtn.style.cssText = "padding: 8px 12px; min-height: 44px; display: flex; align-items: center; justify-content: center;";
      deleteBtn.addEventListener("click", () => {
        row.remove();
        updateHiddenValue();
      });

      row.append(numInput, textInput, deleteBtn);
      listWrapper.append(row);
      updateHiddenValue();
      if (window.lucide) lucide.createIcons();
    };

    addMissionRow("1", "");

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-outline-primary align-self-start";
    addBtn.style.cssText = "display: flex; align-items: center; gap: 8px; font-weight: 600; padding: 8px 16px;";
    addBtn.innerHTML = '<i data-lucide="plus"></i> Tambah Misi';
    addBtn.addEventListener("click", () => {
      const nextNo = listWrapper.querySelectorAll(".mission-item-row").length + 1;
      addMissionRow(String(nextNo), "");
    });

    container.append(addBtn);
    label.append(container);
  } else {
    control = document.createElement("input");
    control.type = field.type || "text";
    control.name = field.name;
    if (field.placeholder) control.placeholder = field.placeholder;
    if (field.value) control.value = field.value;
    label.append(control);
  }

  return label;
}

const profilSubForms = [
  { key: "input_sejarah_desa", label: "INPUT SEJARAH DESA", icon: "book-open" },
  { key: "input_sejarah_kades", label: "SEJARAH JABATAN KEPALA DESA", icon: "users" },
  { key: "input_profil_pendidikan", label: "INPUT PROFIL TENTANG PENDIDIKAN", icon: "graduation-cap" },
  { key: "input_profil_kesehatan", label: "INPUT PROFIL TENTANG KESEHATAN", icon: "activity" },
  { key: "input_profil_pekerjaan", label: "INPUT PROFIL TENTANG MATA PENCAHARIAN", icon: "briefcase" },
  { key: "input_profil_agama", label: "INPUT PROFIL TENTANG AGAMA", icon: "bookmark" },
  { key: "input_profil_infrastruktur", label: "INPUT PROFIL TENTANG INFRASTRUKTUR", icon: "wrench" },
  { key: "input_profil_irigasi", label: "INPUT PROFIL TENTANG IRIGASI", icon: "droplets" },
  { key: "input_profil_pemukiman", label: "INPUT PROFIL TENTANG PEMUKIMAN", icon: "home" },
  { key: "input_dusun", label: "INPUT DUSUN", icon: "map-pin" },
  { key: "input_sotk", label: "INPUT SOTK", icon: "network" },
  { key: "input_bpd", label: "INPUT DATA BPD", icon: "user-check" },
  { key: "input_profil_penduduk", label: "INPUT PROFIL TENTANG PERTUMBUHAN PENDUDUK", icon: "trending-up" },
  { key: "input_data_dusun", label: "INPUT DATA DUSUN", icon: "map" }
];

function renderMaterialForm(formKey = "dashboard") {
  if (formKey === "input_profil_desa") {
    formKey = "input_sejarah_desa";
  }

  // Render sub-sidebar / wizard horizontal (Gaya Gambar #2)
  const isProfilForm = profilSubForms.some(sf => sf.key === formKey);
  let wizardContainer = document.querySelector(".material-wizard");
  
  if (isProfilForm) {
    if (!wizardContainer) {
      wizardContainer = document.createElement("div");
      wizardContainer.className = "material-wizard";
      const header = document.querySelector(".material-form-header");
      if (header) {
        header.parentNode.insertBefore(wizardContainer, header.nextSibling);
      }
    }
    
    wizardContainer.innerHTML = "";
    profilSubForms.forEach(sf => {
      const step = document.createElement("a");
      step.className = `wizard-step ${sf.key === formKey ? "active" : ""}`;
      step.innerHTML = `
        <div class="wizard-icon"><i data-lucide="${sf.icon}"></i></div>
        <div class="wizard-label">${sf.label}</div>
      `;
      step.addEventListener("click", (e) => {
        e.preventDefault();
        renderMaterialForm(sf.key);
      });
      wizardContainer.append(step);
    });
  } else {
    if (wizardContainer) {
      wizardContainer.remove();
    }
  }
  const statGrid = document.querySelector(".material-stat-grid");
  const chartGrid = document.querySelector(".material-chart-grid");
  if (statGrid && chartGrid) {
    if (formKey === "dashboard") {
      statGrid.style.setProperty("display", "grid", "important");
      chartGrid.style.setProperty("display", "grid", "important");
    } else {
      statGrid.style.setProperty("display", "none", "important");
      chartGrid.style.setProperty("display", "none", "important");
    }
  }
  const template = materialFormTemplates[formKey] || materialFormTemplates.dashboard;
  if (!materialAutoForm || !template) return;
  currentMaterialFormKey = template.key;

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

  // Update the result table headers & rows instantly to match the active form
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

function summarizeMaterialValues(values) {
  return values
    .filter((item) => item.value !== "-")
    .slice(0, 3)
    .map((item) => `${item.label}: ${item.value}`)
    .join(" | ") || "Data tersimpan tanpa ringkasan.";
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
  const tableHeader = document.querySelector(".material-result-table thead");
  if (!materialResultRows || !tableHeader) return;

  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const filteredRows = materialSavedRows.filter(row => row.formKey === currentMaterialFormKey || row.form === template.title);

  tableHeader.innerHTML = "";
  const headerRow = document.createElement("tr");
  
  const headers = [];
  template.fields.forEach(field => {
    headers.push(field.label);
  });
  headers.push("Aksi");

  headers.forEach(hText => {
    const th = document.createElement("th");
    th.textContent = hText;
    headerRow.append(th);
  });
  tableHeader.append(headerRow);

  materialResultRows.innerHTML = "";

  if (filteredRows.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "material-empty-row";
    emptyRow.innerHTML = `<td colspan="${headers.length}">Belum ada data yang berhasil di input untuk form ini.</td>`;
    materialResultRows.append(emptyRow);
    return;
  }

  filteredRows.forEach((row) => {
    const tableRow = document.createElement("tr");

    template.fields.forEach(field => {
      const cell = document.createElement("td");
      let val = "-";
      if (row.values) {
        const valObj = row.values.find(v => v.name === field.name || v.label === field.label);
        if (valObj) val = valObj.value;
      }
      cell.textContent = val;
      tableRow.append(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "material-delete-row";
    deleteButton.type = "button";
    deleteButton.dataset.rowId = row.id;
    deleteButton.setAttribute("aria-label", "Hapus baris");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
    actionCell.append(deleteButton);
    tableRow.append(actionCell);

    materialResultRows.append(tableRow);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

function addMaterialResultRow() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = getMaterialFormValues();
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  materialSavedRows.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    module: activeMaterialModule.title,
    form: template.title,
    formKey: currentMaterialFormKey,
    summary: summarizeMaterialValues(values),
    status: "Berhasil di input",
    createdAt,
    values,
  });

  saveMaterialRows();
  renderMaterialResultTable();
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
  const deleteButton = event.target.closest("[data-row-id]");
  if (!deleteButton) return;
  materialSavedRows = materialSavedRows.filter((row) => row.id !== deleteButton.dataset.rowId);
  saveMaterialRows();
  renderMaterialResultTable();
});

clearMaterialTableButton?.addEventListener("click", () => {
  materialSavedRows = [];
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
