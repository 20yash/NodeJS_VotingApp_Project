//Take reference of the diagram; creating each user route here


const express = require('express')
const router = express.Router()

const User = require('./../Models/user')//check here

const{jwtAuthMiddleware, generateToken} = require('./../jwt')//authenticationn using token

//POST route to add a user

//Signup route
router.post('/signup',async(req,res)=>{
    try {
        const data = req.body//Assuming the request body contains the user data

        //create a new user document using the mongoose model
        const newUser = new User(data);

        //saving the new user document to the database
        const response = await newUser.save()
        console.log('User data saved to the database');

        const payload ={
            id:response.id
        }

        //Token is generated now
        console.log(JSON.stringify(payload))
        const token = generateToken(payload)
        console.log("Token is:",token);

        res.status(200).json({response:response,token:token})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Error while generating the token"})
        
    }
})

//Login Route

router.post('/login',async (req,res)=>{
    try {
        //as the user will be able to login using the aadhar card only;
        const{aadharCardNumber,password}=req.body

        //finding the user by Aadharcard number
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        //if user does not exist or password does not match, return error
        if(!user|| !(await user.comparePassword(password)))//check here
        {
            console.log("Invalid username or password");
            return res.status(500).json({error:"Invalid username or password"})
        }
        //generating token

        const payload={
            id:user.id
        }
        const token = generateToken(payload)
        console.log("Logged in, token is",token);
        
        //now returning token as response
        res.json({token})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"error while loggin in"})
        
    }
})



//Profile Route


// router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
//     try {
//         const userData = req.user;//req.user is fetched from jwt.js file
//         //in req.user, whatever data we have from thr token is extracted(userData,userId)
//         const userId = userData.id;
//         const user = await User.findById(userId)
//         res.status(200).json({user})
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error:"error while displaying the profile"})
        
//     }
// })

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{

    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user})
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
})

//changing the password

router.put('/profile/password',jwtAuthMiddleware, async(req,res)=>{
    try {
        // const userId = req.params.id;//extract the id from the URL parameter
        //we will extract the id directly from the token
        const userId= req.user.id
        
        //we will take input of old and current password,so that we can check the user know the old password or not
        const{currentPassword,newPassword}=req.body//extract the current and new password from req.body


        //checking the user exists or not; taking reference of /profile route
        const user = await User.findById(userId)

        //checking that the password is matching or not
        //using reference of the /login route
        //checking for current password

        if(!(await user.comparePassword(currentPassword))){
            return res.status(500).json({error:"Invalid username or password here"})
        }

        //updating the current password
        user.password = newPassword
        await user.save()

        console.log("password change updated successfully");
        res.status(200).json({message:"Password change updated successfully"})
        
    } catch (error) {
        console.error("error while changing the password");
        res.status(500).json({error:"Error while changing the password"})
        
    }
})

module.exports = router;