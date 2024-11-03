const mongoose = require('mongoose');

const otpStoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '5m' // Automatically delete after 5 minutes
    }
});

// Check if the model already exists
const OtpStore = mongoose.models.OtpStore || mongoose.model('OtpStore', otpStoreSchema);

module.exports = OtpStore;
