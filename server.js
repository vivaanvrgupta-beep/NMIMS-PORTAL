const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// DATABASE CONNECTION — change these to your MySQL credentials
// ============================================================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unify@2486", // <-- change this
  database: "nmims_placement",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database: nmims_placement");
});

// ============================================================
// STUDENTS APIs
// ============================================================

// GET all students
app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // convert skills string to array
    const data = results.map((s) => ({
      ...s,
      skills: s.skills ? s.skills.split(",").map((x) => x.trim()) : [],
    }));
    res.json(data);
  });
});

// GET single student
app.get("/api/students/:id", (req, res) => {
  db.query(
    "SELECT * FROM students WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Student not found" });
      const s = results[0];
      s.skills = s.skills ? s.skills.split(",").map((x) => x.trim()) : [];
      res.json(s);
    }
  );
});

// POST add new student
app.post("/api/students", (req, res) => {
  const { name, sapId, email, course, year, skills, cgpa, status, company } =
    req.body;
  const skillsStr = Array.isArray(skills) ? skills.join(",") : skills;
  db.query(
    "INSERT INTO students (name, sapId, email, course, year, skills, cgpa, status, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      sapId,
      email,
      course,
      year,
      skillsStr,
      cgpa,
      status,
      company || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// PUT update student
app.put("/api/students/:id", (req, res) => {
  const { name, sapId, email, course, year, skills, cgpa, status, company } =
    req.body;
  const skillsStr = Array.isArray(skills) ? skills.join(",") : skills;
  db.query(
    "UPDATE students SET name=?, sapId=?, email=?, course=?, year=?, skills=?, cgpa=?, status=?, company=? WHERE id=?",
    [
      name,
      sapId,
      email,
      course,
      year,
      skillsStr,
      cgpa,
      status,
      company || null,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ============================================================
// JOBS APIs
// ============================================================

// GET all jobs
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY id ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const data = results.map((j) => ({
      ...j,
      skills: j.skills ? j.skills.split(",").map((x) => x.trim()) : [],
      deadline: j.deadline
        ? new Date(j.deadline).toISOString().split("T")[0]
        : "",
    }));
    res.json(data);
  });
});

// POST add new job
app.post("/api/jobs", (req, res) => {
  const {
    id,
    company,
    role,
    salary,
    location,
    deadline,
    type,
    skills,
    description,
    eligibility,
  } = req.body;
  const skillsStr = Array.isArray(skills) ? skills.join(",") : skills;
  db.query(
    "INSERT INTO jobs (id, company, role, salary, location, deadline, type, skills, description, eligibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      company,
      role,
      salary,
      location,
      deadline,
      type,
      skillsStr,
      description,
      eligibility,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// PUT update job
app.put("/api/jobs/:id", (req, res) => {
  const {
    company,
    role,
    salary,
    location,
    deadline,
    type,
    skills,
    description,
    eligibility,
  } = req.body;
  const skillsStr = Array.isArray(skills) ? skills.join(",") : skills;
  db.query(
    "UPDATE jobs SET company=?, role=?, salary=?, location=?, deadline=?, type=?, skills=?, description=?, eligibility=? WHERE id=?",
    [
      company,
      role,
      salary,
      location,
      deadline,
      type,
      skillsStr,
      description,
      eligibility,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE job
app.delete("/api/jobs/:id", (req, res) => {
  db.query("DELETE FROM jobs WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ============================================================
// APPLICATIONS APIs
// ============================================================

// GET all applications
app.get("/api/applications", (req, res) => {
  db.query(
    "SELECT * FROM applications ORDER BY date DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      const data = results.map((a) => ({
        ...a,
        date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
      }));
      res.json(data);
    }
  );
});

// POST add new application
app.post("/api/applications", (req, res) => {
  const { student, sapId, jobRole, company, date, status } = req.body;
  db.query(
    "INSERT INTO applications (student, sapId, jobRole, company, date, status) VALUES (?, ?, ?, ?, ?, ?)",
    [student, sapId, jobRole, company, date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// PUT update application status
app.put("/api/applications/:id", (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE applications SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE application
app.delete("/api/applications/:id", (req, res) => {
  db.query(
    "DELETE FROM applications WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ============================================================
// START SERVER
// ============================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving portal from /public folder`);
});
