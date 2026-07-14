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
