const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "supplier", "admin"],
      default: "user",
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supplier',
      required: false
  },
    otp: {
      type: String,
      required: false
    },
    otpExpire: {
      type: Date,
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
