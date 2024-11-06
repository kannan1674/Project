const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true, // Ensure ID is unique in the collection
    },
    Name: {
        type: String,
        required: true,
        trim: true // Trim whitespace
    },
    MobileNumber: {
        type: Number,
        required: true,
        unique: true // Ensure phone numbers are unique if necessary
    },
    Email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] // Basic email format validation
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dob: {
        type: Date
    },
    Address: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    Team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    }]
});

// Pre-save hook to auto-generate a unique numeric ID
productSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await Product.countDocuments();
        this.id = count + 1;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
