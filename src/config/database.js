const mongoose = require('mongoose');

const connectDB= async ()=>{
    await mongoose.connect('mongodb+srv://suraj7024:wDxvy9tvJLhzmg32@namastenode.xevtp.mongodb.net/devTinder');   
}

module.exports={connectDB};