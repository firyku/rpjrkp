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
