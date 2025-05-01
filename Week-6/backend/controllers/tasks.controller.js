import { taskModel } from "../models/taskModel.js"
import jwt from "jsonwebtoken"

export const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;

    try{
        await taskModel.findOneAndDelete({ _id : taskId });
        res.status(204).send("Task deleted successfully...");
    } catch(err){
        res.status(500).send("Internal server error...");
    }
}

export const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const updatedAt = Date.now();
    const { title, description, isCompleted, priority, tags, userId } = req.body;

    try{
        await taskModel.findOneAndUpdate({ _id : taskId }, { userId, title, description, isCompleted, priority, tags, updatedAt });
        res.status(201).send("Task updated successfully...")
    } catch(err){
        res.status(500).send("Internal server error...")
    }
}

export const createTask = async (req, res) => {
    const token = req.headers.token;

    const createdAt = Date.now();
    const updatedAt = Date.now();
    const isCompleted = false;
    const { title, description, priority, tags } = req.body;

    try{
        const user = jwt.decode(token, "varunKey")
        const task = new taskModel({ userId: user.id, title, description, isCompleted, priority, tags, createdAt, updatedAt });
        await task.save();
        res.status(201).send("Task added successfully...")
    } catch(err){
        res.status(500).send("Internal server error...")
    }
}

export const getTask = async (req, res) => {
    const id = req.params.id;

    try{
        const task = await taskModel.findOne({_id: id});
        res.status(200).json(task)
    } catch(err){
        res.status(500).send("Internal server error...")
    }

}

export const getTasks = async (req, res) => {
    const token = req.headers.token;

    const user = jwt.decode(token, "varunKey")

    try{
        if(user.role === 'admin'){
            const tasks = await taskModel.find({});
            res.status(200).json(tasks)
        } else{
            const tasks = await taskModel.find({userId: user.id});
            res.status(200).json(tasks)
        }
    } catch(err){
        res.status(500).send("Internal server error...")
    }

}