import mongoose from "mongoose";

const connectDB = async () => {
    try {
        let connectionInstance =  await mongoose.connect(process.env.MONGODB_URI);
        console.log(`/n mongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongodb connection error: ", error)
        process.exit(1)
    }
}

export default connectDB
