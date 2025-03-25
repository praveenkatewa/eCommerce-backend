const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
   
    businessName: {
      type: String,
      required: true
    },
    businessEmail: {
      type: String,
      required: true,
      unique: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    businessAddress: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gstNo: {
      type: String,
      required: true,
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
