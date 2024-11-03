const express = require('express')
const authController = require('../controller/authController')
const router = express.Router();
const productController = require('../controller/productController')
const customerController = require('../controller/customerController')

//Employee
router.post('/add-product',productController.addProduct)
router.get('/get-product',productController.getProducts)
router.put('/update-product/:id', productController.updateProducts);
router.delete('/delete-product/:id', productController.deleteProduct);

//Customer
router.post('/add-customer',customerController.createCustomer)
router.get('/get-customer',customerController.getCustomer)
router.put('/update-customer/:id', customerController.updateCustomer);
router.delete('/delete-customer/:id', customerController.deleteCustomer);



//Auth
router.post('/signup',authController.signup)
router.get('/users',authController.users)
router.post('/login',authController.login)
router.post('/forgot-password',authController.forgotPassword)
router.post('/otp-verify',authController.verifyOtp)
router.get('/get-user/:email', authController.getUsers);

//router.post('/resend-otp',authController.resendOtp)
router.post('/update-password/:userId', authController.updatePassword);







module.exports = router;