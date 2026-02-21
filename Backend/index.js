import express from "express"
import dotenv from "dotenv"
import ConnectDb from "./config/db.js";

dotenv.config();
const app = express()
const port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send("Hiii world")
})

app.listen(port,()=>{
    ConnectDb()
    console.log("server started")
})