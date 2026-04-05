const API = "http://localhost:3000/api";
Chart.defaults.color = "rgba(255,255,255,0.42)";
Chart.defaults.borderColor = "rgba(255,255,255,0.055)";
Chart.defaults.font.family = "'Sora',sans-serif";
let STUDENTS = [],
  JOBS = [],
  APPS = [];
let charts = {},
  editJobId = null,
  appSF = "";
const P = {
  j: { p: 1, pp: 5, sf: "id", sd: "asc", d: [] },
  s: { p: 1, pp: 8, sf: "name", sd: "asc", d: [] },
  a: { p: 1, pp: 8, sf: "date", sd: "desc", d: [] },
};
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tbdate").textContent = new Date().toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" },
  );
  let p = 0;
  const fill = document.getElementById("spFill");
  const iv = setInterval(() => {
    p += Math.random() * 20 + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
    }
    fill.style.width = p + "%";
  }, 110);
  setTimeout(() => {
    document.getElementById("splash").classList.add("out");
    setTimeout(() => {
      document.getElementById("splash").style.display = "none";
      showLogin();
    }, 850);
  }, 1900);
});
function loadData() {
  return (async () => {
    try {
      showL();
      const [s, j, a] = await Promise.all([
        fetch(`${API}/students`).then((r) => r.json()),
        fetch(`${API}/jobs`).then((r) => r.json()),
        fetch(`${API}/applications`).then((r) => r.json()),
      ]);
      STUDENTS = s;
      JOBS = j;
      APPS = a;
    } catch (e) {
      toast("Cannot connect to server. Is Node.js running?", "err");
      console.error(e);
    } finally {
      hideL();
    }
  })();
}
function showL() {
  document.getElementById("loader").classList.add("on");
}
function hideL() {
  document.getElementById("loader").classList.remove("on");
}
function showLogin() {
  document.getElementById("login-page").style.display = "block";
  ["lemail", "lpass"].forEach((id) =>
    document.getElementById(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    }),
  );
}
function doLogin() {
  const em = document.getElementById("lemail").value.trim(),
    pw = document.getElementById("lpass").value,
    btn = document.getElementById("lbtn");
  let ok = true;
  document.getElementById("lalert").style.display = "none";
  ["eerr", "perr"].forEach(
    (id) => (document.getElementById(id).style.display = "none"),
  );
  document.getElementById("lemail").classList.remove("err");
  document.getElementById("lpass").classList.remove("err");
  if (!em || !/\S+@\S+\.\S+/.test(em)) {
    document.getElementById("eerr").style.display = "block";
    document.getElementById("lemail").classList.add("err");
    ok = false;
  }
  if (!pw || pw.length < 6) {
    document.getElementById("perr").style.display = "block";
    document.getElementById("lpass").classList.add("err");
    ok = false;
  }
  if (!ok) return;
  btn.disabled = true;
  btn.innerHTML = '<span class="spin-s"></span>Signing in...';
  setTimeout(() => {
    if (em === "admin@nmims.in" && pw === "admin123") {
      document.getElementById("login-page").style.display = "none";
      launchApp();
    } else {
      document.getElementById("lalert").style.display = "block";
      btn.disabled = false;
      btn.textContent = "Sign In →";
    }
  }, 900);
}
function doLogout() {
  destroyC();
  document.getElementById("app").style.display = "none";
  document.getElementById("sbl").classList.remove("vis");
  document.getElementById("lemail").value = "";
  document.getElementById("lpass").value = "";
  document.getElementById("lbtn").textContent = "Sign In →";
  document.getElementById("lbtn").disabled = false;
  document.getElementById("login-page").style.display = "block";
  toast("Signed out successfully", "inf");
}
async function launchApp() {
  document.getElementById("app").style.display = "block";
  setTimeout(() => document.getElementById("sbl").classList.add("vis"), 200);
  await loadData();
  navTo("dashboard");
  toast("Welcome back, Admin — data loaded ✓", "suc");
}
const NAVL = {
  dashboard: "Dashboard",
  jobs: "Job Management",
  students: "Students",
  applications: "Applications",
  analytics: "Analytics",
};
function navTo(pg) {
  document
    .querySelectorAll(".nav-item")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-p="${pg}"]`).classList.add("active");
  document
    .querySelectorAll(".page")
    .forEach((e) => e.classList.remove("active"));
  document.getElementById(`page-${pg}`).classList.add("active");
  document.getElementById("tbtitle").textContent = NAVL[pg];
  if (pg === "dashboard") initDB();
  if (pg === "jobs") initJobs();
  if (pg === "students") initStu();
  if (pg === "applications") initApps();
  if (pg === "analytics") initAna();
}
function toast(msg, type = "inf") {
  const ic = { suc: "✓", err: "✕", inf: "ℹ" };
  const c = document.getElementById("toasts"),
    t = document.createElement("div");
  t.className = `toast t-${type}`;
  t.innerHTML = `<span style="font-size:15px">${ic[type]}</span><span class="t-msg">${msg}</span><button class="t-x" onclick="this.parentElement.remove()">×</button>`;
  c.appendChild(t);
  setTimeout(() => t.remove && t.remove(), 4500);
}
