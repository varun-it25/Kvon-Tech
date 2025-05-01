import { userModel } from "../models/userModel.js"

export const registerUser = async(req, res) => {
    const { name, email, password, role } = req.body;
    
    try{
        const userExist = await userModel.findOne({ email })

        if(userExist){
            res.status(400).send("User already exists...")
        }

        const user = new userModel({ name, email, password, role });
        await user.save();

        const token = jwt.sign({ name, email, password, role }, "varunKey")        
        res.status(201).send(token)
    } catch(err){
        res.status(500).send('Internal Server Error...');
    }
}

export const loginUser = async(req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await userModel.findOne({ email, password })

        if(user){
            const token = jwt.sign({ id: `${user._id}`, name: user.name, email: user.email, role: user.role }, "varunKey")
            res.status(200).json({token, name: user.name})
        } else{
            res.status(404).send("User not found...")
        }
    } catch(err){
        res.status(500).send('Internal Server Error...');
    }
}

export const getUsers = async(req, res) => {
    try{
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch(err){
        res.status(500).send('Internal Server Error...');
    }
}