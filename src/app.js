const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("./utils/API_Level_Validation");

//middleware to convert json vaues readable
app.use(express.json());
app.post("/signup", async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;
//validating data using API level validation
validateSignUpData(req);
//password encryption using bcrypt
const hashPassword = await bcrypt.hash(password, 10);
console.log(hashPassword);

//check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error ("Email already exists");
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

app.post("/login",async(req, res)=>{

  try{
    const {email,password} = req.body;

    const user = await User.findOne({ email:email});
    if(!user){
      throw new Error("User is not present");
    }

    //bcrpt uses promise so always use await.
    const isPasswordValid= await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      throw new Error("Invalid password");
    }else{
      res.send("Login successful");
    }
    
  }
  catch(err){
   res.status(400).send("Invalid credentials: "+ err.message );
  }
})
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

//;
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user info  
app.put("/user/:id", async (req, res) => {
  try {
    const userId=req.params?.id;
    const data= req.body;   

    //api level validation
    const ALLOWED_UPDATES =["photourl","skills","about","mobileNo","primaryAddress","permanentAddress"]
    
    const isallowed= Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

    if(!isallowed){
        throw new Error("Update not allowed");
    }

    if(data.skills!=undefined){ 
      if(data?.skills.length>20)
        throw new Error("Cannot add more than 20 skills");
      else
      data.skills = [...new Set(data?.skills)];
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
