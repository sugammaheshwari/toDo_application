const mongoose = require("mongoose");

const SubtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        dueDate: Date,
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
        completed: { type: Boolean, default: false },
        subtasks: [SubtaskSchema], // Embedded subtasks
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        progress: { type: Number, default: 0 }, // New progress field
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);

