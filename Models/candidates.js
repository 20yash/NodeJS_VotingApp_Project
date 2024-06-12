const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,//we are getting the unique id directly from mongodb database therefore this line
                ref:'user',//we are getting the reference directly from the user table
                required:true
                },
            votedAt:{
                type:Date,
                default:Date.now(),
                required:true
                }
        }
    ],//eventually, the length of the array is the voteCount; we can use this as a doublecheck here
    voteCount:{
        type:Number,
        default:0
    }

})

const candidate = mongoose.Model('candidate',candidateSchema)
module.export = candidate