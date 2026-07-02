require('dotenv').config(); // ADD THIS as the very first line

const express = require('express');
const cors = require('cors');


const app = express();
const PORT = 5000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Middleware: allow requests from the React frontend (port 5173)
app.use(cors());

// Import and mount the resume route
const resumeRouter = require('./routes/resume');
app.use('/api', resumeRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});