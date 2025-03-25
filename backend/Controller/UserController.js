const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const sendEmail = require("../Helper/sendEmail");

const secretkey = ' NBKFFJBFDKDJLNBJhjbjjjjGFKVK'
const moment=require('moment')

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phoneNumber, 
      role 
    });

    await newUser.save();



    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to Our Platform, </h2>
      <p>Thank you for signing up. Your account has been successfully created.</p>
      <p><strong>Role:</strong> ${role}</p>
      <p>We hope you enjoy our services!</p>
      <br>
      <p>Best Regards,<br>Team</p>
    </div>
  `;

    await sendEmail(email, "Account created successfully",emailTemplate);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("User",user)
    const role=user.role
    console.log("Role",role)

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      secretkey, 
      { expiresIn: "7d" }
    );

    // Define redirect path based on role
    let redirectPath = "/dashboard"; // Default path
    if (user.role === "user") redirectPath = "/UserView";
    else if (user.role === "supplier") redirectPath = "/supplier-dashboard";
    else if (user.role === "admin") redirectPath = "/admin-dashboard";

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      redirectPath, // Send role-based navigation path
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpTime = moment().add(5, "minutes").toDate(); // OTP expires in 5 mins

    // Store OTP and expiry in DB
    await User.updateOne({ email }, { otp, otpTime });

    // Send OTP via email
    const mailInfo = await sendEmail(email, "OTP for password reset", `Your OTP is ${otp}`);
    console.log("MailInfo:", mailInfo);

    if (!mailInfo.messageId) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.forgetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP is correct
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (moment().isAfter(user.otpTime)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password & clear OTP
    await User.updateOne(
      { email },
      { password: hashedPassword, otp: null, otpTime: null }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
   
    const user = await User.findOne({ email: req.user.email }); // Fetch user by email
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare current password with stored hash
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.updateOne({ email: user.email }, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};