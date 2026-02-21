import mongoose from "mongoose"

const ConnectDb = async () =>{
    try {
        await mongoose.connect(process.env.Mongodb_url)
        console.log("Db connected")
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDb