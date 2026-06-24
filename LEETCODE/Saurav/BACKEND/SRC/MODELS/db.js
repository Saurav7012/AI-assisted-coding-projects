const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://saurav_7012:iamrazor%407012@devcluster.nyngu3j.mongodb.net/Leetcode");
        console.log("Database Connected");
    } catch (error) {
        console.log("DB Connection Error:", error);
    }
};

module.exports = connectDB;
