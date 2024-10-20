const express= require('express');

const app = express();


app.get(/.*fly$/,(req,res)=>{   
    res.send({message:'Used regex'
    })
});
app.get('/user/:userId/:name/:pass',(req,res)=>{
    console.log(req.params);
    res.send({message:'dynamic params'})
});
app.get('/user/:userId',(req,res)=>{
    console.log(req.params);    
    res.send({message:'Used dynamic params'})
});
app.get('/user',(req,res)=>{
    console.log(req.query);
    res.send({message:'Used query params'})
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