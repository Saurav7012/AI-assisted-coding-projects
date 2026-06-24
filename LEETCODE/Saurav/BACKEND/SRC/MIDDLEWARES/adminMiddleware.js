const User = require('../MODELS/user_schema');
const jwt = require("jsonwebtoken");

const adminMiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, "secretkey");
        
        const {emailId} = decoded;
        const user = await User.findOne({ emailId: emailId });

        if(user.role!="admin")
        throw new Error("You are not admin!!!");

        req.result = user;
        next();

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }    
}

module.exports = adminMiddleware;
