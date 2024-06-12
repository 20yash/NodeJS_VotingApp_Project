const mongoose = require('mongoose');
// const bcrypt = require('bcrypt')

//Now defining the User schema for the voting app

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        require:true
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","voter"],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

const user = mongoose.model('User',userSchema)
module.exports = user