// --- EXCEL IMPORT / EXPORT LOGIC ---
const exportExcelBtn = document.querySelector("#exportExcelBtn");
const importExcelBtn = document.querySelector("#importExcelBtn");
const importExcelFile = document.querySelector("#importExcelFile");

exportExcelBtn?.addEventListener("click", () => {
  const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
  const filteredRows = materialSavedRows.filter(row => row.formKey === currentMaterialFormKey || row.form === template.title);
  if (filteredRows.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const data = filteredRows.map((row, index) => {
    const item = { "No": index + 1 };
    template.fields.forEach(field => {
      const valObj = row.values ? row.values.find(v => v.name === field.name || v.label === field.label) : null;
      item[field.label] = valObj ? valObj.value : "-";
    });
    return item;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tersimpan");
  XLSX.writeFile(workbook, `data_${currentMaterialFormKey}.xlsx`);
});

importExcelBtn?.addEventListener("click", () => {
  importExcelFile?.click();
});

importExcelFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const template = materialFormTemplates[currentMaterialFormKey] || materialFormTemplates.dashboard;
      const createdAt = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      json.forEach((item) => {
        const values = [];
        template.fields.forEach(field => {
          const val = item[field.label] !== undefined ? String(item[field.label]) : "-";
          values.push({
            label: field.label,
            name: field.name,
            value: val
          });
        });

        materialSavedRows.unshift({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          module: activeMaterialModule.title,
          form: template.title,
          formKey: currentMaterialFormKey,
          summary: summarizeMaterialValues(values),
          status: "Berhasil di input",
          createdAt,
          values
        });
      });

      saveMaterialRows();
      renderMaterialResultTable();
      importExcelFile.value = "";
      alert(`Berhasil mengimport ${json.length} baris data!`);
    } catch(err) {
      alert("Format berkas Excel tidak sesuai / gagal di-import!");
    }
  };
  reader.readAsArrayBuffer(file);
});

