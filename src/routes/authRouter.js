const express = require("express");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateSecurityQuestions,
} = require("../utils/API_Level_Validation");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      securityQuestion,
    } = req.body;

    validateSignUpData(req);
    validateSecurityQuestions(securityQuestion);

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: hashPassword,
      securityQuestion,
    });

    await user.save();

    res.status(201).json({
      ResponseData: "User registered successfully",
      ErrorMessage: null,
    });
  } catch (err) {
    res.status(400).json({
      ResponseData: null,
      ErrorMessage: err.message,
    });
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
      res.json({ ResponseData: user, ErrorMessage: null });
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
authRouter.post("/forgetPassword", async (req, res) => {
  try {
    const { email, securityQuestion, newPassword, verifyNewPassword } =
      req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Verify security question
    const { question, answer } = securityQuestion;
    const userSecurityQuestion = user.securityQuestion[0]; // Assuming it's the first question

    if (!userSecurityQuestion) {
      throw new Error("Security question not found for user");
    }

    // Check if the provided question matches the user's question and if the answer is correct
    if (userSecurityQuestion.question !== question) {
      throw new Error("Incorrect security question");
    }

    if (userSecurityQuestion.answer !== answer) {
      throw new Error("Incorrect answer");
    }

    // Check if both passwords match
    if (newPassword !== verifyNewPassword) {
      throw new Error("Passwords do not match");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({
      ResponseData: "Password reset successfully",
      ErrorMessage: null,
    });
  } catch (err) {
    res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
  }
});
module.exports = authRouter;
