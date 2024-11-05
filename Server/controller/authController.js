const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const authUser = process.env.AUTH_USER;
const authPass = process.env.AUTH_PASS;

const User = require('../model/usermodel');
const OtpStore = require('../model/otpStore'); 

//  nodemailer for Gmail
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: { user: authUser, pass: authPass },
});

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

//  send OTP email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: authUser,
        to: email,
        subject: 'Reset Password OTP',
        text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};


const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Signup function
exports.signup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ message: 'User Already Exists' });

        const hashedPassword = await hashPassword(req.body.password);
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        const token = jwt.sign({ _id: newUser._id }, jwtSecret, { expiresIn: '90d' });

        res.status(201).json({ message: "User Created Successfully", token });
    } catch (error) {
        console.error("Error during signup:", error.message || error);
        next(error);
    }
};

// Login function
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Found" });

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid Email or Password" });

        const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '90d' });
        res.status(200).json({ message: "User Login Successfully", token });
    } catch (error) {
        next(error);
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOtp();
        await OtpStore.create({ userId: user._id, otp, expiresAt: Date.now() + 5 * 60 * 1000 }); 
        await sendOtpEmail(email, otp);
        
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;
    try {
        const otpRecord = await OtpStore.findOne({ otp, expiresAt: { $gt: Date.now() } });
        if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

        await OtpStore.deleteOne({ otp }); 
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await hashPassword(newPassword);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users
exports.users = async (req, res) => {
    try {
        const users = await User.find({}, { _id: 1, name: 1 }); // Adjust fields as needed
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

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

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).send({ message: "Please Provide All Details" });
        }

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(400).send({ message: "User Not Found" });
        }

        const isMatchPassword = await comparePassword(currentPassword, checkUser.password);
        if (!isMatchPassword) {
            return res.status(400).send({ message: "Current Password is Incorrect" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).send({ message: "New password must be different from the current password" });
        }

        const newHashPassword = await hashPassword(newPassword);
        await User.updateOne({ email }, { password: newHashPassword });

        return res.status(200).send({ message: "Password Changed Successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send({ message: "Something Went Wrong" });
    }
};
