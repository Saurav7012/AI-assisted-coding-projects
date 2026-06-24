const express = require('express');
const router = express.Router();
const List = require('../models/toDo_schema');


router.get('/getAlltasks',async(req,res)=>{  
    try{
        const tasks = await List.find();
        res.send(tasks);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

router.post('/add',async(req,res)=>{     
    try{
        const tasks = await List.create(req.body);
        res.status(201).send(tasks);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

router.delete('/:taskId',async(req,res)=>{
    try{
        const tasks = await List.findByIdAndDelete(req.params.taskId);
        res.send(tasks);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }

})

router.patch('/:taskId',async(req,res)=>{
    try{
        const task = await List.findByIdAndUpdate(req.params.taskId,req.body,{ new: true });
        res.send(task);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})



module.exports = router;



// try{

// }catch(err){
//     res.status(400).send("Error: "+err.message);
// }