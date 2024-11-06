const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number
    },
    isActive:{
        type:Boolean,
        default:true,
        required:true
    },
    isDisabled:{
        type:Boolean,
        default:false,
        required:true
    }
});

module.exports=mongoose.model('User',userSchema);