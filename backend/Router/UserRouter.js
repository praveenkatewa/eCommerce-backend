const express = require('express');
const userController = require('../Controller/UserController');
const {auth} = require('../Middleware/AuthMiddleware');

const router = express.Router();

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.post('/getOTP', userController.getOTP);

router.post('/forgetpassword',userController.forgetPassword);

router.put('/updatepassword',auth,userController.updatePassword);


module.exports=router;