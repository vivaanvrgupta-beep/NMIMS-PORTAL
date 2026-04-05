function initDB() {
  const placed = STUDENTS.filter((s) => s.status === "Placed").length,
    np = STUDENTS.length - placed;
  const stats = [
    {
      l: "Total Students",
      v: STUDENTS.length,
      ic: "🎓",
      c: "rgba(200,16,46,0.14)",
    },
    { l: "Jobs Posted", v: JOBS.length, ic: "💼", c: "rgba(96,165,250,0.14)" },
    { l: "Applications", v: APPS.length, ic: "📋", c: "rgba(255,171,0,0.14)" },
    { l: "Students Placed", v: placed, ic: "✅", c: "rgba(0,230,118,0.14)" },
    { l: "Not Placed", v: np, ic: "⏳", c: "rgba(255,68,102,0.14)" },
    {
      l: "Placement %",
      v: STUDENTS.length
        ? Math.round((placed / STUDENTS.length) * 100) + "%"
        : "0%",
      ic: "📈",
      c: "rgba(192,132,252,0.14)",
    },
  ];
  document.getElementById("sg").innerHTML = stats
    .map(
      (s, i) =>
        `<div class="sc" style="animation-delay:${i * 0.055}s"><div class="sc-ic" style="background:${s.c}">${s.ic}</div><div class="sc-lbl">${s.l}</div><div class="sc-val">${s.v}</div></div>`,
    )
    .join("");
  const cc = {};
  APPS.forEach((a) => (cc[a.company] = (cc[a.company] || 0) + 1));
  mkC("cBar", {
    type: "bar",
    data: {
      labels: Object.keys(cc),
      datasets: [
        {
          data: Object.values(cc),
          backgroundColor: "rgba(200,16,46,0.7)",
          hoverBackgroundColor: "rgba(200,16,46,0.95)",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.04)" } },
        x: { grid: { display: false } },
      },
    },
  });
  mkC("cPie", {
    type: "doughnut",
    data: {
      labels: ["Placed", "Not Placed"],
      datasets: [
        {
          data: [placed, np],
          backgroundColor: ["rgba(0,230,118,0.85)", "rgba(200,16,46,0.75)"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false } },
    },
  });
  document.getElementById("pie-leg").innerHTML =
    `<span class="leg-i"><span class="leg-d" style="background:rgba(0,230,118,0.85)"></span>Placed ${placed}</span><span class="leg-i"><span class="leg-d" style="background:rgba(200,16,46,0.75)"></span>Not Placed ${np}</span>`;
  const sts = ["Selected", "In Process", "Rejected"];
  const sc = sts.map((s) => APPS.filter((a) => a.status === s).length);
  mkC("cLine", {
    type: "bar",
    data: {
      labels: sts,
      datasets: [
        {
          data: sc,
          backgroundColor: [
            "rgba(0,230,118,0.7)",
            "rgba(255,171,0,0.7)",
            "rgba(200,16,46,0.7)",
          ],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.04)" } },
        x: { grid: { display: false } },
      },
    },
  });
}
