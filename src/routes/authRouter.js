const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/API_Level_Validation");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
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
    });

    //saving user to the database
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err + " Invalid data");
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
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
      });
      res.send("Logout successful");

});
module.exports = authRouter;
