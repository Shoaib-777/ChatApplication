import mongoose from "mongoose";


export default async function ConnectDB(){
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.URI);
            console.log("Connected to DB");
        } else {
            return
        }
    } catch (error) {
        console.log("error connect to db",error)
    }
} 