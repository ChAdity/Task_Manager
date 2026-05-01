import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.post("/", auth, admin, async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});

router.get("/", auth, async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
});

export default router;