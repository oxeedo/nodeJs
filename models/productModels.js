const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter a firstname"],
      unique: true,
      trim: true,
      minlength: [1, "firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter a lastname"],
      unique: true,
      trim: true,
      minlength: [1, "firstname must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
