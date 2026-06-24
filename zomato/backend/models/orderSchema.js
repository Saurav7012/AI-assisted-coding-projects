const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderedItems:[
        {
            food_name: String,
            food_category: String,
            food_price: Number
        }
    ]
},{
    versionKey: false
})

const Order = mongoose.model('order',orderSchema);

module.exports = Order;