const express= require('express');

const app = express();
const {adminAuth,userAuth} = require('./middleware/auth');
//middleware called when /admin hit
app.use('/admin',adminAuth);

app.get('/admin/getAllData',(req,res)=>{
    res.send('All data fetched successfully');
   
});

app.get('/admin/deleteAll',(req,res)=>{
    res.send('All data deleted successfully');
    
});

app.get('/user/getAll',userAuth,(req,res)=>{
    res.send('All user data fetched successfully');
});

app.listen(7777,() => {
    console.log('Server is running on port 7777');
});