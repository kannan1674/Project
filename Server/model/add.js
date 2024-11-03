const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
      
    },
    Name: {
        type: String,
        required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true,
        
    },
    Gender:{
        type:String,
        enum:['Male','Female','Other']
    },
    dob:{
        type:Date
    },
    Address:{
        type:String
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

// Pre-save hook to auto-generate a unique numeric ID
productSchema.pre('save', async function (next) {
    if (this.isNew) { // Only assign a new ID for new documents
        const count = await Product.countDocuments(); // Get the count of existing documents
        this.id = count + 1; // Increment ID based on count
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
