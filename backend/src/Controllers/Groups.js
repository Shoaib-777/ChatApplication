import ConnectDB from "../DB/ConnectDB.js"
import { getGroupSocketIds, io } from "../lib/Socket.js"
import Groups from "../Models/Groups.js"
import MessageGroup from "../Models/MessageGroup.js"

export const CreateGroup = async (req,res) => {
    const {users,icon,groupName,AdminId}=req.body
    try {
        if(!groupName || ! AdminId){
            return res.status(400).json({message:"Group name is required and Admin id is required"})
        }
        const newGroup = await Groups({
            groupName,
            users,
            AdminId,
            icon,
            messages: [],
            removedMembers: [],
            addedMembers: []
        })
        const sucess = await newGroup.save()
        if(!sucess){
            return res.status(400).json({message:"something went wrong try later"})
        }
        return res.status(201).json({message:"Group Created Sucessfully"})
    } catch (error) {
        return res.status(500).json({message:"error creating group",error})
    }
}

export const SendMessageGroup = async (req,res) => {
    try {
        const { senderId, groupId, message,image } = req.body;

        if (!senderId || !groupId || !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const groupData = await Groups.findById(groupId);
        if (!groupData) {
            return res.status(404).json({ message: "Group not found" });
        }

        const newMessage = new MessageGroup({ senderId, groupId, message,image });
        await newMessage.save();

        // Add the message ID to the group's messages array
        await Groups.findByIdAndUpdate(groupId, { $push: { messages: newMessage._id } });
        const groupReceiverId = getGroupSocketIds(groupId)
        if (groupReceiverId) {
                  io.to(groupReceiverId).emit("newGroupMessage", newMessage);
        }

      return res.status(201).json({ message: "Message sent successfully", messageData: newMessage });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error });
    }
}

export const GetGroupMessage = async (req,res) => {
    const { id:groupId } = req.params;
    try {

        if(!groupId){
            return res.status(400).json({message:"group not found"})
        }

        // Check if the group exists
        const groupData = await Groups.findById(groupId).populate("messages");
        if (!groupData) {
            return res.status(404).json({ message: "Group not found" });
        }

      return res.status(200).json({ messages: groupData.messages });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const GetGroupDetails = async(req,res)=>{
    const { id:groupId } = req.params;
    try {

        if(!groupId){
            return res.status(400).json({message:"group not found"})
        }
        // Find the group and populate user details
        const groupData = await Groups.findById(groupId)
            .populate({
                path: "users",
                select: "name email profile", // Select only required fields
            })

        if (!groupData) {
            return res.status(404).json({ message: "Group not found" });
        }
        const data = {groupId: groupData._id,
            groupName: groupData.groupName,
            icon: groupData.icon,
            admin: groupData.AdminId,
            users: groupData.users,
            removedMembers: groupData.removedMembers,
            addedMembers: groupData.addedMembers}

      return res.status(200).json({data:data});
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const GetUsersAllGroups = async (req, res) => {
    const { id } = req.params;
    const userId = id
    try {
        if(!id){
            return res.status(404).json({message:"user Id is required for seraching groups"})
        }

        const groups = await Groups.find({
            $or: [{ users: userId }, { AdminId: userId }]
        }).select("groupName icon");
        if(!groups){
            return res.status(404).json({message:"group not found"})
        }

        return res.status(200).json({ data: groups });
    } catch (error) {
        console.log("Error fetching groups of users:", error);
        return res.status(500).json({ message: "Error fetching user's groups", error });
    }
};

export const UpdateGroupMembers = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        // Validate input
        if (!groupId || !userId) {
            return res.status(400).json({ message: "Group ID and User ID are required" });
        }

        // Find the group first
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is already in the group
        if (group.users.includes(userId)) {
            return res.status(400).json({ message: "User is already a member of this group" });
        }

        // Add user to group
        const updatedGroup = await Groups.findByIdAndUpdate(
            groupId,
            { $push: { users: userId } }, // Push userId into the array
            { new: true } // Return the updated group
        );

        return res.status(200).json({ message: "User joined the group successfully" });

    } catch (error) {
        console.error("Error adding user to group:", error);
        return res.status(500).json({ message: "Error adding user to group", error });
    }
};

export const UpdateGroupName = async(req,res)=>{
    const {groupId,groupName}=req.body
    try {
        if(!groupId || !groupName){
            return res.status(400).json({message:"group id is requires and groupName"})
        }
        const group = await Groups.findByIdAndUpdate(groupId,{groupName,new:true})
        if(!group){
            return res.status(404).json({message:"group not found"})
        }
        return res.status(200).json({message:"group name updated sucessfully",group})
    } catch (error) {
        console.log("error updating group name",error)
        return res.status(500).json({message:"error updating group name internal server error",error})
    }
}

export const UpdateGroupIcon = async(req,res)=>{
    const {groupId,icon}=req.body
    try {
        if(!groupId || !icon){
            return res.status(400).json({message:"group id and icon is required"})
        }
        const group = await Groups.findByIdAndUpdate(groupId,{icon,new:true})
        if(!group){
            return res.status(404).json({message:"group not found"})
        }
        return res.status(200).json({message:"group icon updated sucessfully"})
    } catch (error) {
        console.log("error updating group name",error)
        return res.status(500).json({message:"error updating group icon internal server error",error})
    }
}
export const UpdateGroupAdmins = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
      if (!groupId || !userId) {
        return res.status(400).json({ message: "groupId and userId are required for making admin" });
      }
  
      const group = await Groups.findByIdAndUpdate(
        groupId,
        { $push: { AdminId: userId } }, 
        { new: true } 
      );
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      return res.status(200).json({ message: "Group admin updated successfully"});
    } catch (error) {
      console.log("Error updating group admin:", error);
      return res.status(500).json({ message: "Internal server error while updating admin", error });
    }
  };
  

export const RemoveUserFromGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        if (!groupId || !userId) {
            return res.status(400).json({ message: "User ID and Group ID are required" });
        }

        const group = await Groups.findByIdAndUpdate(
            groupId,
            { $pull: { users: userId } }, // Correct way to remove a user from the array
            { new: true } // Optional: Returns the updated document
        );

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        return res.status(200).json({ message: "User removed from group" });
    } catch (error) {
        console.error("Error removing user from group:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const DeleteGroup = async(req,res)=>{
    const {id}= req.params
    try {
        if(!id){
            return res.status(400).json({message:"group id is required to delete group"})
        }
        const group = await Groups.findByIdAndDelete(id)
        if(!group){
            return res.status(404).json({message:"group not found"})
        }
        return res.status(200).json({message:"group is deleted sucessfully"})
    } catch (error) {
        return res.status(500).json({message:"error deleting group internal server error",error})
    }
}
