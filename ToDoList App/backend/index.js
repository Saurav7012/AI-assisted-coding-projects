const express = require("express");
const app = express();
const connectDB = require('./db config/db_connect');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');


app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());



app.use('/task',taskRoutes)









connectDB()
.then(()=>{
    app.listen(4000, ()=>{
    console.log("listening to port 4000");
    })
})


