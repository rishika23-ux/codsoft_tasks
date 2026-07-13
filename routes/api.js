const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");

// GET all data (projects + tasks) in one call - keeps the frontend simple
router.get("/data", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.json({ projects, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Projects ----
router.post("/projects", async (req, res) => {
  try {
    const { name, description, deadline, color } = req.body;
    if (!name || !deadline) return res.status(400).json({ error: "name and deadline are required" });
    const project = await Project.create({ name, description, deadline, color });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Tasks ----
router.post("/tasks", async (req, res) => {
  try {
    const { projectId, title, assignee, deadline, status, progress } = req.body;
    if (!projectId || !title || !assignee || !deadline) {
      return res.status(400).json({ error: "projectId, title, assignee and deadline are required" });
    }
    const task = await Task.create({
      projectId, title, assignee, deadline,
      status: status || "To Do",
      progress: status === "Done" ? 100 : (progress || 0)
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const update = {};
    if (req.body.status !== undefined) {
      update.status = req.body.status;
      if (req.body.status === "Done") update.progress = 100;
    }
    if (req.body.progress !== undefined) update.progress = req.body.progress;
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
