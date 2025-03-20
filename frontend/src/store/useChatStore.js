import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useGetCookies } from "./useGetCookies";

export const useChatStore = create((set, get) => ({
    Messages: [],
    UsersFriends: [],
    GetAllUsers: [],
    UsersFriendRequests:[],
    UsersFriendRequestsProfiles:[],
    LoadingAllUsers: false,
    GetSelectedUserProfile: [],
    MessagingLoding: false,
    UsersFriendsLoading: false,
    UserProfile: false,
    SelectedUser: null,

    // todo user id is : 679f4fc5b9f8bcb06106f595
    getUsersFriends: async (userId) => {
        try {
            set({ UsersFriendsLoading: true })
            const res = await axiosInstance.get(`/addfriends/${userId}`)
            set({ UsersFriends: res.data.data || [] })
        } catch (error) {
            console.log("error fetching users", error)
        } finally {
            set({ UsersFriendsLoading: false })
        }
    },

    sendMessage: async (authUser,selectedUser,texts,imagePreview) => {
        try {
            const res = await axiosInstance.post('/user/message', {
                senderId: authUser,
                receiverId: selectedUser,
                message: texts,
                image: imagePreview,
            })
            set((state) => ({ Messages: [...(state.Messages || []), res.data.newMssg] }));            
        } catch (error) {
            console.log("error sending message", error)
        }
    },
    upDataSelectedUser :(userId)=>{
        set({SelectedUser:userId})
    },

    getSelectedUserMessages: async (userId) => {
        if (userId) {

            try {
                set({ MessagingLoding: true })
                const res = await axiosInstance.get(`/user/message/${userId}`)
                set({ Messages: res.data.data })
            } catch (error) {
                console.log("error fetching user chat", error)
            } finally {
                set({ MessagingLoding: false })
            }
        }
    },
    getSelectedUserProfile: async (userId) => {
        if (userId) {
            try {
                set({ UserProfile: true })
                const res = await axiosInstance.get(`/users/${userId}`)
                set({GetSelectedUserProfile:res.data.data})
                // console.log("iam user profile", res.data.data)
            } catch (error) {
                console.log("error fetching user Profile", error)
            } finally {
                set({ UserProfile: false })
            }
        }
    },getUserRequests:async(userId)=>{
        try {
            const res = await axiosInstance.get(`/addfriends/request/${userId}`)
            set({UsersFriendRequests:res.data.data})
            // console.log("iam requests",res.data.data)
        } catch (error) {
            console.log("error fetching user friends requests")
        }
    },
    getUserRequestsProfiles:async(userId)=>{
        if(!userId) return
        try {
            const res = await axiosInstance.get(`/addfriends/request/profiles/${userId}`)
            set({UsersFriendRequestsProfiles:res.data.data})
            // console.log("iam requests",res.data.data)
        } catch (error) {
            console.log("error fetching user friends requests")
        }
    },
    getAllUsers: async () => {
        try {
            set({ LoadingAllUsers: true })
            const res = await axiosInstance.get('/users')
            set({ GetAllUsers: res.data.data })
            // console.log("iam all users", res.data.data)
        } catch (error) {
            console.log("error fetching all users in platform ", error)
        } finally {
            set({ LoadingAllUsers: false })
        }
    }, subscribeToMessages: () => {
        const { SelectedUser } = get();
        if (!SelectedUser) return;

        const socket = useGetCookies.getState().socket;

        socket.on("newMssg", (newMssg) => {
            const isMessageSentFromSelectedUser = newMssg.senderId === SelectedUser;
            if (!isMessageSentFromSelectedUser) return;

            set({
                Messages: [...get().Messages, newMssg],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useGetCookies.getState().socket;
        if (!socket) return;
        socket.off("newMssg");
    },

}))