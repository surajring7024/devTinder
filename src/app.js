const express= require('express');
const {connectDB}= require('./config/database');
const app = express();
const User = require('./models/user');

//middleware to convert json vaues readable
app.use(express.json());
app.post('/signup', async (req, res)=>{
    //creating instance of user model
    const user= new User(req.body);

    try{
       await user.save();
       res.send('User registered successfully');  
    }
    catch(err){
        res.status(400).send(err+' Invalid data');        
    }
})

connectDB()
.then(()=>{
    console.log('Successfully connected to db');
    app.listen(7777,() => {
        console.log('Server is running on port 7777');
    });
})
.catch((err)=>{
    console.error('Error connecting to db:',err);
})
