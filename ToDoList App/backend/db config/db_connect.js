const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://saurav_7012:iamrazor%407012@devcluster.nyngu3j.mongodb.net/ToDoList';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // exit process if DB connection fails
    }
};

module.exports = connectDB;
