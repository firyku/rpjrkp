  kalender_musim: {
    key: "kalender_musim", icon: "calendar-days", title: "Kalender Musim",
    description: "Tuliskan masalah, kegiatan, atau kondisi musim yang diamati. Pilih jumlah bintang sesuai frekuensi kejadian pada setiap bulan: semakin sering terjadi, semakin banyak bintangnya.",
    fields: [
      accessField("No"),
      {label:"Masalah/Kegiatan",name:"masalah_kegiatan",type:"text",placeholder:"Contoh: musim hujan, masa tanam padi, kekeringan, atau serangan hama"},
      ...["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map((bulan) => ({
        label:bulan,
        name:normalizeAccessName(bulan),
        type:"select",
        options:["— Tidak terjadi","★ Sangat jarang","★★ Jarang","★★★ Cukup sering","★★★★ Sering","★★★★★ Sangat sering"],
        value:"— Tidak terjadi",
      })),
      accessField("Keterangan", "textarea"),
    ],
  },
