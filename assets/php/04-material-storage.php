function loadMaterialRows() {
  try {
    materialSavedRows = JSON.parse(window.localStorage.getItem(materialStorageKey) || "[]");
  } catch (error) {
    materialSavedRows = [];
  }
}

function renderMaterialResultTable() {
  if (!materialResultRows) return;
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const visibleFields = getMaterialVisibleFields(template);
  const filteredRows = materialSavedRows.filter((row) => isMaterialRowForTemplate(row, template));

  renderMaterialResultHeader(template);
  materialResultRows.innerHTML = "";

  filteredRows.forEach((row) => {
    const tableRow = document.createElement("tr");

    visibleFields.map((field) => getMaterialRowValue(row, field)).forEach((value) => {
      const cell = document.createElement("td");
      if (value && typeof value === "object" && value._isFileValue && value.dataUrl) {
        const img = document.createElement("img");
        img.className = "desa-logo-thumb";
        img.src = value.dataUrl;
        img.alt = value.name || "File";
        cell.append(img);
      } else {
        cell.textContent = value;
      }
      tableRow.append(cell);
    });

    const actionCell = document.createElement("td");
    actionCell.className = "table-action-buttons";
    const editButton = document.createElement("button");
    editButton.className = "material-edit-row";
    editButton.type = "button";
    editButton.dataset.editRowId = row.id;
    editButton.setAttribute("aria-label", "Edit baris");
    editButton.innerHTML = '<i data-lucide="pencil"></i>Edit';

    const deleteButton = document.createElement("button");
    deleteButton.className = "material-delete-row";
    deleteButton.type = "button";
    deleteButton.dataset.rowId = row.id;
    deleteButton.setAttribute("aria-label", "Hapus baris");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>Hapus';
    actionCell.append(editButton);
    actionCell.append(deleteButton);
    tableRow.append(actionCell);
    materialResultRows.append(tableRow);
  });

  renderMaterialManualInputRow(template, visibleFields);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function createMaterialSavedRow(template, values) {
  const normalizedValues = values.map((item) => ({
    label: item.label,
    name: item.name,
    value: String(item.value || "").trim() || "-",
  }));
  const valueMap = normalizedValues.reduce((result, item) => {
    result[item.name] = item.value;
    return result;
  }, {});
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    module: activeMaterialModule.title,
    formKey: template.key,
    form: template.title,
    status: "Berhasil di input",
    createdAt,
    valueMap,
    values: normalizedValues,
  };
}

function addMaterialSavedRow(template, values) {
  const savedRow = createMaterialSavedRow(template, values);

  if (editingMaterialRowId) {
    materialSavedRows = materialSavedRows.map((row) => {
      if (row.id !== editingMaterialRowId) return row;
      return {
        ...savedRow,
        id: editingMaterialRowId,
        createdAt: row.createdAt,
        updatedAt: savedRow.createdAt,
      };
    });
    editingMaterialRowId = null;
  } else {
    materialSavedRows.unshift(savedRow);
  }

  saveMaterialRows();
  renderMaterialResultTable();
}

async function addMaterialResultRow() {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const values = await getMaterialFormValues();
  addMaterialSavedRow(template, values);
}

function getMaterialManualCellValue(control) {
  if (control && "value" in control) return String(control.value || "").trim();
  return String(control?.textContent || "").replace(/\s+/g, " ").trim();
}

function isMaterialManualRowFilled(row) {
  return Array.from(row?.querySelectorAll(".material-sheet-cell") || []).some((cell) => getMaterialManualCellValue(cell) !== "");
}

function ensureTrailingBlankMaterialRow() {
  if (!materialResultRows) return;
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const visibleFields = getMaterialVisibleFields(template);
  const manualRows = Array.from(materialResultRows.querySelectorAll(".material-manual-row"));
  const lastManualRow = manualRows[manualRows.length - 1];

  if (!lastManualRow || isMaterialManualRowFilled(lastManualRow)) {
    renderMaterialManualInputRow(template, visibleFields);
  }
}

function focusSiblingMaterialCell(control, direction) {
  const cells = Array.from(materialResultRows?.querySelectorAll(".material-sheet-cell") || []);
  const index = cells.indexOf(control);
  if (index === -1) return;

  const nextCell = cells[index + direction];
  if (nextCell) {
    nextCell.focus();
  } else if (direction > 0) {
    materialResultRows?.querySelector("[data-manual-save]")?.focus();
  }
}

function clearMaterialManualCells() {
  materialResultRows?.querySelectorAll(".material-manual-row:last-child .material-sheet-cell").forEach((cell) => {
    if ("value" in cell) cell.value = "";
    else cell.textContent = "";
  });
  editingMaterialRowId = null;
}

function fillMaterialManualCells(row, template) {
  if (!row) return;
  editingMaterialRowId = row.id;
  const targetRow = materialResultRows?.querySelector(".material-manual-row") || renderMaterialManualInputRow(template, getMaterialVisibleFields(template));
  getMaterialVisibleFields(template).forEach((field) => {
    const cell = targetRow?.querySelector(`[data-manual-field="${field.name}"]`);
    if (cell) {
      const value = getMaterialRowValue(row, field) === "-" ? "" : getMaterialRowValue(row, field);
      if ("value" in cell) cell.value = value;
      else cell.textContent = value;
    }
  });
  ensureTrailingBlankMaterialRow();
}

function getFormValue(form, name) {
  return String(form?.elements[name]?.value || "").trim();
}

function getFileData(form, name) {
  const file = form?.elements[name]?.files?.[0];
  if (!file) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve({
        name: file.name,
        dataUrl: reader.result,
      });
    });
    reader.addEventListener("error", () => resolve(null));
    reader.readAsDataURL(file);
  });
}

function saveDesaRows() {
  try {
    window.localStorage.setItem(desaDataStorageKey, JSON.stringify(desaSavedRows));
  } catch (error) {
    // Data tetap tampil selama halaman aktif jika penyimpanan lokal tidak tersedia.
  }
}

