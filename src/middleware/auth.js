const jwt=require('jsonwebtoken')
const User=require("../models/user");    
const userAuth=async (req, res, next) => {
        try{
            const cookie= req.cookies;
            if(!cookie.token){
                throw new Error('Invalid token');
            }
            const decodedObj=jwt.verify(cookie.token, 'DEV@Tinder$27');
            
            const user= await User.findById(decodedObj);

            if(!user){
                throw new Error('User not found');
            }
            req.user=user;
            next();
        }
        catch(err){
            res.status(401).json('ERROR:' + err.message);
        }
    }

module.exports={userAuth}