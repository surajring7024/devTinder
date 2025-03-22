const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const validator=require('validator');
const { validateProfileEditData } = require("../utils/API_Level_Validation");
const User=require('../models/user');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Edit Not allowed for these fields");
    }
    const data = req.body;
    const user = req.user;

    if (data.skills != undefined) {
      if (data?.skills.length > 20)
        throw new Error("Cannot add more than 20 skills");
      else data.skills = [...new Set(data?.skills)];
    }

    Object.keys(data).forEach((key) => (user[key] = data[key]));

    await user.save();

    res.json({ ResponseData: user, ErrorMessage: null });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
profileRouter.put("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user=req.user;
    const isPasswordMatch = await user.validatePassword(oldPassword);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password");
    }
   
    if( !validator.isStrongPassword(newPassword)){
      throw new Error("Enter a strong Password");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password=hashPassword;
    await user.save();

    res.send("Password updated Successfully!!");

  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
module.exports = profileRouter;
