import React from 'react'
import { X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useThemeStore } from '../store/useThemeStore';


const MessageHeader = ({ setSelectedUser }) => {

    function formatMessageTime(date) {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
      
        const formattedTime = new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      
        return `${formattedDate} ${formattedTime}`;
      }

    const { GetSelectedUserProfile, upDataSelectedUser } = useChatStore()
    const { theme } = useThemeStore()
    return (
        <div className='flex px-2 py-1 justify-between items-center border border-gray-500'>
            <div className='flex'>
                <div className='size-14'>
                    <img src={GetSelectedUserProfile.profile || "no-image.png"}
                        alt="Profile"
                        referrerPolicy='no-reffer'
                        className="w-full h-full object-cover rounded-full " />
                </div>
                <div className='px-4 py-1'>
                    <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"} `}>{GetSelectedUserProfile.name}</h2>
                    <span className={`text-sm font-medium ${GetSelectedUserProfile.status === "online" ? "text-green-500" : ""}`}>
                        {GetSelectedUserProfile.status === "online" ? "online" : formatMessageTime(GetSelectedUserProfile.lastSeen)}
                    </span>
                </div>
            </div>
            <div>
                <button>
                    <X onClick={() => {
                        setSelectedUser(null);
                        upDataSelectedUser(null)
                    }} className='size-6' />
                </button>
            </div>
        </div>)
}

export default MessageHeader