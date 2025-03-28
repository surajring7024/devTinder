const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/API_Level_Validation");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, securityQuestion } = req.body;
    //validating data using API level validation
    validateSignUpData(req);
    //password encryption using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    //creating instance of user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      securityQuestion,
    });

    //saving user to the database
    await user.save();
    res
      .status(201)
      .json({
        ResponseData: "User registered successfully",
        ErrorMessage: null,
      });
  } catch (err) {
    res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User is not present");
    }

    //bcrpt uses promise so always use await.
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    } else {
      //generate jwt token and pass to cookies
      const jwtToken = await user.getJwtToken();

      //create cookies
      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.json({ Responsedata: "Login successful", ErrorMessage: null });
    }
  } catch (err) {
    res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User is not present");
    }
    req = req.user;
    next();
  } catch (err) {
    res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
  }
};

const validateSecurityQuestion = async (req, res, next) => {
  try {
    const { question, answer } = req.body.securityQuestion;
    const user = req.user;

    if (!user.securityQuestion || user.securityQuestion.question !== question) {
      throw new Error("Incorrect security question");
    }
    if (user.securityQuestion.answer !== answer) {
      throw new Error("Incorrect answer");
    }
    next();
  } catch (err) {
    res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
  }
};

authRouter.post(
  "/forgetPassword",
  getUserByEmail,
  validateSecurityQuestion,
  async (req, res) => {
    try {
      const { newPassword, verifyNewPassword } = req.body;
      const user = req.user;

      if (newPassword !== verifyNewPassword) {
        throw new Error("Passwords do not match");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      res
        .status(200)
        .json({
          ResponseData: "Password reset successfully",
          ErrorMessage: null,
        });
    } catch (err) {
      res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
    }
  }
);
module.exports = authRouter;
