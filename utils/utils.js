const jwt=require("jsonwebtoken")

const generateToken=(user)=>jwt.sign({id:user.id},process.env.S_KEY,{expiresIn:"10m"})

module.exports=generateToken;