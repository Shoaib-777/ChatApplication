import ConnectDB from "../DB/ConnectDB.js"
import { getReceiverSocketId, io } from "../lib/Socket.js";
import Message from "../Models/Message.js"
import mongoose from "mongoose";

export const GetSelectedUserMessages = async (req, res) => {
    const {id} = req.params
    const senderId  = id;
    const myId = req.cookies.userLoggedIn

    try {

        if (!senderId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const getData = await Message.find({
            $or: [
                { senderId: myId, receiverId: senderId },
                { senderId: senderId, receiverId: myId }
            ]
        });

        if (!getData.length) {
            return res.status(201).json({ message: "Data is empty" });
        }

        return res.status(200).json({ data: getData });
    } catch (error) {
        console.log("Server error", error);
        res.status(500).json({ message: "Error fetching messages", error });
    }
};


export const SendMessage = async (req, res) => {
    const { senderId, receiverId, message, image } = req.body;

    try {

        // Validate required fields
        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ message: "senderId, receiverId, and message are required" });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid senderId or receiverId" });
        }

        // Create and save message
        const newMssg = new Message({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            message,
            image
        });

        await newMssg.save();
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMssg", newMssg);
        }
        return res.status(200).json({ newMssg });

    } catch (error) {
        console.log("Error sending message:", error);
        return res.status(500).json({ message: "Error sending message", error });
    }
};

export const DeletedMessage = async (req,res) => {
    const {id} = req.params
    try {
        const data = await Message.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        if (!data) {
            return res.json({ message: "Message not found" }, { status: 404 });
          }
      
        return res.status(200).json({message:"message deleted sucessfully"})
    } catch (error) {
     console.log("error deleting message",error)
     return res.status(500).json({message:"error deleting message",error})   
    }
}