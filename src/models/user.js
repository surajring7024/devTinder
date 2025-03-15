const mongoose = require("mongoose");
const validator = require("validator");

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
      trim: true,
      lowercase: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email "+value);
        }
      }
    },
    password: {
        type: String,
        required: true,
        validate(value){
          if(!validator.isStrongPassword(value)){
            throw new Error("Enter a strong password "+ value);
          }
        }

    },
    age: {
        type: Number,
        min: 18,   
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other","male","female","other"],
    },
    isActive: {
      type: Boolean,
      default: true,

    },
    isDisabled: {
      type: Boolean,
      default: false,
      
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
      validate(value){
        if(!validator.isURL(value)){
          throw new Error("Invalid photourl "+value);
        }
      }
      },
    mobileNo: {
      type: String,
      maxLength: 10,
      minLength: 8,
      match: /^[0-9]$/,      
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
