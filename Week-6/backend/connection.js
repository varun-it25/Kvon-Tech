import mongoose from "mongoose";

export async function connection(){
    try{
        mongoose.connect("mongodb://localhost:27017/task-manager").then(() => console.log("MongoDB Connected Successfully...")).catch(err => console.log(err))
    } catch(err){
        console.log(err)
    }
}