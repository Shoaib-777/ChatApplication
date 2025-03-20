import mongoose from "mongoose";

const MessageSGroupchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Groups", required: true },
    message: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false } 
  },{timestamps:true});
const MessageGroup = mongoose.models.MessageGroup || mongoose.model("MessageGroup", MessageSGroupchema)

export default MessageGroup