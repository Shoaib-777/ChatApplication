import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    image: { type: String }, // URL for image storage
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false } // Flag to indicate if a message is deleted
  },{timestamps:true});
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema)

export default Message