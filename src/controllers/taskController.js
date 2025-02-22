const Task = require("../models/taskModel");

// 📌 Create a Task
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        const task = new Task({ title, description, dueDate, priority, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.log("error creating task", error);
        res.status(500).json({ error: "Error creating task" });
    }
};

// 📌 Get All Tasks
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;  // Get the query parameter
        const filter = { userId: req.user.id };  // Fetch tasks only for the logged-in user

        // Apply filtering if 'status' is provided
        if (status === "completed") {
            filter.completed = true;
        } else if (status === "pending") {
            filter.completed = false;
        }

        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving tasks" });
    }
};


// 📌 Get a Single Task by ID
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
};

// 📌 Update a Task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.task_id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
};

// 📌 Delete a Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
};

// 📌 Create a Subtask
const createSubtask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = await Task.findById(req.params.task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.subtasks.push({ title });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Error creating subtask" });
    }
};

// 📌 Update a Subtask
const updateSubtask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const subtask = task.subtasks.id(req.params.subtask_id);
        if (!subtask) return res.status(404).json({ error: "Subtask not found" });

        subtask.title = req.body.title || subtask.title;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating subtask" });
    }
};

// 📌 Update Task Status
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.completed = req.body.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating task status" });
    }
};

// 📌 Update Subtask Status
const updateSubtaskStatus = async (req, res) => {
    try {
        const { task_id, subtask_id } = req.params; // Use subtask_id from URL
        const { completed } = req.body; // Expect completed as boolean

        // Find the task
        const task = await Task.findById(task_id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        // Find the subtask by ID
        const subtask = task.subtasks.id(subtask_id);
        if (!subtask) {
            return res.status(404).json({ error: "Subtask not found" });
        }

        // Update subtask completed status
        subtask.completed = completed;

        // Recalculate task progress
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
        task.progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        // If all subtasks are completed, mark the task as completed
        task.completed = completedSubtasks === totalSubtasks;

        await task.save();

        res.json({ message: "Subtask status updated", task });
    } catch (error) {
        console.error("🔥 Error updating subtask:", error);
        res.status(500).json({ error: "Error updating subtask status" });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    updateTaskStatus,
    updateSubtaskStatus
};
