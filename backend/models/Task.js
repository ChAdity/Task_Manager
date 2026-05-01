import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
});

export default mongoose.model("Task", taskSchema);