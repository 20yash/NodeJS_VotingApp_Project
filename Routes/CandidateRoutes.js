const express = require('express')
const router = express.Router();
const User = require('./../Models/user')
const {jwtAuthMiddleware,generateToken}=require('../jwt')
const Candidate = require('../Models/candidates')



//this function here checks each routes whether the routes being accessed  here is admin or not
// const checkAdminRole = async (userID)=>{
//     try {
//         const user = await User.findbyId(userID)
//             return user.role === 'admin'
        
//     }catch (error) {
//         return false
//     }
// }


//this function here checks each routes whether the routes being accessed  here is admin or not
const checkAdminRole = async (userID) => {
    try{
         const user = await User.findById(userID);
         if(user.role === 'admin'){
             return true;
         }
    }catch(err){
         return false;
    }
 }
 


//A POST Route to add a candidate
router.post('/',jwtAuthMiddleware,async (req,res)=>{
    try {
        if(!(await checkAdminRole(req.user.id)))
            return res.status(404).json({message:"user is not an admin"})
        
        
        const data = req.body//assuming the request body contains the candidate data
        
        //create a new user document using Mongoose Model
        const newCandidate = new Candidate(data)

        //save this new user to the database
        const response = await newCandidate.save()
        console.log('data saved');

        res.status(200).json({response:response})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"})
        
    }
})










router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(404).json({message:"You are not an Admin"})
            console.log("You are not an Admin");
        }
        const candidateID = req.params.candidateID;//extract the id from the URL Parameter
        const updatedCandidateData = req.body;//updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
            new:true,//Return the updated document
            runValidators:true//Run Mongoose validation
        })
        if(!response){
            return res.status(404).json({error:'Candidate Not found'})
        }
        console.log("candidate data updated");
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
        
    }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try {
        if(!checkAdminRole(req.user.id))
        {
            return res.status(403).json({message:"User does not have Admin role"})
            console.log("You are not an admin");
        }
        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID)

        if(!response){
            return res.status(404).json({error:"candidate not found"})
        }
        console.log("candidate deleted successfully");
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
        
    }
})

//Voting starts here now


//Admin cannot vote
 //user can vote only once
//for casting the vote, we will get userID from token
//candidateID is fetched from the parameter 

router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{
    candidateID = req.params.candidateID
    userID=req.user.id

    try {//finding the candidate documents with specified candidateID
        const candidate = await Candidate.findById(candidateID)
        if(!candidateID){
            return res.status(404).json({message:"Coudn't find candidate"})
        }

        //second scenerio, candidate is found; now checking for the user

        const user = await User.findById(userID)
        if(!user){
            return res.status(404).json({message:"Coudn't find user"})
        }
        if(user.isVoted){
            res.status(400).json({message:"You have already voted"})
        }
        if(user.role ==="admin")
        {
            res.status(403).json({message:"Admin cannot vote"})
        }

        //after passing all these steps, now saving the data into database

        candidate.votes.push({user:userID})
        candidate.voteCount++;
        await candidate.save()

        //update the user documents now

        user.isVoted=true
        await user.save()

        res.status(200).json({message:"Vote recorded successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"vote not recorded successfully"})
        
    }
})

//also calculating the vote count here

router.get('/vote/count',async (req,res)=>{
    try {
        //number of votes to each parties
        //sorted order of votes to be arranged
        const candidate = await Candidate.find().sort({voteCount:"desc"})//finding all candidates and sorting them

        //mapping the candidates to return their name and votecounts

        const voteRecord = candidate.map((data)=>{
            return{
                party:data.party,
                count:data.voteCount

            }
        })
        res.status(200).json(voteRecord)//cheking the live votes
    
} catch (error) {
    console.log(error);
    res.status(500).json({error:"Vote count coudn't be completed"})
    
}

})

// //lastly, getitng the list of candidates appeared in the election

// router.get('/candidates',async(req,res)=>{
//     try {
//         const candidates = await Candidate.find()

//         res.status(200).json(candidates)
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error)
//     }
// })

module.exports = router;