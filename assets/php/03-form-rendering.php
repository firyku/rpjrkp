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
  "input_rekomendasi_sdgs", "input_prioritas", "inventaris_masalah", "inventaris_potensi",
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

  const title = `${template.title} ${activeMaterialModule.title}`;
  materialFormKicker && (materialFormKicker.textContent = activeMaterialModule.title);
  materialFormHeading && (materialFormHeading.textContent = title);
  materialFormDescription && (materialFormDescription.textContent = template.description);

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

