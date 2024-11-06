const express= require('express');
const {connectDB}= require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res)=>{
    
    const user= new User({
        firstName:"yogesh",
        lastName:"rana",
        email:"y.rana@gmail.com",
        age: 21,
        password:"yogesh1234"
    });

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
