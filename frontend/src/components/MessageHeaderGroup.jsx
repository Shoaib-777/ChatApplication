import React, { useEffect } from 'react'
import { X } from 'lucide-react';
import { useGroupStore } from '../store/useGroupStore';
import { useGetCookies } from '../store/useGetCookies';
import { useThemeStore } from '../store/useThemeStore';

const MessageHeaderGroup = ({ setGroupInfo }) => {
    const { GroupSelectedId, setGroupSelectedId, GetUsersGroupProfile, GroupUsersProfile } = useGroupStore();
    const { authUser } = useGetCookies()
    const {theme} = useThemeStore()
    const handleBack = () => {
        setGroupSelectedId(null);
    };



    useEffect(() => {
        GetUsersGroupProfile(GroupSelectedId);
    }, [GroupSelectedId, GetUsersGroupProfile]);

    return (
        <>
            <div className='relative'>
                <div className='flex px-2 py-1 justify-between items-center border border-gray-500'>
                    <div className='flex'>
                        <div className='size-14'>
                            <img src={GroupUsersProfile?.icon || "no-image.png"}
                                alt="Profile"
                                referrerPolicy='no-referrer'
                                className="w-full h-full object-contain rounded-full border border-gray-300 " />
                        </div>
                        <div onClick={() => setGroupInfo(true)} className='px-4 py-1 cursor-pointer'>
                            <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{GroupUsersProfile?.groupName || "Unknown Group"}</h2>
                            <div className='flex items-center gap-x-1 overflow-x-auto'>
                                <span className='text-base font-medium text-emerald-500'>View Group Details</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleBack}>
                            <X className='size-6' />
                        </button>
                    </div>
                </div>
            </div>
        </>);
};

export default MessageHeaderGroup;
