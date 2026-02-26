import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async(req,res) =>{
    try {
        const {User,email,password} = req.body
        const existEmail = await User.findOne({email})

        if(existEmail){
            return res.status(400).json({Message:"Email already exists!"})
        }
        if(password.length<6){
            return res.status(400).json({Message:"Password must be atleast 6 characters!"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,password: hashedPassword,email
        })
        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })
        
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({messsage:`Sign Up error ${error}`})
    }
}


export const login = async(req,res) =>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({Message:"Email doesn't exists!"})
        }
        if(password.length<6){
            return res.status(400).json({Message:"Password must be atleast 6 characters!"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({Message:"Password is incorrect!"})
        }
        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })
        
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({messsage:`Login error ${error}`})
    }
}


export const logOut = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({messsage:"Logged out successfully!"})
    } catch (error) {
        return res.status(500).json({messsage:`Logout error ${error}`})
    }
}