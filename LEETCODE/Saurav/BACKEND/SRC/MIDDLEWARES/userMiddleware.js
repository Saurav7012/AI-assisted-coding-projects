const User = require('../MODELS/user_schema');
const jwt = require("jsonwebtoken");

const userMiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            throw new Error("token not present - you are not logged in");
        }

        const decoded = jwt.verify(token, "secretkey");
        
        const {emailId} = decoded;
        const user = await User.findOne({ emailId: emailId });

        req.result = user;
        next();

    }catch(err){
        res.status(400).json({message:err.message});
    }    
}

module.exports = userMiddleware;
