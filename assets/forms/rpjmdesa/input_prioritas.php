  input_prioritas: {
    key: "input_prioritas",
    icon: "arrow-up-narrow-wide",
    title: "Input Penentuan/Prioritas",
    description: "Beri skor 1–5 pada setiap kriteria. Skor yang lebih tinggi menunjukkan kebutuhan yang semakin mendesak untuk diprioritaskan.",
    fields: [
      accessField("No"), accessField("Paket_Kegiatan"), accessField("Masalah", "textarea"),
      {label:"Sangat Parah/ Mendesak",name:"sangat_parah_mendesak",type:"select",options:["1 - Tidak parah/tidak mendesak","2 - Agak parah","3 - Cukup parah","4 - Parah dan mendesak","5 - Sangat parah/darurat"],value:"1 - Tidak parah/tidak mendesak"},
      {label:"Dirasakan Oleh Banyak Orang",name:"dirasakan_oleh_banyak_orang",type:"select",options:["1 - Hanya satu orang/keluarga","2 - Sedikit warga","3 - Cukup banyak warga","4 - Mayoritas warga","5 - Hampir seluruh warga"],value:"1 - Hanya satu orang/keluarga"},
      {label:"Menghambat Peningkatan Pendapatan",name:"menghambat_peningkatan_pendapatan",type:"select",options:["1 - Tidak menghambat pendapatan","2 - Sedikit menghambat","3 - Cukup menghambat","4 - Sangat menghambat","5 - Menghilangkan sumber pendapatan"],value:"1 - Tidak menghambat pendapatan"},
      {label:"Sering Terjadi/ Berulang",name:"sering_terjadi_berulang",type:"select",options:["1 - Sangat jarang","2 - Jarang","3 - Kadang-kadang","4 - Sering berulang","5 - Terjadi terus-menerus"],value:"1 - Sangat jarang"},
      {label:"Tersedia Potensi Untuk Memecahkan Masalah",name:"tersedia_potensi_untuk_memecahkan_masalah",type:"select",options:["1 - Tidak ada potensi/sumber daya","2 - Potensi sangat terbatas","3 - Potensi cukup tersedia","4 - Potensi tersedia dan dapat digunakan","5 - Potensi sangat siap/mudah dimobilisasi"],value:"1 - Tidak ada potensi/sumber daya"},
    ],
  },
