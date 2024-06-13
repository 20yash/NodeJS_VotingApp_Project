//creating server now
const express = require('express')
const app = express()
const db = require('./db')

require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const PORT = process.env.PORT||3000

//Importing the Router files
const userRoutes = require('./Routes/UserRoutes')

//using the routers
app.use('/user',userRoutes)


app.listen(PORT,() =>{
    console.log('Running on PORT 3000');
})
