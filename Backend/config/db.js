import mongoose from "mongoose"

const ConnectDb = async () =>{
    try {
<<<<<<< HEAD
        await mongoose.connect(process.env.MONGO_URI)
=======
        await mongoose.connect(process.env.Mongodb_url)
>>>>>>> 2ba6c5aca6c41a8eb9b2df402efbde95c935150c
        console.log("Db connected")
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDb