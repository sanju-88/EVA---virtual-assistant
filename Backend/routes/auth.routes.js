import express from "express"
import { login, logOut, signUp } from "../controllers/auth.controller.js"

const authRouter = express.Router()
authRouter.post("/signup",signUp)
<<<<<<< HEAD
authRouter.post("/login",login)
=======
authRouter.post("/signin",login)
>>>>>>> 2ba6c5aca6c41a8eb9b2df402efbde95c935150c
authRouter.get("/logout",logOut)

export default authRouter