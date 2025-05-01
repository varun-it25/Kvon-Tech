import express from "express";
import cors from "cors";
import userRouter from "./routes/users.route.js";
import taskRouter from "./routes/tasks.route.js";
import { connection } from "./connection.js";
import { auth } from "./middlewares/auth.js";

const app = express();
const PORT = 5000;

connection();

app.use(express.json());
app.use(cors());

app.use("/tasks", auth);

app.use("/users", userRouter)
app.use("/tasks", taskRouter)

app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
})