const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ISALLOWED_STATUS = ["ignored", "intrested"];

      if (!ISALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status");
      }

      const toUser = await user.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found");
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        throw new Error("Connection request Already exists!!!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ ResponseData: data, ErrorMessage: null });
    } catch (err) {
      res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status");
      }

      const existingConnection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });

      if (!existingConnection) {
        throw new Error("Connection not Found");
      }

      existingConnection.status = status;

      const data = await existingConnection.save();

      res.status(200).json({ ResponseData: data, ErrorMessage: null });
    } catch (err) {
      res.status(400).json({ ResponseData: null, ErrorMessage: err.message });
    }
  }
);
module.exports = requestRouter;
