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
