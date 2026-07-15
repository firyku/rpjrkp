const profileVillageSteps = [
  {title:"Pertumbuhan Penduduk",description:"Pertumbuhan, jenis kelamin, dan jumlah keluarga.",icon:"users",fields:["Tahun Data","Jumlah Penduduk Tahun Ini","Jumlah Penduduk Tahun Sebelumnya","Pertumbuhan Penduduk (%)","Jumlah Laki-laki","Jumlah Perempuan","Jumlah Kepala Keluarga"]},
  {title:"Angkatan Kerja",description:"Penduduk usia kerja, bekerja, dan pengangguran.",icon:"briefcase-business",fields:["Penduduk Usia Kerja","Angkatan Kerja","Bekerja","Pengangguran","Bukan Angkatan Kerja","Tingkat Partisipasi Angkatan Kerja (%)"]},
  {title:"Pendidikan",description:"Tingkat pendidikan penduduk desa.",icon:"graduation-cap",fields:["Tidak/Belum Sekolah","Belum Tamat SD","Tamat SD/Sederajat","Tamat SMP/Sederajat","Tamat SMA/Sederajat","Diploma","Sarjana","Pascasarjana"]},
  {title:"Kesehatan",description:"Kelahiran, kematian, gizi, sarana, dan tenaga kesehatan.",icon:"heart-pulse",fields:["Jumlah Kelahiran","Jumlah Kematian","Kematian Bayi","Ibu Hamil","Balita","Balita Gizi Buruk","Penyandang Disabilitas","Sarana Kesehatan","Tenaga Kesehatan"]},
  {title:"Kemiskinan",description:"Keluarga sejahtera, penduduk miskin, dan bantuan sosial.",icon:"hand-heart",fields:["Jumlah Keluarga","Keluarga Pra Sejahtera","Keluarga Sejahtera I","Penduduk Miskin","Penerima Bantuan Sosial"]},
  {title:"Ekonomi",description:"UMKM, BUM Desa, pasar, koperasi, serta kegiatan ekonomi.",icon:"chart-no-axes-combined",fields:["Jumlah UMKM","Jumlah BUM Desa","Pasar Desa","Koperasi","Usaha Perdagangan","Usaha Jasa","Pendapatan Rata-rata Penduduk"]},
  {title:"Pertanian",description:"Jenis, komoditas, dan produksi pertanian tiga tahun.",icon:"sprout",fields:["Jenis","Komoditi","Produksi 3 Tahun Sebelumnya","Satuan 3 Tahun Sebelumnya","Produksi 2 Tahun Sebelumnya","Satuan 2 Tahun Sebelumnya","Produksi 1 Tahun Sebelumnya","Satuan 1 Tahun Sebelumnya"]},
  {title:"Peternakan/Perikanan",description:"Populasi dan produksi peternakan atau perikanan.",icon:"fish",fields:["Jenis Ternak/Perikanan","Komoditas Ternak/Perikanan","Jumlah Populasi","Produksi per Tahun","Satuan Produksi"]},
  {title:"Infrastruktur",description:"Jenis, lokasi, volume, kondisi, dan tahun pembangunan.",icon:"construction",fields:["Jenis Infrastruktur","Lokasi Infrastruktur","Volume","Satuan","Kondisi","Tahun Pembangunan","Keterangan Infrastruktur"]},
  {title:"Irigasi",description:"Jaringan irigasi, luas layanan, kondisi, dan penerima manfaat.",icon:"waves",fields:["Nama/Jenis Irigasi","Lokasi Irigasi","Panjang (Meter)","Luas Layanan (Ha)","Kondisi Irigasi","Jumlah Penerima Manfaat"]},
  {title:"Pemukiman",description:"Kondisi rumah, air bersih, sanitasi, dan listrik.",icon:"house",fields:["Jumlah Rumah","Rumah Layak Huni","Rumah Tidak Layak Huni","Akses Air Bersih","Akses Sanitasi","Akses Listrik","Jenis Permukiman","Keterangan Pemukiman"]},
];

const accessDatasheetKeys = new Set([
  "input_daftar_isi", "input_misi_desa", "input_profil_desa", "input_rktl", "input_musdes",
  "input_renc_pendapatan", "input_matrik", "input_musdus_kelompok", "program_masuk_desa",
  "input_rekomendasi_sdgs", "input_prioritas", "dtsen", "inventaris_masalah", "inventaris_potensi",
  "gagasan_dusun", "tim_penyusun", "dasar_hukum_perdes", "dasar_hukum_sk", "ketentuan_umum_perdes",
  "sketsa_desa", "bagan_kelembagaan_input", "kalender_musim", "arah_kebijakan",
  "rkp_daftar_isi", "rkp_misi_desa", "rkp_profil_desa", "rkp_tim_penyusun", "rkp_musdes",
  "rkp_rktl", "rkp_pagu_indikatif", "rkp_program_masuk", "rkp_rancangan_kegiatan", "rkp_matrik",
  "rkp_prioritas", "rkp_pendapatan", "rkp_belanja", "rkp_pembiayaan", "rkp_input_masalah",
  "rkp_rekomendasi_sdgs", "rkp_evaluasi_sebelumnya", "rkp_dasar_hukum_perdes", "rkp_dasar_hukum_sk",
  "rkp_ketentuan_umum", "rkp_ba_tim_input",
  "apb_akun", "apb_bidang", "apb_subbidang", "apb_kegiatan", "apb_paket_kegiatan",
  "apb_pendapatan", "apb_pendapatan_perubahan", "apb_belanja", "apb_belanja_perubahan",
  "apb_pembiayaan_1", "apb_pembiayaan_1_perubahan", "apb_pembiayaan_2", "apb_pembiayaan_2_perubahan",
  "apb_tagging", "apb_satuan", "apb_user",
]);

function getProfileVillageStepIndex(field) {
  const stepIndex = profileVillageSteps.findIndex((step) => step.fields.includes(field.label));
  return stepIndex === -1 ? 0 : stepIndex;
}

function createMaterialSectionSteps(template) {
  if (["input_profil_desa", "rkp_profil_desa"].includes(template.key)) return profileVillageSteps;

  // Untuk form tabel (access datasheet), jangan pecah ke beberapa bagian
  if (accessDatasheetKeys.has(template.key)) {
    return [{ title: "Bagian 1", description: template.description, icon: "list-start", fields: (template.fields || []).map((f) => f.label) }];
  }

  const fields = template.fields || [];
  const stepCount = Math.max(1, Math.min(6, Math.ceil(fields.length / 4)));
  const fieldsPerStep = Math.max(1, Math.ceil(fields.length / stepCount));
  const icons = ["list-start", "list-todo", "clipboard-list", "files", "layout-list", "list-checks"];
  const steps = [];

  for (let index = 0; index < fields.length; index += fieldsPerStep) {
    const stepFields = fields.slice(index, index + fieldsPerStep);
    const stepNumber = steps.length + 1;
    steps.push({
      title: `Bagian ${stepNumber}`,
      description: `Lengkapi isian ${index + 1}–${index + stepFields.length} untuk ${template.title}.`,
      icon: icons[steps.length] || "circle-dot",
      fields: stepFields.map((field) => field.label),
    });
  }

  return steps.length ? steps : [{ title: "Bagian 1", description: template.description, icon: "list-start", fields: [] }];
}

function getMaterialSectionStepIndex(field) {
  const stepIndex = currentMaterialSectionSteps.findIndex((step) => step.fields.includes(field.label));
  return stepIndex === -1 ? 0 : stepIndex;
}

function activateMaterialSectionStep(stepIndex) {
  if (!materialAutoForm) return;
  const safeIndex = Math.max(0, Math.min(stepIndex, currentMaterialSectionSteps.length - 1));
  const step = currentMaterialSectionSteps[safeIndex];
  if (!step) return;

  materialAutoForm.querySelectorAll("[data-material-step-button]").forEach((button) => {
    const isActive = Number(button.dataset.materialStepButton) === safeIndex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "step" : "false");
  });

  materialAutoForm.querySelectorAll("[data-material-step-field]").forEach((field) => {
    field.hidden = Number(field.dataset.materialStepField) !== safeIndex;
  });

  const title = materialAutoForm.querySelector("#materialStepTitle");
  const description = materialAutoForm.querySelector("#materialStepDescription");
  if (title) title.textContent = step.title;
  if (description) description.textContent = step.description;
}

function createMaterialSectionNavigation(template, isProfileVillageForm) {
  const fragment = document.createDocumentFragment();
  const overview = document.createElement("section");
  overview.className = "profile-village-overview span-2";
  overview.innerHTML = `
    <div class="profile-village-mark"><i data-lucide="${isProfileVillageForm ? "map-pinned" : template.icon}"></i></div>
    <div class="profile-village-copy">
      <span>${isProfileVillageForm ? "PROFIL DESA" : activeMaterialModule.title.toUpperCase()}</span>
      <h3>${isProfileVillageForm ? "Data Profil dan Wilayah" : template.title}</h3>
      <p>${isProfileVillageForm ? "Lengkapi informasi desa secara bertahap melalui subbagian di bawah ini." : template.description}</p>
    </div>
    <div class="profile-village-status"><i data-lucide="${isProfileVillageForm ? "shield-check" : "list-checks"}"></i> ${isProfileVillageForm ? "RPJMDesa" : "Form Bertahap"}</div>
  `;
  fragment.append(overview);

  const stepper = document.createElement("nav");
  stepper.className = "profile-village-stepper span-2";
  stepper.style.setProperty("--material-step-count", String(Math.min(currentMaterialSectionSteps.length, 6)));
  stepper.setAttribute("aria-label", `Subbagian ${template.title}`);
  currentMaterialSectionSteps.forEach((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-step-button";
    button.dataset.materialStepButton = String(index);
    button.innerHTML = `
      <span class="profile-step-circle"><i data-lucide="${step.icon}"></i></span>
      <strong>${step.title}</strong>
      <small>${step.fields.length} isian</small>
    `;
    button.addEventListener("click", () => activateMaterialSectionStep(index));
    stepper.append(button);
  });
  fragment.append(stepper);

  const caption = document.createElement("div");
  caption.className = "profile-step-caption span-2";
  caption.innerHTML = `
    <div class="profile-step-caption-icon"><i data-lucide="info"></i></div>
    <div>
      <strong id="materialStepTitle">${currentMaterialSectionSteps[0].title}</strong>
      <p id="materialStepDescription">${currentMaterialSectionSteps[0].description}</p>
    </div>
  `;
  fragment.append(caption);
  return fragment;
}

function renderMaterialForm(formKey = "dashboard") {
  const template = materialFormTemplates[formKey] || materialFormTemplates.dashboard;
  if (!materialAutoForm || !template) return;
  currentMaterialFormKey = template.key;
  editingMaterialRowId = null;
  const accessPanel = document.querySelector("#accessImportPanel");
  if (accessPanel) accessPanel.hidden = true;
  const printPanel = document.querySelector("#materialPrintPanel");
  if (printPanel) printPanel.hidden = true;

  const title = `${template.title} ${activeMaterialModule.title}`;
  materialFormKicker && (materialFormKicker.textContent = activeMaterialModule.title);
  materialFormHeading && (materialFormHeading.textContent = title);
  materialFormDescription && (materialFormDescription.textContent = template.description);
  const resultTitle = document.querySelector("#materialResultTitle");
  const resultDescription = document.querySelector("#materialResultDescription");
  const clearTemplateTitle = template.title.replace(/^Input\s+/i, "").replace(/\s+(RPJMDesa|RKPDesa)$/i, "").trim();
  if (resultTitle) resultTitle.textContent = `Input Data ${clearTemplateTitle}`;
  if (resultDescription) resultDescription.textContent = `Masukkan data ${clearTemplateTitle} pada tabel di bawah, lalu tekan tombol Simpan.`;

  if (materialFormIcon) {
    materialFormIcon.innerHTML = `<i data-lucide="${template.icon}"></i>`;
  }

  materialAutoForm.innerHTML = "";
  const isProfileVillageForm = ["input_profil_desa", "rkp_profil_desa"].includes(template.key);
  // Profil Desa selalu memakai form bertahap per Bagian. Form tabel lainnya
  // cukup diinput melalui datasheet bawah agar tidak tampil dua kali.
  const isAccessDatasheet = accessDatasheetKeys.has(template.key) && !isProfileVillageForm;
  const isSectionedMaterialForm = isProfileVillageForm || (template.key !== "dashboard" && !isAccessDatasheet);
  if (addMaterialTableRowButton) addMaterialTableRowButton.hidden = !isAccessDatasheet;
  if (clearMaterialTableButton) clearMaterialTableButton.hidden = !isAccessDatasheet;
  currentMaterialSectionSteps = isSectionedMaterialForm ? createMaterialSectionSteps(template) : [];
  materialAutoForm.classList.toggle("is-profile-village-form", isProfileVillageForm);
  materialAutoForm.classList.toggle("is-sectioned-material-form", isSectionedMaterialForm);
  materialAutoForm.classList.toggle("is-access-datasheet-form", isAccessDatasheet);

  // Tampilkan panel hasil untuk form tabel (access datasheet)
  const materialResultPanel = document.querySelector(".material-result-panel");
  if (materialResultPanel) materialResultPanel.hidden = false;
  if (materialFormPanel) materialFormPanel.hidden = isAccessDatasheet;
  materialFormPanel?.classList.toggle("is-profile-village-mode", isSectionedMaterialForm);
  adminView?.classList.toggle("is-profile-village-view", isSectionedMaterialForm);

  if (isSectionedMaterialForm) {
    materialAutoForm.append(createMaterialSectionNavigation(template, isProfileVillageForm));
  }

  const fieldsTarget = materialAutoForm;

  if (!isAccessDatasheet) template.fields.forEach((field) => {
    const fieldControl = createMaterialField(field);
    if (isSectionedMaterialForm) {
      fieldControl.classList.add("profile-village-field");
      fieldControl.dataset.materialStepField = String(getMaterialSectionStepIndex(field));
    }
    fieldsTarget.append(fieldControl);
  });

  if (!isAccessDatasheet) {
    const actions = document.createElement("div");
    actions.className = "material-form-actions span-2";
    actions.innerHTML = `
      <button type="submit"><i data-lucide="save"></i>Simpan Data</button>
      <button type="reset"><i data-lucide="rotate-ccw"></i>Reset</button>
    `;
    materialAutoForm.append(actions);
  }

  if (isSectionedMaterialForm) {
    activateMaterialSectionStep(0);
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  // Auto-fill LOGO KAB and Foto_Kades images from saved desa data
  if (formKey === "input_data_umum" && desaSavedRows.length > 0) {
    const latestDesa = desaSavedRows[0];
    
    // Show Logo Kabupaten image from desa data
    const logoKabField = materialAutoForm?.querySelector('[name="logo_kab"]');
    if (logoKabField && latestDesa.logo_kabupaten?.dataUrl) {
      const label = logoKabField.closest("label");
      if (label) {
        logoKabField.style.display = "none";
        if (!label.querySelector(".desa-file-img")) {
          const img = document.createElement("img");
          img.className = "desa-file-img";
          img.src = latestDesa.logo_kabupaten.dataUrl;
          img.alt = "Logo Kabupaten";
          label.append(img);
        }
      }
    }
    
    // Show Foto Kades image from desa data
    const fotoKadesField = materialAutoForm?.querySelector('[name="foto_kades"]');
    if (fotoKadesField && latestDesa.foto_kades?.dataUrl) {
      const label = fotoKadesField.closest("label");
      if (label) {
        fotoKadesField.style.display = "none";
        if (!label.querySelector(".desa-file-img")) {
          const img = document.createElement("img");
          img.className = "desa-file-img";
          img.src = latestDesa.foto_kades.dataUrl;
          img.alt = "Foto Kepala Desa";
          label.append(img);
        }
      }
    }
    
    // Fill Nama Kepala Desa from desa data
    const namaKadesField = materialAutoForm?.querySelector('[name="nama_kepala_desa"]');
    if (namaKadesField && latestDesa.nama_kepala_desa) namaKadesField.value = latestDesa.nama_kepala_desa;
    
    // Auto-fill other fields from desa data
    const desaField = materialAutoForm?.querySelector('[name="desa"]');
    if (desaField && latestDesa.desa) desaField.value = latestDesa.desa;
    
    const alamatField = materialAutoForm?.querySelector('[name="alamat_desa"]');
    if (alamatField && latestDesa.alamat_desa) alamatField.value = latestDesa.alamat_desa;
    
    const kabField = materialAutoForm?.querySelector('[name="kabupaten"]');
    if (kabField && latestDesa.kabupaten) kabField.value = latestDesa.kabupaten;
    
    const kecField = materialAutoForm?.querySelector('[name="kecamatan"]');
    if (kecField && latestDesa.kecamatan) kecField.value = latestDesa.kecamatan;
    
    const provField = materialAutoForm?.querySelector('[name="provinsi"]');
    if (provField && latestDesa.provinsi) provField.value = latestDesa.provinsi;
  }

  renderMaterialResultTable();
}

const materialReportSources = {
  cover:"input_data_umum", cover_lampiran:"input_data_umum", dokumen_1:"input_data_umum", dokumen_2:"input_data_umum", perdes:"input_data_umum",
  ba_tim:"tim_penyusun", sk_tim:"tim_penyusun", daftar_hadir:"tim_penyusun", peta_jalan_sdgs:"input_rekomendasi_sdgs",
  laporan_program_masuk_desa:"program_masuk_desa", ba_musdus_kelompok:"input_musdus_kelompok", bagan_kelembagaan:"bagan_kelembagaan_input",
  rancangan_rpjmdesa:"input_matrik", dok_visi_misi_kades:"input_misi_desa", dok_pokok_pikiran_bpd:"inventaris_masalah",
  pengkajian_tindakan:"inventaris_masalah", penentuan_tindakan:"input_prioritas", rekap_gagasan_dusun:"gagasan_dusun",
  sketsa_desa_laporan:"sketsa_desa", kalender_musim_laporan:"kalender_musim", ba_musrenbangdes:"input_musdes", ba_penetapan:"input_musdes",
  rkp_cover:"rkp_data_umum", rkp_pendahuluan:"rkp_data_umum", rkp_laporan_daftar_isi:"rkp_daftar_isi",
  rkp_bab_1:"rkp_data_umum", rkp_bab_2:"rkp_evaluasi_sebelumnya", rkp_bab_3:"rkp_pagu_indikatif", rkp_bab_4:"rkp_rancangan_kegiatan", rkp_bab_5:"rkp_pembiayaan",
  rkp_checklist:"rkp_data_umum", rkp_perdes:"rkp_data_umum", rkp_sk_tim:"rkp_tim_penyusun", rkp_ba_tim:"rkp_ba_tim_input",
  rkp_daftar_hadir:"rkp_tim_penyusun", rkp_usulan_sdgs:"rkp_rekomendasi_sdgs", rkp_kerjasama:"rkp_program_masuk",
  rkp_rancangan_laporan:"rkp_rancangan_kegiatan", rkp_du_rkp:"rkp_prioritas", rkp_ba_rancangan:"rkp_rancangan_kegiatan",
  rkp_ba_musdes:"rkp_musdes", rkp_ba_musrenbang:"rkp_musdes", rkp_ba_pengesahan:"rkp_musdes", rkp_dokumen:"rkp_data_umum",
};

function escapePrintHtml(value) {
  return String(value ?? "-").replace(/[&<>"']/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[character]));
}

function reportRowsFor(formKey) {
  const template = materialFormTemplates[formKey];
  return template ? materialSavedRows.filter((row) => isMaterialRowForTemplate(row, template)) : [];
}

function reportValue(row, label, fallback = "-") {
  const wanted = String(label).toLowerCase();
  const item = (row?.values || []).find((entry) => String(entry.label || entry.name).toLowerCase() === wanted);
  return item?.value && item.value !== "-" ? item.value : fallback;
}

function formatOfficialSourceText(source, hasTables = false) {
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const output = [];
  let paragraph = [];
  let listLabel = "";
  let listParts = [];
  const flush = () => {
    if (!paragraph.length) return;
    output.push(`<p>${escapePrintHtml(paragraph.join(" ").replace(/\s+/g, " "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!listParts.length) return;
    const normalizedLabel = /^\d+$/.test(listLabel) ? `${listLabel}.` : listLabel;
    output.push(`<p class="official-list-item"><span>${escapePrintHtml(normalizedLabel)}</span><span>${escapePrintHtml(listParts.join(" ").replace(/\s+/g, " "))}</span></p>`);
    listLabel = "";
    listParts = [];
  };
  lines.forEach((line) => {
    if (/^(?:[IVXLCDM]+|\d+)$/i.test(line)) return;
    if (hasTables && (line.match(/\d+(?:[.,]\d+)?/g) || []).length >= 3) return;
    const chapterMatch = line.match(/^((?:BAB\s+[IVXLCDM]+|\d+(?:\.\d+)+\.?)\s*[A-Z][A-Z\s/-]{2,})(.*)$/);
    const isHeading = line.length < 105 && /[A-Z]{3}/.test(line) && (line.includes(" ") || /^(LAMPIRAN|PENUTUP)$/i.test(line)) && (line === line.toUpperCase() || /^(DAFTAR ISI|LAMPIRAN|Pasal\s+\d+)/i.test(line));
    if (chapterMatch) {
      flush();
      flushList();
      output.push(`<h3>${escapePrintHtml(chapterMatch[1].trim())}</h3>`);
      if (chapterMatch[2].trim()) paragraph.push(chapterMatch[2].trim());
      return;
    }
    if (isHeading) {
      flush();
      flushList();
      output.push(`<h3>${escapePrintHtml(line)}</h3>`);
      return;
    }
    const listMatch = line.match(/^((?:\d{1,2}[.)]?|[a-z][.)]))\s+(.+)$/i);
    if (listMatch) {
      flush();
      flushList();
      listLabel = listMatch[1];
      listParts.push(listMatch[2]);
      if (/[.!?;:]$/.test(listMatch[2])) flushList();
      return;
    }
    if (listParts.length) {
      listParts.push(line);
      if (/[.!?;:]$/.test(line)) flushList();
      return;
    }
    paragraph.push(line);
    if (/[.!?;:]$/.test(line)) flush();
  });
  flush();
  flushList();
  return output.join("");
}

function officialRpjmReport(reportKey, identity) {
  const desa = escapePrintHtml(identity.desa || "Gendayakan");
  const kecamatan = escapePrintHtml(identity.kecamatan || "Paranggupito");
  const kabupaten = escapePrintHtml(identity.kabupaten || "Wonogiri");
  const provinsi = escapePrintHtml(identity.provinsi || "Jawa Tengah");
  const kepala = escapePrintHtml(identity.nama_kepala_desa || "....................");
  const alamat = escapePrintHtml(identity.alamat_desa || "-");
  const umum = reportRowsFor("input_data_umum")[0] || {};
  const awal = escapePrintHtml(reportValue(umum, "Tahun Awal Periode RPJMdesa", "2026"));
  const akhir = escapePrintHtml(reportValue(umum, "Tahun akhir Periode RPJMdesa", "2031"));
  const periode = `${awal} - ${akhir}`;
  const noPerdes = escapePrintHtml(reportValue(umum, "No Perdes RKPdesa", "..."));
  const noSk = escapePrintHtml(reportValue(umum, "No sk tim penyusun RPJMDes", "..."));
  const tanggal = escapePrintHtml(reportValue(umum, "Tgl Penetapan Perdes RPJMDesa", new Date().toLocaleDateString("id-ID")));
  const tim = reportRowsFor("tim_penyusun");
  const timRows = tim.length ? tim.map((row, index) => `<tr><td>${index + 1}</td><td>${escapePrintHtml(reportValue(row,"Nama"))}</td><td>${escapePrintHtml(reportValue(row,"Jabatan"))}</td><td>${escapePrintHtml(reportValue(row,"Kedudukan"))}</td></tr>`).join("") : `<tr><td colspan="4">Susunan tim belum diisi.</td></tr>`;
  const page = (content, extra = "") => `<section class="official-page ${extra}">${content}</section>`;
  const signature = `<div class="official-signature">Ditetapkan di Desa ${desa}<br>Pada tanggal ${tanggal}<br><strong>KEPALA DESA ${desa.toUpperCase()}</strong><div class="signature-space"></div><strong>${kepala}</strong></div>`;

  if (["perdes", "ba_tim", "sk_tim"].includes(reportKey) && officialRpjmVisualPages?.[reportKey]) {
    const memberName = (index) => reportValue(tim[index], "Nama", "....................");
    const visualValues = {
      desa: identity.desa || "Gendayakan", kecamatan: identity.kecamatan || "Paranggupito", kabupaten: identity.kabupaten || "Wonogiri",
      kepala: identity.nama_kepala_desa || "....................", ketua_tim: identity.nama_ketua_tim || "....................",
      sekretaris: identity.nama_sekretaris_desa || "....................", tahun_awal: reportValue(umum, "Tahun Awal Periode RPJMdesa", "2026"),
      tahun_akhir: reportValue(umum, "Tahun akhir Periode RPJMdesa", "2031"), tim_0: memberName(0), tim_1: memberName(1), tim_2: memberName(2),
      tim_3a: memberName(3).split(/\s+/)[0], tim_3b: memberName(3).split(/\s+/).slice(1).join(" "), tim_4: memberName(4),
    };
    return officialRpjmVisualPages[reportKey].map((visualPage, index) => {
      const overlays = visualPage.overlays.map((item) => `<span class="visual-report-overlay" style="left:${item.x}%;top:${item.y}%;min-width:${Math.max(item.w, 2)}%;height:${item.h + .4}%">${escapePrintHtml(visualValues[item.key] || "-")}</span>`).join("");
      return page(`<div class="visual-report-canvas"><img src="${escapePrintHtml(visualPage.image)}" alt="Halaman ${index + 1}">${overlays}</div>`, "visual-report-page");
    }).join("");
  }

  if (officialRpjmPdfPages?.[reportKey]) {
    const replacements = [
      [/GUDANGHARJO/gi, identity.desa || "Gendayakan"],
      [/PARANGGUPITO/gi, identity.kecamatan || "Paranggupito"],
      [/WONOGIRI/gi, identity.kabupaten || "Wonogiri"],
      [/JAWA TENGAH/gi, identity.provinsi || "Jawa Tengah"],
      [/SRIYONO/gi, identity.nama_kepala_desa || "...................."],
      [/Jl\. Pantai Nampu Km\.2/gi, identity.alamat_desa || "-"],
      [/2021\s*[-\u2013\u2014\u0426]+\s*2028/g, `${reportValue(umum, "Tahun Awal Periode RPJMdesa", "2026")} - ${reportValue(umum, "Tahun akhir Periode RPJMdesa", "2031")}`],
      [/SUTRISNO/gi, reportValue(tim[0], "Nama", "....................")],
      [/SUKISNO/gi, reportValue(tim[1], "Nama", "....................")],
      [/MARSO/gi, reportValue(tim[2], "Nama", "....................")],
      [/SITI AISAH/gi, reportValue(tim[3], "Nama", "....................")],
      [/SUKIYO/gi, reportValue(tim[4], "Nama", "....................")],
      [/SUNARTO/gi, identity.nama_ketua_tim || "...................."],
      [/KUSUMA/gi, identity.nama_sekretaris_desa || "...................."],
    ];
    return officialRpjmPdfPages[reportKey].map((source, index) => {
      let hydrated = source.replace(/^Pengantar_Rpjmdes\s*/i, "")
        .replace(/\bV ISI\b/g, "VISI").replace(/\bN ILAI\b/g, "NILAI")
        .replace(/IV RUMUSAN PRIORITAS PEMBAN/g, "IV. RUMUSAN PRIORITAS PEMBANGUNAN")
        .replace(/V\. ARAH KEBIJAKAN PEMBANGUN/g, "V. ARAH KEBIJAKAN PEMBANGUNAN DESA")
        .replace(/VI PROGRAM DAN KEGIATAN PEM/g, "VI. PROGRAM DAN KEGIATAN PEMBANGUNAN")
        .replace(/VI PENUTUP/g, "VII. PENUTUP");
      replacements.forEach(([pattern, value]) => { hydrated = hydrated.replace(pattern, value); });
      if (reportKey === "perdes") hydrated = hydrated.replace(/NOMOR\s+2\s+TAHUN\s+2025/i, `NOMOR ${reportValue(umum, "No Perdes RKPdesa", "...")} TAHUN ${reportValue(umum, "Tahun akhir Periode RPJMdesa", "2031")}`);
      if (reportKey === "sk_tim") hydrated = hydrated.replace(/NOMOR\s+5\s+TAHUN\s+2025/i, `NOMOR ${reportValue(umum, "No sk tim penyusun RPJMDes", "...")} TAHUN ${reportValue(umum, "Tahun akhir Periode RPJMdesa", "2031")}`);
      const pageTables = officialRpjmTables?.[reportKey]?.[String(index)] || [];
      const defaultToc = [
        ["I.","PENDAHULUAN","1"],["1.1.","Latar Belakang","1"],["1.2.","Maksud dan Tujuan","4"],["1.3.","Dasar Hukum","5"],
        ["II.","PROFIL DESA","10"],["2.1.","Kondisi Umum Desa","11"],["2.2.","Sejarah Desa",""],["2.3.","Kondisi Geografis Desa",""],
        ["2.4.","Kondisi Sosial Budaya Desa",""],["2.5.","Kondisi Ekonomi Desa",""],["2.6.","Kondisi Infrastruktur Desa",""],
        ["2.7.","Kondisi Pemerintahan Desa",""],["2.8.","Pembagian Wilayah Desa",""],["2.9.","Struktur Organisasi Pemerintahan Desa",""],
        ["III.","VISI DAN MISI",""],["3.1.","Visi dan Misi",""],["3.2.","Nilai-nilai",""],
        ["IV.","RUMUSAN PRIORITAS PEMBANGUNAN",""],["4.1.","Masalah",""],["4.2.","Potensi",""],
        ["V.","ARAH KEBIJAKAN PEMBANGUNAN DESA",""],["5.1.","Arah Kebijakan Pembangunan Desa",""],["5.2.","Arah Kebijakan Keuangan Desa",""],
        ["VI.","PROGRAM DAN KEGIATAN PEMBANGUNAN",""],["VII.","PENUTUP",""]
      ];
      const appendixItems = ["SK Tim Penyusun RPJM Desa","RKTL Tim Penyusun RPJM Desa","Peta Jalan SDGs Desa","Data Rencana Program dan Kegiatan Pembangunan yang Akan Masuk ke Desa","Bagan Kelembagaan","Daftar Masalah dan Potensi Bagan Kelembagaan","Sketsa Desa","Daftar Masalah dan Potensi Sketsa Desa","Kalender Musim","Daftar Masalah dan Potensi Kalender Musim","Pohon Masalah","Daftar Inventaris Masalah","Daftar Inventaris Potensi","Pengkajian Tindakan Pemecahan Masalah","Penentuan Tindakan Masalah","Penentuan Peringkat Tindakan","Daftar Gagasan Dusun/Kelompok","Rekapitulasi Gagasan Dusun/Kelompok","Rancangan RPJM Desa","Dokumen Visi Misi Kepala Desa","Berita Acara Musyawarah","Undangan dan Daftar Hadir Musyawarah","Notulen Musyawarah","Peta Desa","Foto Kegiatan/Foto Desa"];
      let content;
      if (reportKey === "dokumen_1" && (index === 2 || index === 3)) {
        const slice = index === 2 ? defaultToc.slice(0,17) : defaultToc.slice(17);
        content = `<div class="official-toc-page"><h2>DAFTAR ISI</h2>${slice.map(([code,title,pageNo]) => `<div class="official-toc-row"><span>${code}</span><span>${title}</span><i></i><b>${pageNo}</b></div>`).join("")}</div>`;
      } else if (reportKey === "dokumen_1" && index === 4) {
        content = `<div class="official-toc-page"><h2>LAMPIRAN-LAMPIRAN</h2><ol class="official-appendix-list">${appendixItems.map((item) => `<li>${item}</li>`).join("")}</ol></div>`;
      } else {
        content = formatOfficialSourceText(hydrated, pageTables.length > 0);
      }
      const tables = pageTables.map((rows) => `<div class="official-native-table-wrap"><table class="official-native-table"><thead><tr>${(rows[0] || []).map((cell) => `<th>${escapePrintHtml(cell)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.map((cell) => `<td>${escapePrintHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`).join("");
      const pageClass = `official-source-page official-${reportKey.replaceAll("_", "-")}-page official-page-${index + 1}`;
      const decoration = reportKey === "dokumen_1" && index === 0 ? `<div class="official-pengantar-banner"><span>PENGANTAR</span></div>` : reportKey === "dokumen_2" && index === 0 ? `<div class="official-doc2-heading"><strong>DOKUMEN RPJM DESA</strong><span>DESA ${desa.toUpperCase()} - PERIODE ${periode}</span></div>` : "";
      const emblem = reportKey === "perdes" && index === 0 ? `<div class="official-garuda" aria-label="Lambang Garuda">GARUDA<br> PANCASILA</div>` : "";
      return page(`${decoration}${emblem}${content}${tables}<div class="official-page-number">${index + 1}</div>`, pageClass);
    }).join("");
  }

  if (reportKey === "cover") return page(`
    <div class="cover-overlay cover-agency">Kabupaten ${kabupaten}<br>Kecamatan ${kecamatan}<br>Desa ${desa}</div>
    <div class="cover-overlay cover-period">Perubahan Periode ${periode}</div>
    <div class="cover-overlay cover-identity"><strong>Desa</strong><b>:</b>${desa}<strong>Kecamatan</strong><b>:</b>${kecamatan}<strong>Kabupaten</strong><b>:</b>${kabupaten}</div>
    <div class="cover-overlay cover-address">${alamat}</div>`, "official-cover-image");

  if (reportKey === "cover_lampiran") return page(`
    <div class="cover-overlay lamp-agency">Kabupaten ${kabupaten}<br>Kecamatan ${kecamatan}<br>Desa ${desa}</div>
    <div class="cover-overlay lamp-title">LAMPIRAN</div>`, "official-lamp-cover-image");

  if (reportKey === "dokumen_1") return [
    page(`<h2 class="official-title">KATA PENGANTAR</h2><p>Dengan mengucapkan puji syukur kehadirat Tuhan Yang Maha Esa, kami sampaikan Dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ${desa} sebagai dokumen perencanaan strategis yang menjadi pedoman Pemerintah Desa dalam menjalankan pembangunan yang terarah, bertahap, dan berkelanjutan selama periode ${periode}.</p><p>RPJM Desa ini disusun melalui partisipasi aktif seluruh komponen masyarakat dan menjadi bentuk komitmen bersama antara pemerintah desa, masyarakat, serta pemangku kepentingan dalam mewujudkan visi dan misi pembangunan desa.</p><p>Kami berharap dokumen ini menjadi pedoman yang efektif bagi semua pihak dalam pelaksanaan pembangunan dan peningkatan kesejahteraan masyarakat Desa ${desa}.</p>${signature}`),
    page(`<h2 class="official-title">DAFTAR ISI</h2><ol class="official-toc"><li>Kata Pengantar</li><li>Daftar Isi</li><li>BAB I - Pendahuluan</li><li>BAB II - Profil Desa</li><li>BAB III - Visi dan Misi</li><li>BAB IV - Rumusan Prioritas Pembangunan</li><li>BAB V - Arah Kebijakan Pembangunan Desa</li><li>BAB VI - Program dan Kegiatan Pembangunan</li><li>BAB VII - Penutup</li></ol>`),
    page(`<h2 class="official-title">LAMPIRAN-LAMPIRAN</h2><ol class="official-toc"><li>SK Tim Penyusun RPJM Desa</li><li>RKTL Tim Penyusun RPJM Desa</li><li>Peta Jalan SDGs Desa</li><li>Data Program dan Kegiatan yang Masuk ke Desa</li><li>Bagan Kelembagaan dan Sketsa Desa</li><li>Kalender Musim</li><li>Inventaris Masalah dan Potensi</li><li>Pengkajian dan Penentuan Tindakan</li><li>Daftar Gagasan Dusun/Kelompok</li><li>Rancangan RPJM Desa</li><li>Berita Acara dan Daftar Hadir Musyawarah</li></ol>`)
  ].join("");

  if (reportKey === "dokumen_2") {
    const profil = reportRowsFor("input_profil_desa").map((row) => (row.values || []).map((v) => `<p><strong>${escapePrintHtml(v.label)}:</strong> ${escapePrintHtml(v.value)}</p>`).join("")).join("") || `<p>Data profil desa diisi melalui menu Input Profil Desa.</p>`;
    const misi = reportRowsFor("input_misi_desa").map((row) => `<li>${escapePrintHtml(reportValue(row,"Misi Desa"))}</li>`).join("") || "<li>Data misi desa belum diisi.</li>";
    return [
      page(`<h2 class="official-title">BAB I<br>PENDAHULUAN</h2><h3>1.1 Latar Belakang</h3><p>Perencanaan pembangunan Desa ${desa} disusun untuk menjamin keterkaitan dan konsistensi antara perencanaan, penganggaran, pelaksanaan, pemantauan, dan pengawasan pembangunan desa selama periode ${periode}.</p><h3>1.2 Maksud dan Tujuan</h3><p>RPJM Desa menjadi pedoman penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat berdasarkan kebutuhan serta potensi desa.</p>`),
      page(`<h2 class="official-title">BAB II<br>PROFIL DESA</h2>${profil}`),
      page(`<h2 class="official-title">BAB III<br>VISI DAN MISI</h2><h3>3.1 Visi dan Misi</h3><ol>${misi}</ol>`),
      page(`<h2 class="official-title">BAB IV<br>RUMUSAN PRIORITAS PEMBANGUNAN</h2><p>Prioritas pembangunan disusun dari data inventaris masalah, potensi, hasil pengkajian tindakan, dan penentuan peringkat yang telah diisi pada aplikasi.</p>`),
      page(`<h2 class="official-title">BAB V<br>ARAH KEBIJAKAN PEMBANGUNAN DESA</h2><p>Arah kebijakan pembangunan Desa ${desa} diarahkan pada pencapaian visi dan misi dengan mempertimbangkan kemampuan keuangan desa, potensi lokal, serta kebutuhan mendesak masyarakat.</p>`),
      page(`<h2 class="official-title">BAB VI<br>PROGRAM DAN KEGIATAN PEMBANGUNAN</h2><p>Program dan kegiatan pembangunan bersumber dari matrik rencana pembangunan yang tersimpan pada aplikasi.</p>`),
      page(`<h2 class="official-title">BAB VII<br>PENUTUP</h2><p>RPJM Desa ${desa} periode ${periode} merupakan pedoman bersama dalam mewujudkan pembangunan desa yang partisipatif, transparan, akuntabel, dan berkelanjutan.</p>${signature}`)
    ].join("");
  }

  if (reportKey === "perdes") return [
    page(`<div class="official-law-head">KEPALA DESA ${desa.toUpperCase()}<br><br>PERATURAN DESA ${desa.toUpperCase()}<br>NOMOR ${noPerdes} TAHUN ${akhir}<br><br>TENTANG<br>RENCANA PEMBANGUNAN JANGKA MENENGAH DESA<br>TAHUN ${periode}<br><br>DENGAN RAHMAT TUHAN YANG MAHA ESA<br>KEPALA DESA ${desa.toUpperCase()}</div><div class="official-consider"><strong>Menimbang:</strong><p>a. bahwa untuk memberikan arah dan tujuan pembangunan desa sesuai visi dan misi Kepala Desa, perlu disusun Rencana Pembangunan Jangka Menengah Desa;</p><p>b. bahwa RPJM Desa merupakan dasar pelaksanaan program pembangunan yang dijabarkan dalam RKP Desa;</p></div>`),
    page(`<h3 class="official-title">MEMUTUSKAN</h3><p><strong>Menetapkan:</strong> PERATURAN DESA TENTANG RENCANA PEMBANGUNAN JANGKA MENENGAH DESA ${desa.toUpperCase()} TAHUN ${periode}.</p><h3 class="official-title">BAB I<br>KETENTUAN UMUM</h3><p>Dalam Peraturan Desa ini yang dimaksud dengan Desa adalah Desa ${desa}, Kecamatan ${kecamatan}, Kabupaten ${kabupaten}, Provinsi ${provinsi}.</p><h3 class="official-title">BAB II<br>RPJM DESA</h3><p>RPJM Desa merupakan dokumen perencanaan pembangunan sebagai landasan dan pedoman Pemerintah Desa selama periode ${periode}.</p>${signature}`)
  ].join("");

  if (reportKey === "ba_tim") return page(`<h2 class="official-title">MUSYAWARAH PEMBENTUKAN TIM PENYUSUN<br>RENCANA PEMBANGUNAN JANGKA MENENGAH DESA<br>PERIODE TAHUN ${periode}</h2><h3 class="official-title">DESA ${desa.toUpperCase()} - KECAMATAN ${kecamatan.toUpperCase()}<br>KABUPATEN ${kabupaten.toUpperCase()}</h3><p>Pada tanggal ${tanggal} bertempat di Balai Desa ${desa}, Pemerintah Desa telah menyelenggarakan musyawarah pembentukan Tim Penyusun RPJM Desa periode ${periode}.</p><p>Musyawarah menyepakati susunan keanggotaan sebagai berikut:</p><table><thead><tr><th>No</th><th>Nama</th><th>Jabatan/Unsur</th><th>Kedudukan Dalam Tim</th></tr></thead><tbody>${timRows}</tbody></table><p>Demikian berita acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>${signature}`);

  if (reportKey === "sk_tim") return [
    page(`<div class="official-law-head">KABUPATEN ${kabupaten.toUpperCase()}<br><br>KEPUTUSAN KEPALA DESA ${desa.toUpperCase()}<br>NOMOR ${noSk} TAHUN ${akhir}<br><br>TENTANG<br>PEMBENTUKAN TIM PENYUSUN RENCANA PEMBANGUNAN JANGKA MENENGAH DESA<br>TAHUN ${periode}<br><br>KEPALA DESA ${desa.toUpperCase()}</div><p><strong>Menimbang:</strong> bahwa untuk menjamin penyusunan RPJM Desa yang berdaya guna dan berhasil guna, perlu membentuk Tim Penyusun RPJM Desa.</p><p><strong>Mengingat:</strong> ketentuan peraturan perundang-undangan tentang Desa, perencanaan pembangunan, dan pemberdayaan masyarakat desa.</p>`),
    page(`<h3 class="official-title">MEMUTUSKAN</h3><p><strong>KESATU:</strong> Membentuk Tim Penyusun RPJM Desa ${desa} periode ${periode}.</p><p><strong>KEDUA:</strong> Tim bertugas menyusun rancangan RPJM Desa, memfasilitasi musyawarah, melakukan pencermatan dan penyelarasan rencana kegiatan serta pembiayaan pembangunan desa.</p><p><strong>KETIGA:</strong> Tim bertanggung jawab kepada Kepala Desa.</p>${signature}`),
    page(`<h3 class="official-title">LAMPIRAN KEPUTUSAN KEPALA DESA ${desa.toUpperCase()}<br>NOMOR ${noSk}</h3><h2 class="official-title">SUSUNAN TIM PENYUSUN RPJM DESA<br>TAHUN ${periode}</h2><table><thead><tr><th>No</th><th>Nama</th><th>Jabatan/Unsur</th><th>Kedudukan Dalam Tim</th></tr></thead><tbody>${timRows}</tbody></table>${signature}`)
  ].join("");
  return "";
}

function renderMaterialReport(reportKey, reportTitle) {
  const sourceKey = materialReportSources[reportKey] || reportKey;
  const sourceTemplate = materialFormTemplates[sourceKey] || materialFormTemplates[reportKey];
  const reportPanel = document.querySelector("#materialPrintPanel");
  const printDocument = document.querySelector("#printDocument");
  if (!reportPanel || !printDocument || !sourceTemplate) return;
  materialFormPanel.hidden = true;
  document.querySelector(".material-result-panel").hidden = true;
  document.querySelector("#accessImportPanel").hidden = true;
  reportPanel.hidden = false;
  const titleElement = document.querySelector("#printReportTitle");
  if (titleElement) titleElement.textContent = reportTitle;
  const identity = desaSavedRows[0] || {};
  const officialDocument = officialRpjmReport(reportKey, identity);
  if (officialDocument) {
    printDocument.innerHTML = officialDocument;
    reportPanel.scrollIntoView({behavior:"smooth", block:"start"});
    return;
  }
  const rows = materialSavedRows.filter((row) => isMaterialRowForTemplate(row, sourceTemplate));
  const fields = getMaterialVisibleFields(sourceTemplate);
  const headerCells = fields.map((field) => `<th>${escapePrintHtml(field.label)}</th>`).join("");
  const bodyRows = rows.length ? rows.map((row, index) => `<tr><td>${index + 1}</td>${fields.map((field) => `<td>${escapePrintHtml(getMaterialRowValue(row, field))}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${fields.length + 1}">Belum ada data pada form ${escapePrintHtml(sourceTemplate.title)}.</td></tr>`;
  const isRkpReport = reportKey.startsWith("rkp_");
  const teamLabel = isRkpReport ? "Ketua Tim Penyusun RKPDesa" : "Ketua Tim Penyusun RPJMDesa";
  printDocument.innerHTML = `
    <section class="print-access-heading"><h2>${escapePrintHtml(reportTitle).toUpperCase()}</h2></section>
    <dl class="print-village-identity">
      <dt>Desa</dt><dd>: ${escapePrintHtml(identity.desa || "Gendayakan")}</dd>
      <dt>Kecamatan</dt><dd>: ${escapePrintHtml(identity.kecamatan || "Paranggupito")}</dd>
      <dt>Kabupaten</dt><dd>: ${escapePrintHtml(identity.kabupaten || "Wonogiri")}</dd>
      <dt>Provinsi</dt><dd>: ${escapePrintHtml(identity.provinsi || "Jawa Tengah")}</dd>
    </dl>
    <div class="print-table-wrap"><table><thead><tr><th>No</th>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>
    <footer class="print-signatures"><div>Mengetahui :<br>Kepala Desa<br><br><br><strong>${escapePrintHtml(identity.nama_kepala_desa || "....................")}</strong></div><div>${escapePrintHtml(identity.desa || "Gendayakan")}, ${new Date().toLocaleDateString("id-ID")}<br>${teamLabel}<br><br><br><strong>${escapePrintHtml(identity.nama_ketua_tim || "....................")}</strong></div></footer>
  `;
  reportPanel.scrollIntoView({behavior:"smooth", block:"start"});
  if (window.lucide) lucide.createIcons();
}

async function getMaterialFormValues() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = [];
  const filePromises = [];

  template.fields.forEach((field) => {
    const control = materialAutoForm?.elements[field.name];
    if (!control) return;
    if (field.type === "file") {
      const file = control.files?.[0];
      if (file) {
        const promise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            resolve({
              label: field.label,
              name: field.name,
              value: JSON.stringify({name: file.name, dataUrl: reader.result}),
            });
          });
          reader.addEventListener("error", () => {
            resolve({label: field.label, name: field.name, value: "-"});
          });
          reader.readAsDataURL(file);
        });
        filePromises.push(promise);
      } else {
        values.push({label: field.label, name: field.name, value: "-"});
      }
      return;
    }
    values.push({
      label: field.label,
      name: field.name,
      value: String(control.value || "").trim() || "-",
    });
  });

  const fileValues = await Promise.all(filePromises);
  return [...values, ...fileValues];
}

function getMaterialVisibleFields(template) {
  return template.fields || [];
}

function getMaterialValueMap(row) {
  if (row.valueMap) return row.valueMap;

  return (row.values || []).reduce((result, item) => {
    if (item.name) {
      result[item.name] = item.value;
    } else if (item.label) {
      result[item.label] = item.value;
    }
    return result;
  }, {});
}

function getMaterialRowValue(row, field) {
  const valueMap = getMaterialValueMap(row);
  const raw = valueMap[field.name] || valueMap[field.label] || "-";
  if (field.type === "file" && raw !== "-") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.dataUrl) return {_isFileValue: true, ...parsed};
    } catch (e) {}
  }
  return raw;
}

function isMaterialRowForTemplate(row, template) {
  return row.formKey ? row.formKey === template.key : row.form === template.title;
}

function renderMaterialResultHeader(template) {
  if (!materialResultHead) return;
  const visibleFields = getMaterialVisibleFields(template);
  const headerRow = document.createElement("tr");
  const table = materialResultHead.closest("table");

  let storedWidths = {};
  try {
    storedWidths = JSON.parse(localStorage.getItem(`${materialStorageKey}-column-widths-${template.key}`) || "{}");
  } catch (error) {
    storedWidths = {};
  }

  [...visibleFields.map((field) => field.label), "Aksi"].forEach((label, columnIndex) => {
    const headerCell = document.createElement("th");
    const columnKey = columnIndex < visibleFields.length ? visibleFields[columnIndex].name : "aksi";
    const savedWidth = Number(storedWidths[columnKey]) || (columnKey === "aksi" ? 168 : 150);
    headerCell.dataset.columnKey = columnKey;
    headerCell.dataset.columnIndex = String(columnIndex);
    headerCell.style.width = `${savedWidth}px`;
    headerCell.style.minWidth = `${savedWidth}px`;
    headerCell.style.maxWidth = `${savedWidth}px`;
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = "column-resize-handle";
    resizeHandle.dataset.resizeColumn = columnKey;
    resizeHandle.setAttribute("aria-label", `Ubah lebar kolom ${label}`);
    resizeHandle.title = "Tarik untuk mengubah lebar kolom";
    headerCell.append(labelSpan, resizeHandle);
    headerRow.append(headerCell);
  });

  if (table) {
    table.style.tableLayout = "fixed";
    const totalWidth = [...visibleFields.map((field) => field.name), "aksi"].reduce((sum, key) => sum + (Number(storedWidths[key]) || (key === "aksi" ? 168 : 150)), 0);
    table.style.minWidth = `${Math.max(960, totalWidth)}px`;
  }

  materialResultHead.innerHTML = "";
  materialResultHead.append(headerRow);
}

function applyMaterialColumnWidth(table, columnIndex, width) {
  const safeWidth = Math.max(90, Math.min(600, Math.round(width)));
  table?.querySelectorAll("tr").forEach((row) => {
    const cell = row.children[columnIndex];
    if (!cell) return;
    cell.style.width = `${safeWidth}px`;
    cell.style.minWidth = `${safeWidth}px`;
    cell.style.maxWidth = `${safeWidth}px`;
  });
  if (table) {
    const widths = Array.from(table.querySelectorAll("thead th")).map((cell) => parseFloat(cell.style.width) || 150);
    table.style.minWidth = `${Math.max(960, widths.reduce((sum, value) => sum + value, 0))}px`;
  }
  return safeWidth;
}

function createMaterialManualControl(field) {
  const control = document.createElement(field.type === "select" ? "select" : "div");
  control.className = "material-sheet-cell";
  control.dataset.manualField = field.name;
  control.dataset.placeholder = field.placeholder || field.label;
  control.dataset.fieldType = field.type || "text";
  control.setAttribute("aria-label", field.label);

  if (field.type === "select") {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = `Pilih ${field.label}`;
    control.append(placeholderOption);
    (field.options || []).forEach((optionLabel) => {
      const option = document.createElement("option");
      option.value = optionLabel;
      option.textContent = optionLabel;
      control.append(option);
    });
  } else {
    control.contentEditable = "true";
    control.role = "textbox";
    control.setAttribute("tabindex", "0");
  }

  return control;
}

function renderMaterialManualInputRow(template, visibleFields) {
  const tableRow = document.createElement("tr");
  tableRow.className = "material-manual-row";
  tableRow.dataset.manualKey = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  visibleFields.forEach((field) => {
    const cell = document.createElement("td");
    cell.append(createMaterialManualControl(field));
    tableRow.append(cell);
  });

  const actionCell = document.createElement("td");
  actionCell.className = "table-action-buttons";
  const editButton = document.createElement("button");
  editButton.className = "material-save-row";
  editButton.type = "button";
  editButton.dataset.manualSave = template.key;
  editButton.setAttribute("aria-label", "Simpan baris baru");
  editButton.innerHTML = '<i data-lucide="save"></i>Simpan';

  const saveButton = document.createElement("button");
  saveButton.className = "material-delete-row";
  saveButton.type = "button";
  saveButton.dataset.manualClear = template.key;
  saveButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
  actionCell.append(editButton);
  actionCell.append(saveButton);
  tableRow.append(actionCell);

  materialResultRows.append(tableRow);

  if (window.lucide) {
    lucide.createIcons();
  }

  return tableRow;
}

function saveMaterialRows() {
  try {
    window.localStorage.setItem(materialStorageKey, JSON.stringify(materialSavedRows));
  } catch (error) {
    // Penyimpanan lokal tidak wajib; tabel tetap bekerja selama halaman aktif.
  }
}

