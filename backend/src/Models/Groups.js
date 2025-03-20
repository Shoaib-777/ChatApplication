import mongoose from "mongoose";
import { Schema } from "mongoose";

const GroupsSchema = new Schema({
  groupName: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // List of user references
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessageGroup' }], // List of message references
  AdminId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Admin user reference
  icon: { type: String }, // URL for group icon
  removedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of removed members
  addedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // List of added members
});
const Groups = mongoose.models.Groups || mongoose.model("Groups", GroupsSchema)

export default Groups