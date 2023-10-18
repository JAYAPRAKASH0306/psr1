const mongoose= require("mongoose")

const UserSchema=new mongoose.Schema({
    email:String,
    password:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date

})
const user=mongoose.model("user",UserSchema)
module.exports=user;