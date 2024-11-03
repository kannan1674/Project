const Customer = require('../model/customer');

exports.createCustomer = async (req, res, next) => {
  try {
    const { CustomerName, Email, TotalOrders, PendingOrders, TotalAmount, Address } = req.body;

    // Check for missing fields
    if (!CustomerName || !Email || !TotalOrders || !PendingOrders || !TotalAmount || !Address) {
      return res.status(400).json({ message: "Please Provide All Required Details" });
    }

    // Check if a customer with the same email already exists
    const existingCustomer = await Customer.findOne({ Email });
    if (existingCustomer) {
      return res.status(409).json({ message: "Customer with this email already exists" });
    }

    // Create and save new customer
    const customer = new Customer({ CustomerName, Email, TotalOrders, PendingOrders, TotalAmount, Address });
    await customer.save();

    return res.status(201).json({
      message: "Customer Created Successfully",
      customer: {
        CustomerName: customer.CustomerName,
        Email: customer.Email,
        Address: customer.Address,
        PendingOrders: customer.PendingOrders,
        TotalOrders: customer.TotalOrders,
        TotalAmount: customer.TotalAmount
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getCustomer = async (req,res,next)=>{
    try {
        const customers = await Customer.find();
        return res.status(200).json(customers)
    } catch (error) {
        next(error)
        
    }
}

exports.updateCustomer = async (req, res, next) => {
  try {
    const { CustomerName, Email, TotalOrders, PendingOrders, TotalAmount, Address } = req.body;
    const id = req.params.id;

    const updateCustomer = await Customer.findByIdAndUpdate(
      id,
      { CustomerName, Email, TotalOrders, PendingOrders, TotalAmount, Address },
      { new: true, runValidators: true }
    );

    if (!updateCustomer) {
      return res.status(404).json({ message: "Customer Not Found" });
    }

    // Respond with the updated customer
    return res.status(200).json({
      status: "success",
      message: "Customer updated successfully",
      Customer: {
        CustomerName: updateCustomer.CustomerName,
        Email: updateCustomer.Email,
        TotalOrders: updateCustomer.TotalOrders,
        PendingOrders: updateCustomer.PendingOrders,
        TotalAmount: updateCustomer.TotalAmount,
        Address: updateCustomer.Address,
      },
    });
  } catch (error) {
    // Handle errors appropriately
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the customer",
      error: error.message,
    });
  }
};


exports.deleteCustomer = async(req,res,next)=>{
  try {
      const id = req.params.id;

      await Customer.findByIdAndDelete(id)

      res.status(200).json({message:"Customer Deleted Successfully"})
  } catch (error) {
      next(error)
      
  }
}
