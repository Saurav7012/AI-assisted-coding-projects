const express = require("express");
const router = express.Router();
const User = require('../MODELS/user_schema');
const jwt = require("jsonwebtoken");
const adminMiddleware = require('../MIDDLEWARES/adminMiddleware');
const userMiddleware = require('../MIDDLEWARES/userMiddleware');
const Problem = require('../MODELS/problem_schema');

const {getLanguageID,submitBatch,tokensToString,submitTokens} = require('../UTILS/problemRouterUtils');
const Submission = require("../MODELS/submission_schema");


router.post("/create", adminMiddleware , async(req,res) => {

    try{
        const {visibleTestCases, referenceSolution} = req.body;

        for(const codeDetails of referenceSolution){

            const language_id = getLanguageID(codeDetails.language);
            const source_code = codeDetails.completeCode;

            const submissionArray = visibleTestCases.map((testcase)=>{
                return {
                    language_id: language_id,
                    source_code: source_code,
                    stdin: testcase.input,
                    expected_output: testcase.output
                }
            })

            const data = await submitBatch(submissionArray);
            const tokenString = tokensToString(data);
            const finalData = await submitTokens(tokenString);

            for(const result of finalData){
                if(result.status_id!=3)
                throw new Error("Runtime Error Occured")
            }
        }

        await Problem.create({...req.body, problemCreator: req.result._id});
        res.status(201).send("Problem Created Successfully");


    }catch(err){
        res.status(400).send("Error: "+err.message);
    }

});

router.get("/getAllproblems", userMiddleware, async(req,res)=>{
    try{
        const problems = await Problem.find().select("title difficulty tags");
        res.send(problems);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

router.get("/solvedAllproblemsByUser", userMiddleware, async(req,res)=>{
    try{
        const userId = req.result._id;
        const user = await User.findById(userId).populate("problemSolved","_id title description difficulty tags");
        res.json(user.problemSolved);
    }catch(err){
        res.status(400).send({message:err.message});
    }
    
})

router.get("/:id", userMiddleware, async(req,res)=>{
    try{
        const problem = await Problem.findById(req.params.id).select("title description difficulty tags visibleTestCases startCode referenceSolution");
        res.send(problem);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

router.get('/submittedCodes/:pid', userMiddleware, async(req,res)=>{
    try{

        const problemId = req.params.pid;
        const userId = req.result._id;
        const submittedCodes = await Submission.find({userId,problemId});

        if(!submittedCodes.length){
            return res.send("No Submissions are done!!!");
        }
        
        res.send(submittedCodes);

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})


module.exports = router;





















// try{

// }catch(err){
//     res.status(400).send("Error: "+err.message);
// }