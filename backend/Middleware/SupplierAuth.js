const supplier = require("../Model/Supplier");
const User = require("../Model/User");
const jwt = require('jsonwebtoken');

const secretKey = 'NBKFFJBFDKDJLNBJKFVJGFKVK'; 

exports.supplierAuth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization;
    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const splitToken = token.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(splitToken, secretKey);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const supplierData = await supplier.findById(user.supplier_id);
    if (!supplierData) {
      return res.status(401).json({ message: "Supplier not found" });
    }

    req.supplier = supplierData; // Attach supplier data to request
    next();
  } catch (error) {
    console.error("Error in supplier authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
