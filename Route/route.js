const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken=require("../utils/utils")
const verifyToken=require("../middleware/data")
const nodemailer=require("nodemailer")


router.get("/test", (req, res) => {
  res.send("hello");
});
router.post("/user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const hasshedpassword = await bcrypt.hash(password, 10);
    const newuser = new User({ email, password: hasshedpassword });
    await newuser.save();
    return res.json({ message: "user created" });
  }
  res.status(404).json({ message: "User already exists" });
});
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token=generateToken(user);
  res.json(token)
});
router.get("/data",verifyToken,(req,res)=>{
    res.json({message:`Welcome,${req.user.email} this is protected data`})
})
router.post("/reset",async(req,res)=>{
    const {email}=req.body;
    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const token =Math.random().toString(36).slice(-8);
    user.resetPasswordToken=token;
    user.resetPasswordExpires=Date.now()+3600000;
    await user.save();
    const transporter =nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"sidarthsidd123@gmail.com",
            pass:"tkfw dtjy jqty wbog"
            
        }
    })
    const message={
        from:"sidarthsidd123@gmail.com",
        to:user.email,
        sub:"password reset request",
        text:`please use the following token to reset your password ${token}`
    }
    transporter.sendMail(message,(err,info)=>{
        if(err){
            res.json({message:"something went wrong try again"})
        }
        res.json({message:"email send "})
    })
})
router.post("/reset-password/:token",async(req,res)=>{
const {token}=req.params;
const {password}=req.body;
const user =await User.findOne({
    resetPasswordToken:token,
    resetPasswordExpires:{ $gt:Date.now()}
})
if(!user){
    return res.json({message:"invalid token"})
}
    const hashpassword= await bcrypt.hash(password,10);
    user.password=hashpassword;
    user.resetPasswordToken=null;
    user.resetPasswordExpires=null;
    await user.save();
    res.json({message:"password reset successfully "})


})

module.exports = router;
