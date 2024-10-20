const express= require('express');

const app = express();

app.get('/user',(req,res)=>{
    res.send({firstname: 'Suraj', lastname: 'Ingole'})
});

app.post('/user',(req,res)=>{
    res.send({message: 'User created successfully',errorMessage:null});
});

app.delete('/user',(req,res)=>{
    res.send({message: 'User deleted successfully',errorMessage:null});
});
app.use("/test",(req,res)=>{
    res.send("Hello, Test!");
});

app.listen(7777,() => {
    console.log('Server is running on port 7777');
});