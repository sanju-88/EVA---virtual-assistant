import express from "express"
import dotenv from "dotenv"
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(`/api/auth`,authRouter)

app.get("/", (req, res) => {
    res.send("EVA Backend Running 🚀");
});
app.listen(port,()=>{ 
    ConnectDb()
    console.log("server started")
})