loadDesaRows();
renderDesaDataTable();

let harvestChart;

const harvestCanvas = document.querySelector("#harvestChart");
const distributionCanvas = document.querySelector("#distributionChart");

if (window.Chart && harvestCanvas) {
  harvestChart = new Chart(harvestCanvas, {
    type: "line",
    data: {
      labels: harvestData.daily.labels,
      datasets: [
        {
          label: "Dokumen Masuk",
          data: harvestData.daily.fruits,
          borderColor: theme.primary,
          backgroundColor: "rgba(20, 85, 143, 0.16)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 3,
        },
        {
          label: "Terverifikasi",
          data: harvestData.daily.herbs,
          borderColor: theme.warning,
          backgroundColor: "rgba(244, 182, 63, 0.18)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 3,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          labels: {
            color: theme.muted,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "#222222",
          padding: 12,
          titleColor: "#ffffff",
          bodyColor: "#f7f7f7",
        },
      },
      scales: {
        x: {
          ticks: { color: theme.muted },
          grid: { color: "transparent" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: theme.muted },
          grid: { color: theme.grid },
        },
      },
    },
  });

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const range = button.dataset.range;
      rangeButtons.forEach((item) => item.classList.toggle("active", item === button));
      harvestChart.data.labels = harvestData[range].labels;
      harvestChart.data.datasets[0].data = harvestData[range].fruits;
      harvestChart.data.datasets[1].data = harvestData[range].herbs;
      harvestChart.update();
    });
  });
}

if (window.Chart && distributionCanvas) {
  new Chart(distributionCanvas, {
    type: "doughnut",
    data: {
      labels: ["Terverifikasi", "Dalam Review", "Draft"],
      datasets: [
        {
          data: [68, 21, 11],
          backgroundColor: [theme.primary, theme.warning, theme.accent],
          borderColor: "#ffffff",
          borderWidth: 6,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#222222",
          padding: 12,
        },
      },
    },
  });
}

if (window.bootstrap) {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    new bootstrap.Tooltip(element);
  });
}

if (window.lucide) {
  lucide.createIcons();
}

// Update account text with desa data
(function updateDesaAccountText() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("rpjrkp-dashboard-data-desa") || "[]");
    if (saved.length > 0) {
      const data = saved[0];
      const span = document.querySelector(".template-account span");
      if (span && data.desa) {
        const desa = data.desa || "";
        const kec = data.kecamatan || "";
        const kab = data.kabupaten || "";
        span.textContent = desa + ", " + kec + ". " + kab;
      }
    }
  } catch (e) {}
})();
