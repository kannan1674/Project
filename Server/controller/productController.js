const Product = require('../model/add'); 


exports.addProduct = async (req, res, next) => {
    try {
        const { Name, MobileNumber, Email, Gender, dob, Address, status = 'active', Team } = req.body;

        if (!Name || !MobileNumber || !Email || !Gender) {
            return res.status(400).json({ message: "Please Provide Details" });
        }

        const product = new Product({ Name, MobileNumber, Email, Gender, dob, Address, status, Team });
        await product.save();

        return res.status(201).json({ 
            message: "Employee Added",
            product: {
                Name: product.Name,
                MobileNumber: product.MobileNumber,
                Email: product.Email,
                Gender: product.Gender,
                dob: product.dob,
                address: product.Address,
                status: product.status,
                Team: product.Team
            }
        });
    } catch (error) {
        next(error);
    }
};



exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json(products); // Return the list of products
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
};

exports.updateProducts = async (req, res, next) => {
    try {
        const { Name, MobileNumber,Email,Gender,dob,Address,Team   } = req.body;
        const id = req.params.id;

        // Use findByIdAndUpdate to update the product
        const updateProduct = await Product.findByIdAndUpdate(
            id,
             { Name, MobileNumber,Email,Gender,dob,Address,Team  },
            { new: true, runValidators: true } // runValidators ensures schema validation
        );

        // Check if the product was found and updated
        if (!updateProduct) {
            return res.status(404).json({ message: "Employee Not Found" });
        }

        // Respond with the updated product
        return res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            Product: {
                id: updateProduct._id,
                Name: updateProduct.Name,
                MobileNumber: updateProduct.MobileNumber,
                Email:updateProduct.Email,
                Gender:updateProduct.Gender,
                dob:updateProduct.dob,
                address:updateProduct.Address,
                Team:updateProduct.Team
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async(req,res,next)=>{
    try {
        const id = req.params.id;

        await Product.findByIdAndDelete(id)

        res.status(200).json({message:"Product Deleted Successfully"})
    } catch (error) {
        next(error)
        
    }
}




