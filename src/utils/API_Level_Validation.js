const validator = require('validator');

const validateSignUpData= (req)=>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName ||!lastName ){
        throw new Error('First name and last name are required');
    }else if(!validator.isEmail(email)){
        throw new Error('Invalid email address');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
}
const validateProfileEditData=(req)=>{
    const data= req.body;
    const ALLOWED_UPDATES=["photourl","skills","about","mobileNo","primaryAddress","permanentAddress"];
    const isAllowed=Object.keys(data).every(key=>ALLOWED_UPDATES.includes(key));

    return isAllowed;
}
module.exports = {validateSignUpData,validateProfileEditData};