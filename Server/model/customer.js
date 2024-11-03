const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    CustomerName:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,

    },
    TotalOrders:{
        type:Number,
        required:true
    },
    PendingOrders:{
        type:Number,
        required:true
    },
    TotalAmount:{
        type:Number,
        require:true
    },
    Address:{
        type:String,
        required:true
    },

})

const Customer=mongoose.model('customer',customerSchema)

module.exports = Customer;