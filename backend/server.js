import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); 

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.log(err));