const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect("mongodb+srv://saurav_7012:iamrazor%407012@devcluster.nyngu3j.mongodb.net/Zomato");
        console.log("Database connected✅");
    }catch(err){
        console.log("Database not connected❌");
        process.exit(1);
    }
}

module.exports = connectDB;