const accessImportLinks = document.querySelectorAll("[data-access-import]");
const accessImportPanel = document.querySelector("#accessImportPanel");
const accessWorkbookFile = document.querySelector("#accessWorkbookFile");
const importAccessWorkbookButton = document.querySelector("#importAccessWorkbook");
const accessImportStatus = document.querySelector("#accessImportStatus");

const normalizeAccessImportKey = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const accessTableAliases = {
  input_data_umum:["Data Umum"], rkp_data_umum:["Data Umum"], input_daftar_isi:["daftar isi rpjmdesa"], rkp_daftar_isi:["daftar isi"],
  input_misi_desa:["misi"], rkp_misi_desa:["misi"], input_rktl:["rktl rpjmdesa"], rkp_rktl:["rktl"],
  input_musdes:["musdes rpjmdes"], rkp_musdes:["musdes"], input_matrik:["matrik"], rkp_matrik:["matrik"],
  tim_penyusun:["tim rpjmdes"], rkp_tim_penyusun:["tim"], input_renc_pendapatan:["pendapatan"], rkp_pendapatan:["pendapatan"],
  rkp_pembiayaan:["pembiayaan rkp"], rkp_evaluasi_sebelumnya:["eval sebelumnya"], rkp_usulan_sdgs:["usulan sdgs"],
  input_profil_desa:["profil"], rkp_profil_desa:["profil"], dasar_hukum_perdes:["dasar hukum rpjmdes"],
  rkp_dasar_hukum_perdes:["dasar hukum"], input_sejarah_desa:["sejarah"], sketsa_desa:["sketsa desa"], kalender_musim:["kalender musim"],
};

function findAccessTable(tables, template) {
  const aliases = accessTableAliases[template.key] || [template.key, template.title];
  return tables.find((table) => aliases.some((alias) => normalizeAccessImportKey(table.name) === normalizeAccessImportKey(alias)));
}

function accessRowToValues(row, template) {
  const columns = Object.keys(row || {});
  return (template.fields || []).map((field) => {
    const column = columns.find((name) => normalizeAccessImportKey(name) === normalizeAccessImportKey(field.label) || normalizeAccessImportKey(name) === normalizeAccessImportKey(field.name));
    const raw = column ? row[column] : "-";
    return {label:field.label, name:field.name, value:raw === null || raw === undefined || raw === "" ? "-" : String(raw)};
  });
}

function createImportedAccessRow(template, values, moduleName) {
  const valueMap = values.reduce((map, value) => { map[value.name] = value.value; return map; }, {});
  return {id:`${Date.now()}-${Math.random().toString(16).slice(2)}`, module:moduleName, formKey:template.key, form:template.title,
    status:"Diimpor dari Access", createdAt:new Date().toLocaleString("id-ID"), valueMap, values};
}

accessImportLinks.forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault(); materialFormPanel.hidden = true; document.querySelector(".material-result-panel").hidden = true;
  accessImportPanel.hidden = false; accessImportPanel.scrollIntoView({behavior:"smooth", block:"start"});
}));

accessWorkbookFile?.addEventListener("change", () => {
  const file = accessWorkbookFile.files?.[0];
  importAccessWorkbookButton.disabled = !file;
  accessImportStatus.textContent = file ? `${file.name} (${(file.size / 1048576).toFixed(1)} MB)` : "";
});

importAccessWorkbookButton?.addEventListener("click", async () => {
  const file = accessWorkbookFile.files?.[0]; if (!file) return;
  importAccessWorkbookButton.disabled = true; accessImportStatus.textContent = "Mengunggah dan membaca database Access...";
  try {
    const body = new FormData(); body.append("access_file", file);
    const response = await fetch("api/access-import.php", {method:"POST", body});
    const payload = await response.json(); if (!response.ok || !payload.ok) throw new Error(payload.message || "Import gagal");
    const stores = {RPJMDesa:[], RKPDesa:[]}; let importedForms = 0;
    Object.values(materialFormTemplates).forEach((template) => {
      const moduleName = template.key.startsWith("rkp_") ? "RKPDesa" : "RPJMDesa";
      if (template.key.startsWith("apb_") || ["dashboard","profile","table","typography","icons","maps","notifications"].includes(template.key)) return;
      const table = findAccessTable(payload.tables, template); if (!table) return;
      (table.rows || []).forEach((row) => stores[moduleName].push(createImportedAccessRow(template, accessRowToValues(row, template), moduleName)));
      if (table.rows?.length) importedForms += 1;
    });
    Object.entries(stores).forEach(([moduleName, rows]) => {
      if (!rows.length) return; const key = `rpjrkp-material-inputs-${moduleName}`; let existing = [];
      try { existing = JSON.parse(localStorage.getItem(key) || "[]"); } catch (error) {}
      localStorage.setItem(key, JSON.stringify([...rows, ...existing]));
    });
    loadMaterialRows(); renderMaterialResultTable();
    accessImportStatus.textContent = `Selesai: ${importedForms} form dan ${stores.RPJMDesa.length + stores.RKPDesa.length} baris berhasil diisi dari ${payload.tableCount} tabel Access.`;
  } catch (error) { accessImportStatus.textContent = error.message || "Database Access gagal dibaca."; }
  finally { importAccessWorkbookButton.disabled = false; }
});
