function bdg(s) {
  const m = {
    Placed: "placed",
    Selected: "selected",
    Rejected: "rejected",
    "Not Placed": "notplaced",
    Interview: "interview",
    Shortlisted: "shortlisted",
    Applied: "applied",
    "In Process": "inprocess",
    Internship: "internship",
    "Full Time": "fulltime",
  };
  return `<span class="badge b-${m[s] || "applied"}">${s}</span>`;
}
function srt(d, f, dir) {
  return [...d].sort((a, b) => {
    const va = a[f],
      vb = b[f];
    if (typeof va === "number") return dir === "asc" ? va - vb : vb - va;
    return dir === "asc"
      ? String(va || "").localeCompare(String(vb || ""))
      : String(vb || "").localeCompare(String(va || ""));
  });
}
function gp(st) {
  const s = (st.p - 1) * st.pp;
  return st.d.slice(s, s + st.pp);
}
function renderPag(cid, st, fn) {
  const tot = st.d.length,
    pgs = Math.ceil(tot / st.pp),
    c = document.getElementById(cid);
  if (pgs <= 1) {
    c.innerHTML = "";
    return;
  }
  const s = (st.p - 1) * st.pp + 1,
    e = Math.min(st.p * st.pp, tot);
  let h = `<span class="pi2">${s}–${e} of ${tot}</span>`;
  for (let i = 1; i <= pgs; i++)
    h += `<button class="pb${i === st.p ? " act" : ""}" onclick="${fn}(${i})">${i}</button>`;
  c.innerHTML = h;
}
function destroyC() {
  Object.values(charts).forEach((c) => {
    try {
      c.destroy();
    } catch (e) {}
  });
  charts = {};
}
function mkC(id, cfg) {
  if (charts[id]) charts[id].destroy();
  const v = document.getElementById(id);
  if (!v) return;
  charts[id] = new Chart(v, cfg);
}
function v(id) {
  const e = document.getElementById(id);
  return e ? e.value : "";
}
