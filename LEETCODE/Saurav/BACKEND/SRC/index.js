const express = require("express");
const app = express();
const connectDB = require('./MODELS/db');
const User = require('./MODELS/user_schema');
const userRoutes = require('./ROUTES/userRoutes');
const problemRoutes = require('./ROUTES/problemRoutes');
const submitRoutes = require('./ROUTES/submitRoutes');
const cookieParser = require("cookie-parser");
const cors = require("cors");


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());


app.use('/user',userRoutes);
app.use('/problem',problemRoutes);
app.use('/submission',submitRoutes);


connectDB()
.then(()=>{
    app.listen(3000, () => {
    console.log("Server running on port 3000");
});
})
