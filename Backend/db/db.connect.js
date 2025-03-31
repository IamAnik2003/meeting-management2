const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const conn=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    }catch(error){
        console.error('Error connecting to MongoDB:', error.message);
    }
};

module.exports=conn;