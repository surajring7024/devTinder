const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/recieve", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
      "primaryAddress",
    ]);

    res.status(200).json({ ResponseData: data });
  } catch (err) {
    res.status(400).json({ ErrorMessage: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
        "primaryAddress",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
        "primaryAddress",
      ]);

      
      const data=connections.map((row)=> {
        if(row.fromUserId._id.equals(loggedInUser._id)){
           return row.toUserId;
        }else return row.fromUserId;
      })

    res.status(200).json({ ResponseData: data });
  } catch (err) {
    res.status(400).json({ ErrorMessage: err.message });
  }
});

module.exports = userRouter;
