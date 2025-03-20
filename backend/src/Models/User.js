import mongoose from 'mongoose'

const friendRequestsSchema = new mongoose.Schema({
  senderId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receiverId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status:{
    type:String,enum:["pending","accepted","rejected"],default:"pending"
  },
  documentSenderId:{type:mongoose.Schema.Types.ObjectId}, 
  documentReceiverId:{type:mongoose.Schema.Types.ObjectId}, 
  isSender:{type:Boolean,default:false}
},{timestamps:true})

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile: { type: String },
  password: { type: String, required: true },
  userFriendList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests:[friendRequestsSchema],
  userBlockList:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  userGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' }], 
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: null }
},{timestamps:true});

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User