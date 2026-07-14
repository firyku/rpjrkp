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
