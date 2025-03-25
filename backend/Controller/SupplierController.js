const bcrypt = require('bcrypt');
const supplier = require("../Model/Supplier");
const User = require("../Model/User");
const SendMail = require('../Helper/sendEmail');

exports.supplierSignup = async (req, res) => {
  try {
    const { gstNo, contactNumber, category, businessName, businessAddress, businessEmail, password } = req.body;

    if (!(gstNo && contactNumber && category && businessName && businessAddress && businessEmail && password)) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the supplier already exists
    const existingSupplier = await supplier.findOne({ businessEmail });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new supplier
    const newSupplier = new supplier({
      gstNo,
      contactNumber,
      category,
      businessName,
      businessAddress,
      businessEmail,
      password: hashedPassword,
    });
    await newSupplier.save();

    // Check if user exists in User model
    const existingUser = await User.findOne({ email: businessEmail });
    if (!existingUser) {
      const newUser = new User({
        name: businessName,
        email: businessEmail,
        password: hashedPassword,
        phoneNumber: contactNumber,
        role: "supplier",
        supplier_id: newSupplier._id,
      });
      await newUser.save();
    }

    // Send confirmation email
    try {
      await SendMail(businessEmail, 'Supplier Registration', 'Supplier registered successfully');
    } catch (mailError) {
      console.error("Error sending email:", mailError);
    }

    return res.status(201).json({ message: 'Supplier registered successfully' });
  } catch (error) {
    console.error("Error in supplier signup:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
