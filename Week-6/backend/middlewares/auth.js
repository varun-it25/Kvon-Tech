export const auth = async (req, res, next) => {
    const token = req.headers.token;

    if(!token){
        return res.status(401).send("Unauthorized user...");
    } else{
        next();
    }
}