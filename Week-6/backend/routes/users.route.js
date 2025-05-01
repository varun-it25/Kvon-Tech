import express from "express";
import { getUsers, loginUser, registerUser } from "../controllers/users.controller.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/', getUsers)

export default userRouter