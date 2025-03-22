const mongoose= require('mongoose');

const ConnectionRequestSchema=mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","intrested","rejected"],
            message:'{Value} is incorrect status type'
        },
        required:true
    }
},
{ timestamps:true}
);

ConnectionRequestSchema.index({fromUserId:1,toUserId:1});

ConnectionRequestSchema.pre("save",function(next){
    const ConnectionRequest=this;

    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("You cannot sent request to yourself!!");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);