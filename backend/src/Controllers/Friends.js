import ConnectDB from "../DB/ConnectDB.js"
import User from "../Models/User.js"


export const AddFriends = async (req, res) => {
    const { userId: senderId, friendId: receiverId } = req.body;

    try {
        // Validate required fields
        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Sender ID and Receiver ID are required" });
        }

        // Fetch sender and receiver from the database
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }

        // Create friend request objects
        const senderRequest = { senderId, receiverId, isSender: true };
        const receiverRequest = { senderId, receiverId, isSender: false };

        // Push to friendRequests array
        sender.friendRequests.push(senderRequest);
        receiver.friendRequests.push(receiverRequest);

        // Save both sender and receiver
        await sender.save();
        await receiver.save();

        // Retrieve last inserted request IDs
        const senderRequestId = sender.friendRequests[sender.friendRequests.length - 1]._id;
        const receiverRequestId = receiver.friendRequests[receiver.friendRequests.length - 1]._id;


        // Modify existing request objects to include IDs
        sender.friendRequests[sender.friendRequests.length - 1].documentSenderId = senderRequestId;
        sender.friendRequests[sender.friendRequests.length - 1].documentReceiverId = receiverRequestId;

        receiver.friendRequests[receiver.friendRequests.length - 1].documentSenderId = senderRequestId;
        receiver.friendRequests[receiver.friendRequests.length - 1].documentReceiverId = receiverRequestId;

        // Save again after modifying the objects
        await sender.save();
        await receiver.save();

        return res.status(200).json({ 
            message: "Friend request sent successfully", 
        });

    } catch (error) {
        console.error("Error sending request:", error);
        return res.status(500).json({ message: "Internal server error",error });
    }
};


export const GetUserFriends = async (req, res) => {
    const { id } = req.params;
    try {
                // Fetch user with populated userFriendList selecting required fields
        const user = await User.findById(id).populate(
            'userFriendList',
            'name email profile status _id'
        );

        if (!user || !user.userFriendList.length) {
            return res.status(200).json({ message: "User's friend list is empty" });
        }
        
        // Format response
        const friends = user.userFriendList.map(friend => ({
            friendId: friend._id,
            name: friend.name,
            email: friend.email,
            profile: friend.profile,
            status: friend.status,
        }));

        return res.status(200).json({ data:friends });
    } catch (error) {
        console.error("Error fetching user's friends", error);
        return res.status(500).json({ message: "Error fetching user friends from server",error });
    }
};


export const DeleteFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        if (!userId || !friendId) {
            return res.status(400).json({ message: "User ID and Friend ID are required for removal." });
        }

        // Remove the friend from the user's friend list and delete the friend request
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $pull: { 
                    userFriendList: friendId, 
                    friendRequests: { 
                        $or: [
                            { senderId: friendId, receiverId: userId }, 
                            { senderId: userId, receiverId: friendId }
                        ] 
                    } // Completely remove the request
                }
            },
            { new: true }
        ).populate("userFriendList", "name email profile status _id");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Friend removed successfully, and friend request deleted.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Failed to remove friend." });
    }
};




export const GetUserFriendsRequest = async (req,res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(400).json({message:"user id is required"})
        }
        const user = await User.findById(id).select('friendRequests')
        if(!user){
            return res.status(404).json({message:"user is not found"})
        }
        
        return res.status(200).json({data:user})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error. Failed to get user friends request." });
    }
}

export const GetUserFriendsRequestProfiles = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(id)
            .select('friendRequests')
            .populate({
                path: 'friendRequests.senderId friendRequests.receiverId',
                select: 'name email profile _id'
            });
            

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ data: user.friendRequests });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error. Failed to get user friend requests." });
    }
};




export const AcceptFriendRequest = async (req, res) => {
    const { documentSenderId, documentReceiverId, senderId, receiverId } = req.body;

    try {
        if (!documentSenderId || !documentReceiverId || !senderId || !receiverId) {
            return res.status(400).json({ message: "All IDs are required" });
        }

        // Update friend request status to "accepted" for sender
        await User.findOneAndUpdate(
            { _id: senderId, "friendRequests._id": documentSenderId },
            {
                $set: { "friendRequests.$.status": "accepted" },
                $addToSet: { userFriendList: receiverId } // Prevent duplicate friend entries
            }
        );

        // Update friend request status to "accepted" for receiver
        await User.findOneAndUpdate(
            { _id: receiverId, "friendRequests._id": documentReceiverId },
            {
                $set: { "friendRequests.$.status": "accepted" },
                $addToSet: { userFriendList: senderId }
            }
        );

        return res.status(200).json({ message: "Friend request accepted successfully" });

    } catch (error) {
        console.error("Error accepting request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const CancelFriendRequest = async (req, res) => {
    const { documentSenderId, documentReceiverId, senderId, receiverId } = req.body;

    try {
        if (!documentSenderId || !documentReceiverId || !senderId || !receiverId) {
            return res.status(400).json({ message: "All IDs are required" });
        }

        // Update friend request status to "rejected" for sender
        await User.findOneAndUpdate(
            { _id: senderId, "friendRequests._id": documentSenderId },
            { $set: { "friendRequests.$.status": "rejected" } }
        );

        // Update friend request status to "rejected" for receiver
        await User.findOneAndUpdate(
            { _id: receiverId, "friendRequests._id": documentReceiverId },
            { $set: { "friendRequests.$.status": "rejected" } }
        );

        return res.status(200).json({ message: "Friend request canceled successfully" });

    } catch (error) {
        console.error("Error canceling request:", error);
        return res.status(500).json({ message: "Internal server error",error });
    }
};








