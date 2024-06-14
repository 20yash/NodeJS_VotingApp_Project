//creating server now
const express = require('express')
const app = express()
const db = require('./db')

require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const PORT = process.env.PORT||3000

// const{jwtAuthMiddleware}= require('./jwt')


//Importing the Router files
const userRoutes = require('./Routes/UserRoutes')
const CandidateRoutes = require('./Routes/CandidateRoutes')

//using the routers
app.use('/user',userRoutes)
app.use('/Candidates',CandidateRoutes)


app.listen(PORT,() =>{
    console.log('Running on PORT 3000');
})
