const express = require('express');
const router = express.Router()
const supplierController = require('../Controller/SupplierController')

// const {supplierAuth} = require('../middlewere/supplierAuth')

router.post('/supplierSignup',supplierController.supplierSignup);


module.exports = router