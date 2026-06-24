const express = require("express");
const router = express.Router();
const userMiddleware = require('../MIDDLEWARES/userMiddleware');
const Submission = require('../MODELS/submission_schema');
const Problem = require('../MODELS/problem_schema');
const {getLanguageID,submitBatch,tokensToString,submitTokens} = require('../UTILS/problemRouterUtils');



router.post('/submit', userMiddleware, async(req,res)=>{
    try{
        req.body.userId = req.result._id;
        const problemId = req.body.problemId;

        const problem = await Problem.findById(problemId);
        req.body.testCasesTotal = problem.hiddenTestCases.length;

        const submittedResult = await Submission.create(req.body); //have to update this later

        const submissionArray = problem.hiddenTestCases.map((testcase)=>{
            return {
                language_id: getLanguageID(req.body.language),
                source_code: req.body.code,
                stdin: testcase.input,
                expected_output: testcase.output
            }
        })

        const data = await submitBatch(submissionArray);
        const tokenString = tokensToString(data);
        const finalData = await submitTokens(tokenString);

        let runtime = 0;
        let memory = 0;
        let testCasesPassed = 0;

        for(let result of finalData){
            runtime+=Number(result.time);
            memory = Math.max(memory,result.memory);

            if(result.status_id==3){
                testCasesPassed++;
            }
        }

        if(testCasesPassed===req.body.testCasesTotal){
            submittedResult.status = "accepted";

            const user = req.result;

            if(!user.problemSolved.includes(problemId)){
                user.problemSolved.push(problemId);
                await user.save();
            }

        }else{
            submittedResult.status = "wrong";
        }
        

        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.testCasesPassed = testCasesPassed;

        await submittedResult.save();


        const reply = {
            accepted: (submittedResult.status==="accepted"),
            totalTestCases: req.body.testCasesTotal,
            testCasesPassed,
            runtime,
            memory
        }

        res.send(reply);

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

router.post('/run', userMiddleware, async(req,res)=>{
    try{
        const problemId = req.body.problemId;
        const problem = await Problem.findById(problemId);

        const submissionArray = problem.visibleTestCases.map((testcase)=>{
                return {
                    language_id: getLanguageID(req.body.language),
                    source_code: req.body.code,
                    stdin: testcase.input,
                    expected_output: testcase.output
                }
        })

        const data = await submitBatch(submissionArray);
        const tokenString = tokensToString(data);
        const testResult = await submitTokens(tokenString);


    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;


    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
          }
          else{
            status = false
          }
        }
    }

    res.json({
        success:status,
        testCases: testResult,
        runtime,
        memory
    })
    
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = router;
















// try{

// }catch(err){
//     res.status(400).send("Error: "+err.message);
// }