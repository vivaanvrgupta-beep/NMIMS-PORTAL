function initAna() {
  const placed = STUDENTS.filter((s) => s.status === "Placed").length;
  const pct = STUDENTS.length
    ? Math.round((placed / STUDENTS.length) * 100)
    : 0;
  const avg = STUDENTS.length
    ? (STUDENTS.reduce((s, x) => s + x.cgpa, 0) / STUDENTS.length).toFixed(2)
    : 0;
  const rc = {};
  APPS.filter((a) => a.status === "Selected").forEach(
    (a) => (rc[a.company] = (rc[a.company] || 0) + 1),
  );
  const topRec = Object.entries(rc).sort((a, b) => b[1] - a[1])[0];
  const us = [
    ...new Set(
      STUDENTS.flatMap((s) =>
        Array.isArray(s.skills)
          ? s.skills
          : (s.skills || "").split(",").map((x) => x.trim()),
      ),
    ),
  ].length;
  document.getElementById("kg").innerHTML = [
    { l: "Placement Rate", v: `${pct}%`, ic: '<ion-icon name="trending-up-outline"></ion-icon>', c: "rgba(0,230,118,0.12)" },
    { l: "Average CGPA", v: avg, ic: '<ion-icon name="star-outline"></ion-icon>', c: "rgba(255,171,0,0.12)" },
    {
      l: "Top Recruiter",
      v: topRec ? topRec[0] : "N/A",
      ic: '<ion-icon name="trophy-outline"></ion-icon>',
      c: "rgba(200,16,46,0.12)",
    },
    { l: "Unique Skills", v: us, ic: '<ion-icon name="construct-outline"></ion-icon>', c: "rgba(192,132,252,0.12)" },
  ]
    .map(
      (k, i) =>
        `<div class="sc" style="animation-delay:${i * 0.07}s"><div class="sc-ic" style="background:${k.c}">${k.ic}</div><div class="sc-lbl">${k.l}</div><div class="sc-val">${k.v}</div></div>`,
    )
    .join("");
  const cc = {};
  APPS.forEach((a) => (cc[a.company] = (cc[a.company] || 0) + 1));
  const sorted = Object.entries(cc).sort((a, b) => b[1] - a[1]);
  mkC("cCo", {
    type: "bar",
    data: {
      labels: sorted.map((c) => c[0]),
      datasets: [
        {
          data: sorted.map((c) => c[1]),
          backgroundColor: [
            "rgba(200,16,46,0.8)",
            "rgba(160,10,25,0.7)",
            "rgba(235,55,75,0.7)",
            "rgba(255,100,120,0.6)",
            "rgba(255,171,0,0.6)",
            "rgba(0,230,118,0.6)",
            "rgba(96,165,250,0.6)",
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: "rgba(200,16,46,0.06)" } },
        y: { grid: { display: false } },
      },
    },
  });
  const sk = {};
  STUDENTS.forEach((s) => {
    const arr = Array.isArray(s.skills)
      ? s.skills
      : (s.skills || "").split(",").map((x) => x.trim());
    arr.forEach((x) => {
      sk[x] = (sk[x] || 0) + 1;
    });
  });
  const ts = Object.entries(sk)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  mkC("cSk", {
    type: "radar",
    data: {
      labels: ts.map((s) => s[0]),
      datasets: [
        {
          data: ts.map((s) => s[1]),
          backgroundColor: "rgba(200,16,46,0.10)",
          borderColor: "rgba(200,16,46,0.75)",
          pointBackgroundColor: "rgba(200,16,46,1)",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          grid: { color: "rgba(200,16,46,0.06)" },
          angleLines: { color: "rgba(200,16,46,0.06)" },
          ticks: { display: false, backdropColor: "transparent" },
        },
      },
    },
  });
  const cr = {};
  STUDENTS.forEach((s) => {
    if (!cr[s.course]) cr[s.course] = { placed: 0, total: 0 };
    cr[s.course].total++;
    if (s.status === "Placed") cr[s.course].placed++;
  });
  mkC("cCr", {
    type: "bar",
    data: {
      labels: Object.keys(cr),
      datasets: [
        {
          label: "Placed",
          data: Object.values(cr).map((c) => c.placed),
          backgroundColor: "rgba(0,230,118,0.7)",
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Not Placed",
          data: Object.values(cr).map((c) => c.total - c.placed),
          backgroundColor: "rgba(200,16,46,0.62)",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "rgba(60,40,45,0.60)",
            boxWidth: 10,
            borderRadius: 3,
            padding: 16,
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, grid: { color: "rgba(200,16,46,0.06)" } },
      },
    },
  });
}
