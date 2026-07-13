const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true, trim: true },
  assignee: { type: String, required: true, trim: true },
  deadline: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
