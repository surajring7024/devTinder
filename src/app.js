const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

//middleware to convert json vaues readable
app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating instance of user model
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err + " Invalid data");
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const userId=req.params?.id;
    const data= req.body;   

    const ALLOWED_UPDATES =["photourl","skills","about","mobileNo","primaryAddress","permanentAddress"]
    
    const isallowed= Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

    if(!isallowed){
        throw new Error("Update not allowed");
    }

    if(data?.skills.length>20){ 
        throw new Error("Cannot add more than 20 skills"); 
    }

    const user = await User.findByIdAndUpdate({_id:userId},data, {
      returnDocument: "after",
      runValidators: true
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Successfully connected to db");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error connecting to db:", err);
  });
