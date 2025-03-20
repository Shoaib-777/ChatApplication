import mongoose from "mongoose";

const FriendListSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    blocked: { type: Boolean, default: false } // Indicates if the friend is blocked
});
const FriendList = mongoose.models.FriendList || mongoose.model("FriendList", FriendListSchema)

export default FriendList