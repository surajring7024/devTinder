const express= require('express');

const app = express();


app.use('/user',
    (req,res,next)=>{
        console.log('User middleware 1');
        next();
    },
    (req,res,next)=>{
        console.log('User middleware 2');
        //res.send('request handler 2')
        next();
    },
    (req,res,next)=>{
        console.log('User middleware 3');
        //res.send('request handler 3')
        next();
    },
    (req,res,next)=>{
        console.log('User middleware 4');
       res.send('request handler 4')
    }
);

app.listen(7777,() => {
    console.log('Server is running on port 7777');
});