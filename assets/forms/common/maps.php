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
