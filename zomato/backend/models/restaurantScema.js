const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: String
    },
    rating: {
        type: String
    },
    numberOfRaters: {
        type: Number
    },
    foodItems: [
        {
            food_name: String,
            food_category: String,
            food_price: Number,
            food_rating: Number
        }
    ]
})

const Restaurant = mongoose.model('restaurant',restaurantSchema);

module.exports = Restaurant;