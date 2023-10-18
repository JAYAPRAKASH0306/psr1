const express =require ("express");
const app= express();
require("dotenv").config();
const router=require("./Route/route")

const port=process.env.PORT||4000;
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
Db=process.env.Db;

app.use(bodyParser.json())
app.use("/",router)



mongoose.connect(Db,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>{console.log("db connected")}).catch(()=>{
    console.log("not able to connect")
})
  app.listen(port,()=>{
 console.log(`port is connected ${port}`)
})
