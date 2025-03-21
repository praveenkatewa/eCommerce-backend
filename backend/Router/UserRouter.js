const express = require('express');
const userController = require('../Controller/UserController');

const router = express.Router();

router.post('/signup',userController.signup);
router.post('/login',userController.login);
// router.post('/forgetpassword',userController.forgetpassword);
// router.post('/updatepassword',userController.updatepassword);
// router.post('/supplier',userController.supplier);

module.exports=router;