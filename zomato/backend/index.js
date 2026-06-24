const express = require('express');
const app = express();
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require("./config/db");
const cors = require('cors');


app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());


app.use('/restaurant',restaurantRoutes);
app.use('/order',orderRoutes);


connectDB()
.then(()=>{
    app.listen(3000,()=>{
        console.log("listening to port 3000");
    })
})