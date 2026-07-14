
const theme = {
  primary: "#14558f",
  primaryDark: "#0e3d69",
  warning: "#f4b63f",
  accent: "#16807a",
  muted: "#5f7285",
  grid: "rgba(20, 85, 143, 0.09)",
};

const harvestData = {
  daily: {
    labels: ["07.00", "09.00", "11.00", "13.00", "15.00", "17.00"],
    fruits: [18, 32, 44, 42, 58, 72],
    herbs: [10, 18, 26, 34, 43, 55],
  },
  weekly: {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    fruits: [64, 72, 68, 83, 91, 118, 126],
    herbs: [46, 54, 61, 69, 74, 92, 104],
  },
  monthly: {
    labels: ["M1", "M2", "M3", "M4", "M5", "M6"],
    fruits: [220, 248, 286, 304, 338, 392],
    herbs: [184, 202, 244, 276, 297, 330],
  },
};

function filterActivities(keyword) {
  const normalized = keyword.trim().toLowerCase();

  activityRows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.hidden = normalized.length > 0 && !text.includes(normalized);
  });
}

activitySearch?.addEventListener("input", (event) => {
  filterActivities(event.target.value);
});

sideNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sideNavLinks.forEach((item) => item.classList.toggle("active", item === link));
  });
});

function setAdminView(viewName) {
  const config = adminConfig[viewName];
  if (!config || !dashboardView || !adminView) return;

  dashboardView.classList.add("is-hidden");
  adminView.classList.remove("is-hidden");

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setValue = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.value = value;
  };

  setText("#adminTitle", config.title);
  setText("#adminSubtitle", config.subtitle);
  setText("#adminFormTitle", config.formTitle);
  setValue("#adminDocName", config.docName);
  setValue("#adminYear", config.year);
  setValue("#adminDescription", config.description);
  setText("#adminTotalDocs", config.total);
  setText("#adminReviewDocs", config.review);
  setText("#adminVerifiedDocs", config.verified);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function setDashboardView() {
  dashboardView?.classList.remove("is-hidden");
  adminView?.classList.add("is-hidden");
}

function activateView(viewName) {
  if (viewName === "dashboard") {
    sideNavLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === "dashboard"));
    setDashboardView();
    return;
  }

  sideNavLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  setAdminView(viewName);
}

function createMaterialField(field) {
  const label = document.createElement("label");
  label.className = field.full ? "span-2" : "";

  const labelText = document.createElement("span");
  labelText.textContent = field.label;
  label.append(labelText);

  let control;
  if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = 4;
  } else if (field.type === "select") {
    control = document.createElement("select");
    (field.options || []).forEach((optionLabel) => {
      const option = document.createElement("option");
      option.value = optionLabel;
      option.textContent = optionLabel;
      option.selected = optionLabel === field.value;
      control.append(option);
    });
  } else if (field.type === "file") {
    control = document.createElement("input");
    control.type = "file";
    control.accept = field.accept || "image/*";
    const preview = document.createElement("img");
    preview.className = "material-file-preview";
    preview.hidden = true;
    preview.alt = "Pratinjau " + field.label;
    control.addEventListener("change", () => {
      const file = control.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          preview.src = reader.result;
          preview.hidden = false;
        });
        reader.readAsDataURL(file);
      } else {
        preview.hidden = true;
      }
    });
    label.append(preview);
  } else {
    control = document.createElement("input");
    control.type = field.type || "text";
  }

  control.name = field.name;
  if (field.placeholder) control.placeholder = field.placeholder;
  if (field.value && field.type !== "select" && field.type !== "file") control.value = field.value;
  label.append(control);

  return label;
}

