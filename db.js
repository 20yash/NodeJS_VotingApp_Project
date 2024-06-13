const mongoose = require('mongoose')

require('dotenv').config()

const mongoURL = process.env.MONGODB_URL_LOCAL

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to MongoDB Server,HURRAY!");
})

db.on('error',()=>{
    console.log("ERROR While connecting to the MongoDB server",error);
})

db.on('disconnected',()=>{
    console.log("DISCONNECTED from MongoDB server");
})

module.exports=db;