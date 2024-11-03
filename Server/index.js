const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./router/authRoutes');
require('dotenv').config(); 

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as necessary
  credentials: true
}));
// Session middleware
app.use(session({
    secret: JWT_SECRET, // Your session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


// Use auth routes after session middleware
app.use('/api', authRoutes);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Users') 
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('Failed to Connect to DB', err));


// Global error handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

// Start the server
const PORT = 8000; // You can change the port if needed
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
