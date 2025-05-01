import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    isCompleted: Boolean,
    priority: String,
    tags: [String],
    createdAt: Date,
    updatedAt: Date
}, { versionKey: false })

export const taskModel = mongoose.model("tasks", taskSchema)