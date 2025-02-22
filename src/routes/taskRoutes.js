const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    createTask, getTasks, getTask, updateTask, deleteTask,
    createSubtask, updateSubtask, updateTaskStatus, updateSubtaskStatus
} = require("../controllers/taskController");

const router = express.Router();

// Task Routes (Protected)v
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:task_id", protect, getTask);
router.put("/:task_id", protect, updateTask);
router.delete("/:task_id", protect, deleteTask);
router.patch("/:task_id/status", protect, updateTaskStatus);

// Subtask Routes (Protected)
router.post("/:task_id/subtasks", protect, createSubtask);
router.put("/:task_id/subtasks/:subtask_id", protect, updateSubtask);
router.patch("/:task_id/subtasks/:subtask_id/status", protect, updateSubtaskStatus);

module.exports = router;
