const jwt = require('jsonwebtoken')

const jwtAuthMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization
    if(authorization === null){
        return res.status(500).json({error:"token not found"})
    }
    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(500).json({error:"unauthorized"})

    try {
        //verifying the jwt token here
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Invalid Token here"})
        
    }
}