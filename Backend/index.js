import express from "express"
import dotenv from "dotenv"
<<<<<<< HEAD
dotenv.config();
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

=======
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
>>>>>>> 2ba6c5aca6c41a8eb9b2df402efbde95c935150c
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
<<<<<<< HEAD
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(`/api/auth`,authRouter)
app.use(`/api/user`,userRouter)
=======
app.use(cookieParser())
app.use(`/api/auth`,authRouter)
>>>>>>> 2ba6c5aca6c41a8eb9b2df402efbde95c935150c

app.get("/", (req, res) => {
    res.send("EVA Backend Running 🚀");
});
app.listen(port,()=>{ 
    ConnectDb()
    console.log("server started")
})