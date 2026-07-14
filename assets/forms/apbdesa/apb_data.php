  apb_data: {key:"apb_data",icon:"database",title:"Data APBDesa",description:"Identitas desa dan dokumen APBDesa.",fields:[
    accessField("Provinsi"),accessField("Kabupaten"),accessField("Kecamatan"),accessField("Desa"),accessField("Alamat Desa","textarea"),accessField("Nama Kepala Desa"),accessField("Nama Sekretaris Desa"),accessField("Tahun Anggaran"),
    {label:"Jenis Dokumen",name:"jenis_dokumen",type:"select",options:["APBDesa","Perubahan APBDesa"],value:"APBDesa"},accessField("Nomor Perdes"),accessField("Tanggal Perdes","date"),accessField("Nomor Perkades"),accessField("Tanggal Perkades","date"),accessField("Logo Kabupaten","file")
  ]},
