import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.post("/", auth, admin, async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

router.get("/", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // 👨‍💼 Admin → all tasks
      tasks = await Task.find().populate("assignedTo", "name");
    } else {
     
      tasks = await Task.find({ assignedTo: req.user.id })
                        .populate("assignedTo", "name");
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json("Error fetching tasks");
  }
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

export default router;