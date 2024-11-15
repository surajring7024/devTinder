const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address: { type: String, maxLength: 30, trim: true },
  street: { type: String, maxLength: 30, trim: true },
  landmark: { type: String, maxLength: 30, trim: true },
  city: { type: String, index: true, maxLength: 30, trim: true },
  state: { type: String, maxLength: 30, trim: true },
  country: { type: String, maxLength: 30, trim: true },
  pincode: {
    type: String,
    index: true,
    maxLength: 6,
    minLength: 6,
    trim: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 2,
      match: /^[a-zA-Z]+$/,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 50,
      minLength: 2,
      match: /^[a-zA-Z]+$/,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
      lowercase: true,
    },

    age: {
        type: Number,
        min: 18,   
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    skills: {
      type: [String],
      maxLength: 20,
    },
    about: {
      type: String,
      default: "this is me",
    },
    photourl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
    },
    mobileNo: {
      type: String,
      maxLength: 10,
      minLength: 8,
      match: /^[0-9]$/,
      unique: true,
    },
    primaryAddress: {
      type: addressSchema,
    },
    permanentAddress: {
      type: addressSchema,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
