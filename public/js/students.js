function initStu() {
  document.getElementById("scl").textContent =
    `${STUDENTS.length} registered students`;
  const yrs = [...new Set(STUDENTS.map((s) => s.year))].sort();
  document.getElementById("syr").innerHTML =
    '<option value="">All Years</option>' +
    yrs.map((y) => `<option value="${y}">${y}</option>`).join("");
  const cols = [
    ["name", "Student"],
    ["sapId", "SAP ID"],
    ["course", "Course"],
    ["year", "Year"],
    ["cgpa", "CGPA"],
    ["status", "Status"],
    ["", "Skills"],
  ];
  document.getElementById("sth").innerHTML = cols
    .map(([f, l]) =>
      f
        ? `<th class="${P.s.sf === f ? "sa" : ""}" onclick="sortS('${f}')">${l} ${P.s.sf === f ? (P.s.sd === "asc" ? "↑" : "↓") : "⇅"}</th>`
        : `<th>${l}</th>`,
    )
    .join("");
  filterStu();
}
function sortS(f) {
  if (P.s.sf === f) P.s.sd = P.s.sd === "asc" ? "desc" : "asc";
  else {
    P.s.sf = f;
    P.s.sd = "asc";
  }
  filterStu();
}
function filterStu() {
  const q = v("ssearch").toLowerCase(),
    yr = v("syr"),
    sk = v("ssk").toLowerCase(),
    cmin = parseFloat(v("scmin")) || 0,
    cmax = parseFloat(v("scmax")) || 10;
  P.s.d = srt(
    STUDENTS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.sapId.includes(q))
        return false;
      if (yr && s.year !== +yr) return false;
      if (sk && !s.skills.some((x) => x.toLowerCase().includes(sk)))
        return false;
      if (s.cgpa < cmin || s.cgpa > cmax) return false;
      return true;
    }),
    P.s.sf,
    P.s.sd,
  );
  P.s.p = 1;
  document.getElementById("src").textContent = `${P.s.d.length} results`;
  renderS(1);
}
function renderS(p) {
  P.s.p = p;
  document.getElementById("stb").innerHTML = gp(P.s)
    .map((s) => {
      const init = s.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2);
      const cc = s.cgpa >= 8.5 ? "ch" : s.cgpa >= 7 ? "cm" : "cl";
      const arr = Array.isArray(s.skills)
        ? s.skills
        : (s.skills || "").split(",").map((x) => x.trim());
      return `<tr><td><div class="scell"><div class="sav">${init}</div><div><div class="snm">${s.name}</div><div class="sem">${s.email}</div></div></div></td><td class="tm">${s.sapId}</td><td>${s.course}</td><td>${s.year}</td><td class="${cc}">${s.cgpa}</td><td>${bdg(s.status)}</td><td>${arr.map((sk) => `<span class="stag">${sk}</span>`).join("")}</td></tr>`;
    })
    .join("");
  renderPag("spag", P.s, "renderS");
}
function resetStu() {
  ["ssearch", "ssk", "scmin", "scmax"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("syr").value = "";
  filterStu();
}
