const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./router/authRoutes');
const path = require('path'); 
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const app = express();


app.use(express.json());


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(session({
    secret: jwtSecret, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.use('/api', authRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Users') 
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('Failed to Connect to DB', err));


const buildPath = path.join(__dirname, 'client', 'build'); 
app.use(express.static(buildPath));


app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


const PORT = 8000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
