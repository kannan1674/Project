const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config(); 

const jwtSecret = process.env.JWT_SECRET;
const authUser = process.env.AUTH_USER;
const authPass = process.env.AUTH_PASS;


const User = require('../model/usermodel');
const createError = require('../utils/appError');
const OtpStore = require('../model/otpStore'); // Assuming you have this model

const otpCache = {}; // Store OTPs

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP
};

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
           user:authUser,
           pass:authPass
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Reset Password OTP',
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

// Test the function



// Function to generate and cache OTP
const generateAndCacheOtp = (userId, email) => {
    const otp = generateOtp();
    if (!otpCache[userId]) {
        otpCache[userId] = {};
    }
    otpCache[userId][otp] = true;

    setTimeout(() => {
        delete otpCache[userId][otp];
        if (Object.keys(otpCache[userId]).length === 0) {
            delete otpCache[userId];
        }
    }, 300000); // 5 minutes

    return otp;
};

// Get all users
exports.users = async (req, res) => {
    try {
        const users = await User.find({}, { _id: 1, name: 1 }); // Adjust fields as needed
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// SIGNUP
exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ status: 'fail', message: 'User Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({ ...req.body, password: hashedPassword });

        const token = jwt.sign({ _id: newUser._id }, process.env.J, { expiresIn: '90d' });

        res.status(201).json({ status: "success", message: "User Created Successfully", token });
    } catch (error) {
        next(error);
    }
};

// LOGIN
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '90d' });

        res.status(200).json({ status: "success", message: "User Login Successfully", token });
    } catch (error) {
        next(error);
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateAndCacheOtp(user._id, email);
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).send({ message: "OTP is required" });
    }

    const userId = Object.keys(otpCache).find(userId => otpCache[userId][otp]);

    if (!userId) {
        return res.status(400).send({ message: "No OTP found for this email or OTP has expired" });
    }

    if (otpCache[userId][otp]) {
        delete otpCache[userId][otp];

        if (Object.keys(otpCache[userId]).length === 0) {
            delete otpCache[userId];
        }

        return res.status(200).send({ message: "OTP verified successfully" });
    } else {
        return res.status(400).send({ message: "Invalid or expired OTP" });
    }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// GET USER BY EMAIL
exports.getUsers = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ id: user._id }); // Or any other user info needed
    } catch (error) {
        console.error('Error retrieving user:', error.message || error);
        res.status(500).json({ message: 'Server error' });
    }
};
