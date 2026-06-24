const express = require("express");
const router = express.Router();
const Order = require('../models/orderSchema');


router.post('/add',async(req,res)=>{
    try{
        const order = await Order.create(req.body);
        res.status(201).send(order);
    }catch(err){
        res.status(400).send("Error: ", err.message);
    }
})

module.exports = router;
