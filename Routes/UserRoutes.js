//Take reference of the diagram; creating each user route here


const express = require('express')
const router = express.Router()

const User = require('./../Models/user')//check here

const{jwtAuthMiddleware, generateToken} = require('./../jwt')//authenticationn using token
//we have shifted this directly into server.js file

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


router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userData = req.user;//req.user is fetched from jwt.js file
        //in req.user, whatever data we have from thr token is extracted(userData,userId)
        const userId = userData.id;
        const user = await User.findById(userId)
        res.status(200).json({user})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"error while displaying the profile"})
        
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

//__________________________________________________________________
//exported this code from Git repo. of prince



// const express = require('express');
// const router = express.Router();
// const User = require('./../Models/user');
// const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// // POST route to add a person
// router.post('/signup', async (req, res) =>{
//     try{
//         const data = req.body // Assuming the request body contains the User data

//         // // Check if there is already an admin user
//         // const adminUser = await User.findOne({ role: 'admin' });
//         // if (data.role === 'admin' && adminUser) {
//         //     return res.status(400).json({ error: 'Admin user already exists' });
//         // }

//         // // Validate Aadhar Card Number must have exactly 12 digit
//         // if (!/^\d{12}$/.test(data.aadharCardNumber)) {
//         //     return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
//         // }

//         // // Check if a user with the same Aadhar Card Number already exists
//         // const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
//         // if (existingUser) {
//         //     return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
//         // }

//         // Create a new User document using the Mongoose model
//         const newUser = new User(data);

//         // Save the new user to the database
//         const response = await newUser.save();
//         console.log('data saved');

//         const payload = {
//             id: response.id
//         }
//         console.log(JSON.stringify(payload));
//         const token = generateToken(payload);
//         console.log("Token is:",token);

//         res.status(200).json({response: response, token: token});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// // Login Route
// router.post('/login', async(req, res) => {
//     try{
//         // Extract aadharCardNumber and password from request body
//         const {aadharCardNumber, password} = req.body;

//         // // Check if aadharCardNumber or password is missing
//         // if (!aadharCardNumber || !password) {
//         //     return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
//         // }

//         // Find the user by aadharCardNumber
//         const user = await User.findOne({aadharCardNumber: aadharCardNumber});

//         // If user does not exist or password does not match, return error
//         if( !user || !(await user.comparePassword(password))){
//             return res.status(401).json({error: 'Invalid Aadhar Card Number or Password'});
//         }

//         // generate Token 
//         const payload = {
//             id: user.id,
//         }
//         const token = generateToken(payload);

//         // resturn token as response
//         res.json({token})
//     }catch(err){
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Profile route
// router.get('/profile', jwtAuthMiddleware, async function(req, res) {
//     try{
//         const userData = req.user;
//         const userId = userData.id;
//         const user = await User.findById(userId);
//         res.status(200).json({user});
//     }catch(err){
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
//     try {
//         const userId = req.user.id; // Extract the id from the token
//         const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

//         // Check if currentPassword and newPassword are present in the request body
//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
//         }

//         // Find the user by userID
//         const user = await User.findById(userId);

//         // If user does not exist or password does not match, return error
//         if (!user || !(await user.comparePassword(currentPassword))) {
//             return res.status(401).json({ error: 'Invalid current password' });
//         }

//         // Update the user's password
//         user.password = newPassword;
//         await user.save();

//         console.log('password updated');
//         res.status(200).json({ message: 'Password updated' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;