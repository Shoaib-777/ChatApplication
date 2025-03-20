import mongoose from "mongoose";
import ConnectDB from "../DB/ConnectDB.js"
import User from "../Models/User.js"

export const GetAllUsers = async (req,res) => {
    try {
        const users = await User.find().select("name email profile _id")
        if(!users){
          return res.status(200).json({message:"Users are empty"})
        }
      return res.status(200).json({data:users})
    } catch (error) {
        console.log("error getting all users",error)
      return res.status(500).json({message:"error getting all users",error})
    }
}

export const GetSingleUser = async (req,res) => {
    const {id}= req.params
    try {
        if(!id){
          return res.status(400).json({message:"user id is required"})
        }
        const user = await User.findById(id).select("name email profile status createdAt lastSeen")
      return res.status(200).json({data:user})
    } catch (error) {
        console.log("error getting single user",error)
      return res.status(500).json({message:"error getting single user",error})
    }
}

export const UpdateUserProfile = async(req,res)=>{
    const {id}=req.params
    const {profile} = req.body
    try {
        if(!id){
          return res.status(400).json({message:"user id is required to update user profile"})
        }
        const user = await User.findByIdAndUpdate(id,{profile:profile})
      return res.status(200).json({message:"user profile updated sucessfully"})
    } catch (error) {
        console.log("error updating user profile",error)
      return res.status(500).json({message:"error updating user profile",error:error})
    }
}


export const DeleteUserAccount = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User account deleted successfully!" });
    } catch (error) {
        console.log("Error deleting user account", error);
        return res.status(500).json({ message: "Error deleting user account", error });
    }
};

