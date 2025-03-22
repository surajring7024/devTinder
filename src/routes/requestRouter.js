const express = require("express");
const requestRouter = express.Router();
const {userAuth}=require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequest= require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const ISALLOWED_STATUS=["ignored","intrested"];

    if(!ISALLOWED_STATUS.includes(status)){
      throw new Error("Invalid status");
    }

    const toUser= await user.findById(toUserId);

    if(!toUser){
      throw new Error("User not found");
    }

    const existingConnection= await ConnectionRequest.findOne({
      $or:[
        { fromUserId,toUserId},
        {
          fromUserId:toUserId,
          toUserId:fromUserId
        }
      ]
    });

    if(existingConnection){
      throw new Error("Connection request Already exists!!!");
    }

    const connectionRequest= new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    const data= await connectionRequest.save();

    res.json({ResponseData:data});

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
