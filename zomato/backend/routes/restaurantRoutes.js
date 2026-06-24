const express = require("express");
const router = express.Router();
const Restaurant = require('../models/restaurantScema');


router.post('/create',async(req,res)=>{
    try{
        await Restaurant.create(req.body);
        res.status(201).send("Restaurant Added Successfully✅");
    }catch(err){
        res.status(400).send("Error: ",err.message);
    }
})

router.get('/',async(req,res)=>{
    try{
    const restaurants = await Restaurant.find().select("-foodItems -__v");
    res.send(restaurants);
    }catch(err){
        res.status(400).send("Error: ",err.message);
    }
})

router.get('/:restaurantId',async(req,res)=>{
    try{
        const {restaurantId} = req.params;
        const restaurant = await Restaurant.findById(restaurantId);
        res.send(restaurant);
    }catch(err){
        res.status(400).send("Error: ",err.message);
    }
})

module.exports = router;
