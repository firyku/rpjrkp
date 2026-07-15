function loadDesaRows() {
  try {
    desaSavedRows = JSON.parse(window.localStorage.getItem(desaDataStorageKey) || "[]");
    let identityUpdated = false;
    desaSavedRows = desaSavedRows.map((row) => {
      if (String(row.desa || "").toLowerCase() !== "gudangharjo") return row;
      identityUpdated = true;
      return {...row, desa:"Gendayakan", kecamatan:"Paranggupito", kabupaten:"Wonogiri"};
    });
    if (identityUpdated) window.localStorage.setItem(desaDataStorageKey, JSON.stringify(desaSavedRows));
  } catch (error) {
    desaSavedRows = [];
  }
}

function renderDesaDataTable() {
  updateRpjmIdentityCards();
  if (!desaDataRows) return;
  desaDataRows.innerHTML = "";

  if (desaSavedRows.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "material-empty-row";
    emptyRow.innerHTML = '<td colspan="17">Belum ada Data Desa yang berhasil diinput.</td>';
    desaDataRows.append(emptyRow);
    return;
  }

  desaSavedRows.forEach((row, index) => {
    const tableRow = document.createElement("tr");
    [
      index + 1,
      row.desa,
      row.kecamatan,
      row.kabupaten,
      row.tahun_anggaran,
      row.nama_kepala_desa,
      row.jenis_rpjmdes,
      row.status_perdes_rpjmdes,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "-";
      tableRow.append(cell);
    });

    ["logo_kementrian", "logo_kabupaten"].forEach((key) => {
      const cell = document.createElement("td");
      if (row[key]?.dataUrl) {
        const image = document.createElement("img");
        image.className = "desa-logo-thumb";
        image.src = row[key].dataUrl;
        image.alt = row[key].name || "Logo";
        cell.append(image);
      } else {
        cell.textContent = "-";
      }
      tableRow.append(cell);
    });

    ["background_cover", "foto_kades", "gambar_cover_rpjmdesa", "gambar_bagan_kelembagaan", "gambar_sketsa_desa"].forEach((key) => {
      const cell = document.createElement("td");
      if (row[key]?.dataUrl) {
        const image = document.createElement("img");
        image.className = "desa-logo-thumb";
        image.src = row[key].dataUrl;
        image.alt = row[key].name || key;
        cell.append(image);
      } else {
        cell.textContent = "-";
      }
      tableRow.append(cell);
    });

    const timeCell = document.createElement("td");
    timeCell.textContent = row.updatedAt ? `${row.createdAt} / edit ${row.updatedAt}` : row.createdAt;
    tableRow.append(timeCell);

    const actionCell = document.createElement("td");
    actionCell.className = "table-action-buttons";
    const editButton = document.createElement("button");
    editButton.className = "material-edit-row";
    editButton.type = "button";
    editButton.dataset.editDesaRowId = row.id;
    editButton.setAttribute("aria-label", "Edit data desa");
    editButton.innerHTML = '<i data-lucide="pencil"></i>Edit';

    const deleteButton = document.createElement("button");
    deleteButton.className = "material-delete-row";
    deleteButton.type = "button";
    deleteButton.dataset.desaRowId = row.id;
    deleteButton.setAttribute("aria-label", "Hapus data desa");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
    actionCell.append(editButton);
    actionCell.append(deleteButton);
    tableRow.append(actionCell);
    desaDataRows.append(tableRow);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

async function collectDesaFormData(existingRow = null) {
  if (!desaDataForm) return;
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const logoKementrian = await getFileData(desaDataForm, "logo_kementrian");
  const logoKabupaten = await getFileData(desaDataForm, "logo_kabupaten");
  const backgroundCover = await getFileData(desaDataForm, "background_cover");
  const fotoKades = await getFileData(desaDataForm, "foto_kades");
  const gambarCoverRpjmdesa = await getFileData(desaDataForm, "gambar_cover_rpjmdesa");
  const gambarBaganKelembagaan = await getFileData(desaDataForm, "gambar_bagan_kelembagaan");
  const gambarSketsaDesa = await getFileData(desaDataForm, "gambar_sketsa_desa");

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    desa: getFormValue(desaDataForm, "desa"),
    kecamatan: getFormValue(desaDataForm, "kecamatan"),
    kabupaten: getFormValue(desaDataForm, "kabupaten"),
    provinsi: getFormValue(desaDataForm, "provinsi"),
    tahun_anggaran: getFormValue(desaDataForm, "tahun_anggaran"),
    tahun_berjalan: getFormValue(desaDataForm, "tahun_berjalan"),
    visi_desa: getFormValue(desaDataForm, "visi_desa"),
    misi_desa: getFormValue(desaDataForm, "misi_desa"),
    nama_kepala_desa: getFormValue(desaDataForm, "nama_kepala_desa"),
    nama_sekretaris_desa: getFormValue(desaDataForm, "nama_sekretaris_desa"),
    nama_ketua_tim: getFormValue(desaDataForm, "nama_ketua_tim"),
    nama_ketua_bpd: getFormValue(desaDataForm, "nama_ketua_bpd"),
    no_sk_tim_penyusun: getFormValue(desaDataForm, "no_sk_tim_penyusun"),
    jenis_rpjmdes: getFormValue(desaDataForm, "jenis_rpjmdes"),
    perdes_rpjmdesa: getFormValue(desaDataForm, "perdes_rpjmdesa"),
    status_perdes_rpjmdes: getFormValue(desaDataForm, "status_perdes_rpjmdes"),
    tanggal_penyusunan_rpjmdes: getFormValue(desaDataForm, "tanggal_penyusunan_rpjmdes"),
    tanggal_pengundangan_perdes_rpjmdes: getFormValue(desaDataForm, "tanggal_pengundangan_perdes_rpjmdes"),
    alamat_desa: getFormValue(desaDataForm, "alamat_desa"),
    jumlah_dusun: getFormValue(desaDataForm, "jumlah_dusun"),
    jumlah_kk: getFormValue(desaDataForm, "jumlah_kk"),
    jarak_ke_kabupaten: getFormValue(desaDataForm, "jarak_ke_kabupaten"),
    luas_wilayah: getFormValue(desaDataForm, "luas_wilayah"),
    jumlah_rt: getFormValue(desaDataForm, "jumlah_rt"),
    mata_pencaharian: getFormValue(desaDataForm, "mata_pencaharian"),
    agama_mayoritas: getFormValue(desaDataForm, "agama_mayoritas"),
    komoditas_utama: getFormValue(desaDataForm, "komoditas_utama"),
    batas_wilayah: getFormValue(desaDataForm, "batas_wilayah"),
    profil_desa: getFormValue(desaDataForm, "profil_desa"),
    logo_kementrian: logoKementrian || existingRow?.logo_kementrian || null,
    logo_kabupaten: logoKabupaten || existingRow?.logo_kabupaten || null,
    background_cover: backgroundCover || existingRow?.background_cover || null,
    foto_kades: fotoKades || existingRow?.foto_kades || null,
    gambar_cover_rpjmdesa: gambarCoverRpjmdesa || existingRow?.gambar_cover_rpjmdesa || null,
    gambar_bagan_kelembagaan: gambarBaganKelembagaan || existingRow?.gambar_bagan_kelembagaan || null,
    gambar_sketsa_desa: gambarSketsaDesa || existingRow?.gambar_sketsa_desa || null,
    tentang_perdes_rpjmdes: getFormValue(desaDataForm, "tentang_perdes_rpjmdes"),
    createdAt,
  };
}

function fillDesaForm(row) {
  if (!desaDataForm || !row) return;
  [
    "desa",
    "kecamatan",
    "kabupaten",
    "provinsi",
    "tahun_anggaran",
    "tahun_berjalan",
    "visi_desa",
    "misi_desa",
    "nama_kepala_desa",
    "nama_sekretaris_desa",
    "nama_ketua_tim",
    "nama_ketua_bpd",
    "no_sk_tim_penyusun",
    "jenis_rpjmdes",
    "perdes_rpjmdesa",
    "status_perdes_rpjmdes",
    "tanggal_penyusunan_rpjmdes",
    "tanggal_pengundangan_perdes_rpjmdes",
    "alamat_desa",
    "jumlah_dusun",
    "jumlah_kk",
    "jarak_ke_kabupaten",
    "luas_wilayah",
    "jumlah_rt",
    "mata_pencaharian",
    "agama_mayoritas",
    "komoditas_utama",
    "batas_wilayah",
    "profil_desa",
    "tentang_perdes_rpjmdes",
  ].forEach((name) => {
    if (desaDataForm.elements[name]) {
      desaDataForm.elements[name].value = row[name] || "";
    }
  });
}

function setDesaSubmitMode(isEditing) {
  const submitButton = desaDataForm?.querySelector('[type="submit"]');
  if (!submitButton) return;
  submitButton.innerHTML = isEditing
    ? '<i data-lucide="save"></i>Update Data Desa'
    : '<i data-lucide="save"></i>Simpan Data Desa';
  if (window.lucide) lucide.createIcons();
}

async function addDesaDataRow() {
  const existingRow = editingDesaRowId ? desaSavedRows.find((row) => row.id === editingDesaRowId) : null;
  const formData = await collectDesaFormData(existingRow);
  if (!formData) return;

  if (editingDesaRowId) {
    desaSavedRows = desaSavedRows.map((row) => {
      if (row.id !== editingDesaRowId) return row;
      return {
        ...formData,
        id: editingDesaRowId,
        createdAt: row.createdAt,
        updatedAt: formData.createdAt,
      };
    });
    editingDesaRowId = null;
    setDesaSubmitMode(false);
  } else {
    desaSavedRows.unshift(formData);
  }

  saveDesaRows();
  renderDesaDataTable();
}

materialMenuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    materialMenuLinks.forEach((item) => item.classList.toggle("active", item === link));
    const groupTitle = link.closest("details")?.querySelector("summary span")?.textContent.trim();
    if (groupTitle === "Laporan") {
      renderMaterialReport(link.dataset.materialForm, link.textContent.trim());
      return;
    }
    renderMaterialForm(link.dataset.materialForm);
    const target = materialFormPanel?.hidden ? document.querySelector(".material-result-panel") : materialFormPanel;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

document.querySelector("#printReportButton")?.addEventListener("click", () => window.print());

materialAutoForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = materialAutoForm.querySelector('[type="submit"]');
  if (!submitButton) return;
  await addMaterialResultRow();
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i data-lucide="check"></i>Tersimpan';
  submitButton.classList.add("is-saved");
  if (window.lucide) lucide.createIcons();
  window.setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.classList.remove("is-saved");
    if (window.lucide) lucide.createIcons();
  }, 1400);
});

materialResultRows?.addEventListener("click", (event) => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;

  const manualSaveButton = event.target.closest("[data-manual-save]");
  if (manualSaveButton) {
    const manualRow = manualSaveButton.closest(".material-manual-row");
    const values = getMaterialVisibleFields(template).map((field) => {
      const control = manualRow?.querySelector(`[data-manual-field="${field.name}"]`);
      return {
        label: field.label,
        name: field.name,
        value: getMaterialManualCellValue(control) || "-",
      };
    });

    addMaterialSavedRow(template, values);
    return;
  }

  const manualClearButton = event.target.closest("[data-manual-clear]");
  if (manualClearButton) {
    const manualRow = manualClearButton.closest(".material-manual-row");
    const manualRows = Array.from(materialResultRows.querySelectorAll(".material-manual-row"));
    if (manualRows.length > 1 && manualRow && !manualRow.isSameNode(manualRows[manualRows.length - 1])) {
      manualRow.remove();
    } else {
      clearMaterialManualCells();
    }
    ensureTrailingBlankMaterialRow();
    return;
  }

  const editButton = event.target.closest("[data-edit-row-id]");
  if (editButton) {
    const row = materialSavedRows.find((item) => item.id === editButton.dataset.editRowId);
    fillMaterialManualCells(row, template);
    materialResultRows.querySelector(".material-sheet-cell")?.focus();
    return;
  }

  const deleteButton = event.target.closest("[data-row-id]");
  if (!deleteButton) return;
  if (editingMaterialRowId === deleteButton.dataset.rowId) {
    editingMaterialRowId = null;
  }
  materialSavedRows = materialSavedRows.filter((row) => row.id !== deleteButton.dataset.rowId);
  saveMaterialRows();
  renderMaterialResultTable();
});

materialResultRows?.addEventListener("keydown", (event) => {
  const cell = event.target.closest(".material-sheet-cell");
  if (!cell) return;

  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    cell.closest(".material-manual-row")?.querySelector("[data-manual-save]")?.click();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    focusSiblingMaterialCell(cell, event.shiftKey ? -1 : 1);
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    focusSiblingMaterialCell(cell, event.shiftKey ? -1 : 1);
  }
});

materialResultRows?.addEventListener("input", (event) => {
  const cell = event.target.closest(".material-sheet-cell");
  if (!cell) return;
  ensureTrailingBlankMaterialRow();
});

document.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".column-resize-handle");
  if (!handle) return;
  event.preventDefault();
  const header = handle.closest("th");
  const table = header?.closest("table");
  if (!header || !table) return;

  const startX = event.clientX;
  const startWidth = header.getBoundingClientRect().width;
  const columnIndex = Number(header.dataset.columnIndex);
  const columnKey = header.dataset.columnKey;
  handle.classList.add("is-resizing");
  document.body.classList.add("is-resizing-column");

  const onMove = (moveEvent) => {
    applyMaterialColumnWidth(table, columnIndex, startWidth + moveEvent.clientX - startX);
  };
  const onEnd = () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onEnd);
    handle.classList.remove("is-resizing");
    document.body.classList.remove("is-resizing-column");
    const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
    let widths = {};
    try { widths = JSON.parse(localStorage.getItem(`${materialStorageKey}-column-widths-${template.key}`) || "{}"); } catch (error) { widths = {}; }
    widths[columnKey] = Math.round(header.getBoundingClientRect().width);
    try { localStorage.setItem(`${materialStorageKey}-column-widths-${template.key}`, JSON.stringify(widths)); } catch (error) {}
  };
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onEnd, {once:true});
});

clearMaterialTableButton?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  materialSavedRows = materialSavedRows.filter((row) => !isMaterialRowForTemplate(row, template));
  saveMaterialRows();
  renderMaterialResultTable();
});

addMaterialTableRowButton?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const row = renderMaterialManualInputRow(template, getMaterialVisibleFields(template));
  row?.querySelector(".material-sheet-cell")?.focus();
  row?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});
});

desaDataForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const wasEditing = Boolean(editingDesaRowId);
  const submitButton = desaDataForm.querySelector('[type="submit"]');
  if (!submitButton) return;
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i data-lucide="loader-circle"></i>Menyimpan...';
  if (window.lucide) lucide.createIcons();
  await addDesaDataRow();
  submitButton.innerHTML = wasEditing
    ? '<i data-lucide="check"></i>Data Desa Diperbarui'
    : '<i data-lucide="check"></i>Data Desa Tersimpan';
  if (window.lucide) lucide.createIcons();
  window.setTimeout(() => {
    setDesaSubmitMode(false);
    if (window.lucide) lucide.createIcons();
  }, 1400);
});

desaDataForm?.addEventListener("reset", () => {
  editingDesaRowId = null;
  window.setTimeout(() => setDesaSubmitMode(false), 0);
});

desaDataRows?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-desa-row-id]");
  if (editButton) {
    const row = desaSavedRows.find((item) => item.id === editButton.dataset.editDesaRowId);
    if (!row) return;
    editingDesaRowId = row.id;
    fillDesaForm(row);
    setDesaSubmitMode(true);
    document.querySelector("#inputDataDesa")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const deleteButton = event.target.closest("[data-desa-row-id]");
  if (!deleteButton) return;
  if (editingDesaRowId === deleteButton.dataset.desaRowId) {
    editingDesaRowId = null;
    setDesaSubmitMode(false);
  }
  desaSavedRows = desaSavedRows.filter((row) => row.id !== deleteButton.dataset.desaRowId);
  saveDesaRows();
  renderDesaDataTable();
});

clearDesaDataTableButton?.addEventListener("click", () => {
  desaSavedRows = [];
  editingDesaRowId = null;
  setDesaSubmitMode(false);
  saveDesaRows();
  renderDesaDataTable();
});

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const viewName = link.dataset.view;
    activateView(viewName);
  });
});

const initialHash = window.location.hash.replace("#", "");
if (adminConfig[initialHash]) {
  activateView(initialHash);
}

renderMaterialForm("dashboard");
loadMaterialRows();
renderMaterialResultTable();
