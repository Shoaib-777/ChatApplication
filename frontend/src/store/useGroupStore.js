import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { useGetCookies } from './useGetCookies'

export const useGroupStore = create((set,get)=>({
    UserAvailable:[],
    LoadingGroupUsers:false,
    GetUserGroups:[],
    GroupSelectedId:null,
    LoadingGroupsChats:false,
    GroupSelectedData:[],
    SendingMessage:false,
    GroupUsersProfile:[],
    getAvailableUser:async(userId)=>{
        try {
            const res = await axiosInstance.get(`/addfriends/${userId}`)
            set({UserAvailable:res.data.data || [] })
            // console.log("iam avilable user",res.data.data)
        } catch (error) {
            console.log("error fetching available users",error)
        }
    },
    getUserGroups:async(userId)=>{
        if(!userId){
            return
        }
        try {
            set({LoadingGroupUsers:true})
            const res = await axiosInstance.get(`/groups/groups/${userId}`)
            set({GetUserGroups:res.data.data})
            // console.log("fetch user groups ",res.data.data)
        } catch (error) {
            console.log("error fetching user groups",error)
        }finally{
            set({LoadingGroupUsers:false})
        }
    },
    setGroupSelectedId:(id)=>{
        set({GroupSelectedId:id})
    },
    sendGroupMessage:async(message,DownloadUrl,GroupSelectedId,authUser)=>{
        set({SendingMessage:true})
        try {
            const res = await axiosInstance.post(`/groups/send`,{message,image:DownloadUrl,groupId:GroupSelectedId,senderId:authUser})
            // console.log("message send sucessfully!",res.data)
            // set((state)=>({ GroupSelectedData: [...state.GroupSelectedData, res.data.messageData.message] }))
            set((state) => {
                const isDuplicate = state.GroupSelectedData.some(msg => msg._id === res.data.messageData._id);
                if (!isDuplicate) {
                    console.log("iam duplicating")
                    return { GroupSelectedData: [...(state.GroupSelectedData || []), res.data.messageData.message] };
                }
                return state;
            });
        } catch (error) {
            console.log("error sending group message",error)
        }finally{
            set({SendingMessage:false})
        }
    },
    GetGroupSelectedData:async(groupId)=>{
        if(!groupId) return
        try {
            set({LoadingGroupsChats:true})
            const res = await axiosInstance.get(`groups/${groupId}`)
            set({GroupSelectedData:res.data.messages})
            // console.log("iam group messages",res.data.messages)
        } catch (error) {
            console.log("error fetching group messages")
        }finally{
            set({LoadingGroupsChats:false})
        }
    },
    GetUsersGroupProfile:async(groupId)=>{
        if(!groupId) return
        try {
            const res = await axiosInstance.get(`/groups/group/${groupId}`)
            set({GroupUsersProfile:res.data.data})
            // console.log("iam group profiles users",res.data.data)
        } catch (error) {
            console.log("error fetching users profiles",error)
        }
    },
    SetGroupSelectedId:()=>{
        set({GroupSelectedId:null})
    },
    subscribeToGroupMessages: () => {
            const { GroupSelectedId } = get();
            if (!GroupSelectedId) return;
    
            const socket = useGetCookies.getState().socket;
               // Remove previous event listener to prevent duplicate listeners
    socket.off("newGroupMessage");
    
            socket.on("newGroupMessage", (newMessage) => {
                if (newMessage.groupId !== GroupSelectedId) return;
                set({
                    GroupSelectedData: [...get().GroupSelectedData,newMessage],
                });
            });
        },
    
        unsubscribeFromGroupMessages: () => {
            const socket = useGetCookies.getState().socket;
            if (!socket) return;
            socket.off("leaveGroup");
        },
}))