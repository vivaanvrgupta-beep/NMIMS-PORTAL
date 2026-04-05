function initJobs() {
  document.getElementById("jcl").textContent = `${JOBS.length} active postings`;
  const cols = [
    ["id", "Job ID"],
    ["company", "Company"],
    ["role", "Role"],
    ["salary", "Salary"],
    ["location", "Location"],
    ["deadline", "Deadline"],
    ["type", "Type"],
    ["", "Actions"],
  ];
  document.getElementById("jth").innerHTML = cols
    .map(([f, l]) =>
      f
        ? `<th class="${P.j.sf === f ? "sa" : ""}" onclick="sortJ('${f}')">${l} ${P.j.sf === f ? (P.j.sd === "asc" ? "↑" : "↓") : "⇅"}</th>`
        : `<th>${l}</th>`,
    )
    .join("");
  filterJobs();
}
function sortJ(f) {
  if (P.j.sf === f) P.j.sd = P.j.sd === "asc" ? "desc" : "asc";
  else {
    P.j.sf = f;
    P.j.sd = "asc";
  }
  P.j.p = 1;
  initJobs();
}
function filterJobs() {
  const q = (
    document.getElementById("jsearch") || { value: "" }
  ).value.toLowerCase();
  P.j.d = srt(
    JOBS.filter(
      (j) =>
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q),
    ),
    P.j.sf,
    P.j.sd,
  );
  P.j.p = 1;
  renderJ(1);
}
function renderJ(p) {
  P.j.p = p;
  document.getElementById("jtb").innerHTML = gp(P.j)
    .map(
      (j) =>
        `<tr><td class="tm">${j.id}</td><td class="tb">${j.company}</td><td>${j.role}</td><td class="tg">${j.salary}</td><td>${j.location}</td><td>${j.deadline}</td><td>${bdg(j.type)}</td><td><div class="ba"><button class="be" onclick="editJ('${j.id}')">Edit</button><button class="bd" onclick="delJ('${j.id}')">Delete</button></div></td></tr>`,
    )
    .join("");
  renderPag("jpag", P.j, "renderJ");
}
function toggleJobForm() {
  editJobId = null;
  document.getElementById("jft").textContent = "New Job Posting";
  document.getElementById("jsub").textContent = "Post Job";
  clearJF();
  const w = document.getElementById("jfw");
  w.style.display = w.style.display === "block" ? "none" : "block";
}
function closeJF() {
  document.getElementById("jfw").style.display = "none";
  editJobId = null;
  clearJF();
}
function clearJF() {
  ["jfc", "jfr", "jfs", "jfl", "jfe", "jfd", "jfsk", "jfdesc"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.value = "";
  });
  document.getElementById("jftype").value = "Full Time";
  ["jec", "jer", "jes", "jel", "jed"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.style.display = "none";
  });
}
function editJ(id) {
  const j = JOBS.find((x) => x.id === id);
  if (!j) return;
  editJobId = id;
  document.getElementById("jft").textContent = "Edit Job Posting";
  document.getElementById("jsub").textContent = "Update Job";
  document.getElementById("jfc").value = j.company;
  document.getElementById("jfr").value = j.role;
  document.getElementById("jfs").value = j.salary;
  document.getElementById("jfl").value = j.location;
  document.getElementById("jfe").value = j.eligibility || "";
  document.getElementById("jfd").value = j.deadline;
  document.getElementById("jftype").value = j.type;
  document.getElementById("jfsk").value = Array.isArray(j.skills)
    ? j.skills.join(", ")
    : j.skills;
  document.getElementById("jfdesc").value = j.description || "";
  document.getElementById("jfw").style.display = "block";
  document
    .getElementById("jfw")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}
async function submitJob() {
  const req = [
    ["jfc", "jec"],
    ["jfr", "jer"],
    ["jfs", "jes"],
    ["jfl", "jel"],
    ["jfd", "jed"],
  ];
  let ok = true;
  req.forEach(([fi, ei]) => {
    const e = document.getElementById(fi),
      err = document.getElementById(ei);
    if (!e.value.trim()) {
      e.classList.add("err");
      if (err) err.style.display = "block";
      ok = false;
    } else {
      e.classList.remove("err");
      if (err) err.style.display = "none";
    }
  });
  if (!ok) return;
  const job = {
    id: editJobId || `JOB${Date.now()}`,
    company: document.getElementById("jfc").value.trim(),
    role: document.getElementById("jfr").value.trim(),
    salary: document.getElementById("jfs").value.trim(),
    location: document.getElementById("jfl").value.trim(),
    eligibility: document.getElementById("jfe").value.trim(),
    deadline: document.getElementById("jfd").value,
    type: document.getElementById("jftype").value,
    skills: document
      .getElementById("jfsk")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    description: document.getElementById("jfdesc").value.trim(),
  };
  try {
    if (editJobId) {
      await fetch(`${API}/jobs/${editJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      toast("Job updated ✓", "suc");
    } else {
      await fetch(`${API}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      toast("Job posted ✓", "suc");
    }
    await loadData();
    closeJF();
    initJobs();
  } catch (e) {
    toast("Failed to save job", "err");
  }
}
async function delJ(id) {
  if (!confirm("Delete this job posting?")) return;
  try {
    await fetch(`${API}/jobs/${id}`, { method: "DELETE" });
    toast("Job deleted", "err");
    await loadData();
    initJobs();
  } catch (e) {
    toast("Failed to delete", "err");
  }
}
