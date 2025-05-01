import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
}, { versionKey: false })

export const userModel = mongoose.model("users", userSchema)