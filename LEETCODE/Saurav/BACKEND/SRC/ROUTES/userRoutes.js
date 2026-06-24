const express = require("express");
const router = express.Router();
const User = require('../MODELS/user_schema');
const Submission = require('../MODELS/submission_schema');
const jwt = require("jsonwebtoken");
const adminMiddleware = require('../MIDDLEWARES/adminMiddleware');
const userMiddleware = require('../MIDDLEWARES/userMiddleware');


router.get('/checkAuth',userMiddleware,async(req,res)=>{
    try{
        const {firstName,emailId,_id,role} = req.result;

        const user = {
            firstName,
            emailId,
            _id,
            role
        }

        const reply = {
            data:user,
            message:"authenticated user"
        }
        res.json(reply);

    }catch(err){
        res.status(400).json({message:err.message});
    }
})

router.post("/register", async(req,res) => {
    try{
        req.body.role = "user";
        const {firstName,emailId,_id} = await User.create(req.body);

        const user = {
            firstName,
            emailId,
            _id
        }

        const token = jwt.sign({ emailId: emailId }, "secretkey");
        res.cookie("token",token);


        const reply = {
            data: user,
            message:"user registered successfully"
        }

        res.status(201).json(reply);

    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post("/login", async(req, res) => {
    try{

        const {emailId,password} = req.body;
        const user = await User.findOne({ emailId: emailId });

        if(!user) 
        throw new Error("User not registered");
    
        if(user.password!=password) 
        throw new Error("Incorrect Password");

        const token = jwt.sign({ emailId: emailId }, "secretkey");
        res.cookie("token",token);

        const {firstName,_id} = user;

        const userX = {
            firstName,
            emailId,
            _id
        }

        const reply = {
            data: userX,
            message: "Login Successfull"
        }

        res.json(reply);

    }catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});

router.post('/logout', userMiddleware, (req,res)=>{
    try{
        res.clearCookie("token");
        res.send("logout successfull");
    }catch(err){
        res.status(400).send(err.message);
    }
})

router.post('/admin/register',adminMiddleware, async(req,res)=>{
    try{

        req.body.role = "admin";
        await User.create(req.body);
        res.send("Admin registered");

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }    

})

router.delete('/delete', userMiddleware, async(req,res)=>{
    try{
        const userId = req.result.id;

        await User.deleteOne({_id:userId});
        await Submission.deleteMany({userId:userId});

        res.send("User deleted successfully");

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = router;






























// try{

// }catch(err){
//     res.status(400).send("Error: "+err.message);
// }