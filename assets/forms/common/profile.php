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
