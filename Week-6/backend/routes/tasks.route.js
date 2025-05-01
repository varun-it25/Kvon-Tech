import express from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/tasks.controller.js";

const taskRouter = express.Router();

taskRouter.get("/", getTasks)
taskRouter.get("/:id", getTask)
taskRouter.post("/create", createTask)
taskRouter.put("/:taskId", updateTask)
taskRouter.delete("/:taskId", deleteTask)

export default taskRouter;