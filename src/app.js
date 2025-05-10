const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
//middleware to convert json vaues readable
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     if (users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //;
// app.delete("/user", async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.body.id);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //update user info
// app.put("/user/:id", async (req, res) => {
//   try {
//     const userId=req.params?.id;
//     const data= req.body;

//     //api level validation
//     const ALLOWED_UPDATES =["photourl","skills","about","mobileNo","primaryAddress","permanentAddress"]

//     const isallowed= Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

//     if(!isallowed){
//         throw new Error("Update not allowed");
//     }

//     if(data.skills!=undefined){
//       if(data?.skills.length>20)
//         throw new Error("Cannot add more than 20 skills");
//       else
//       data.skills = [...new Set(data?.skills)];
//     }

//     const user = await User.findByIdAndUpdate({_id:userId},data, {
//       returnDocument: "after",
//       runValidators: true
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong: " + err.message);
//   }
// });

connectDB()
  .then(() => {
    console.log("Successfully connected to db");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to db:", err);
  });
