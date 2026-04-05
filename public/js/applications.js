function initApps() {
  document.getElementById("acl").textContent =
    `${APPS.length} total applications`;
  const scfg = [
    { s: "Selected", c: "#00e676", bg: "rgba(0,230,118,0.10)" },
    { s: "In Process", c: "#ffab00", bg: "rgba(255,171,0,0.10)" },
    { s: "Rejected", c: "#ff4466", bg: "rgba(255,68,102,0.10)" },
  ];
  document.getElementById("spills").innerHTML = scfg
    .map(({ s, c, bg }) => {
      const cnt = APPS.filter((a) => a.status === s).length;
      return `<div class="pill" data-s="${s}" data-c="${c}" data-bg="${bg}" style="background:${bg};border-color:transparent" onclick="togglePill(this)"><span class="pill-n" style="color:${c}">${cnt}</span><span class="pill-l" style="color:${c}">${s}</span></div>`;
    })
    .join("");
  const cos = [...new Set(APPS.map((a) => a.company))].sort();
  document.getElementById("aco").innerHTML =
    '<option value="">All Companies</option>' +
    cos.map((c) => `<option>${c}</option>`).join("");
  const sts = [...new Set(APPS.map((a) => a.status))];
  document.getElementById("ast").innerHTML =
    '<option value="">All Statuses</option>' +
    sts.map((s) => `<option>${s}</option>`).join("");
  const cols = [
    ["student", "Student"],
    ["jobRole", "Job Role"],
    ["company", "Company"],
    ["date", "Applied On"],
    ["status", "Status"],
  ];
  document.getElementById("ath").innerHTML = cols
    .map(
      ([f, l]) =>
        `<th class="${P.a.sf === f ? "sa" : ""}" onclick="sortA('${f}')">${l} ${P.a.sf === f ? (P.a.sd === "asc" ? "↑" : "↓") : "⇅"}</th>`,
    )
    .join("");
  filterApps();
}
function togglePill(el) {
  const s = el.dataset.s;
  appSF = appSF === s ? "" : s;
  document.querySelectorAll(".pill").forEach((p) => {
    const act = p.dataset.s === appSF;
    p.style.background = act ? p.dataset.c : p.dataset.bg;
    p.style.borderColor = act ? p.dataset.c : "transparent";
    p.querySelectorAll(".pill-n,.pill-l").forEach(
      (x) => (x.style.color = act ? "#000" : p.dataset.c),
    );
  });
  document.getElementById("ast").value = appSF;
  filterApps();
}
function sortA(f) {
  if (P.a.sf === f) P.a.sd = P.a.sd === "asc" ? "desc" : "asc";
  else {
    P.a.sf = f;
    P.a.sd = "asc";
  }
  filterApps();
}
function filterApps() {
  const q = v("asearch").toLowerCase(),
    co = v("aco"),
    st = v("ast") || appSF,
    dt = v("adt");
  P.a.d = srt(
    APPS.filter((a) => {
      if (q && !a.student.toLowerCase().includes(q)) return false;
      if (co && a.company !== co) return false;
      if (st && a.status !== st) return false;
      if (dt && a.date < dt) return false;
      return true;
    }),
    P.a.sf,
    P.a.sd,
  );
  P.a.p = 1;
  renderA(1);
}
function renderA(p) {
  P.a.p = p;
  document.getElementById("atb").innerHTML = gp(P.a)
    .map(
      (a) =>
        `<tr><td><div class="snm">${a.student}</div><div class="tm">${a.sapId}</div></td><td>${a.jobRole}</td><td class="tb">${a.company}</td><td style="color:var(--text3)">${a.date}</td><td>${bdg(a.status)}</td></tr>`,
    )
    .join("");
  renderPag("apag", P.a, "renderA");
}
function resetApps() {
  ["asearch", "adt"].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("aco").value = "";
  document.getElementById("ast").value = "";
  appSF = "";
  document.querySelectorAll(".pill").forEach((p) => {
    p.style.background = p.dataset.bg;
    p.style.borderColor = "transparent";
    p.querySelectorAll(".pill-n,.pill-l").forEach(
      (x) => (x.style.color = p.dataset.c),
    );
  });
  filterApps();
}
