import { ArrowLeft, PlusCircle, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { axiosInstance } from '../lib/axios';
import { useGetCookies } from '../store/useGetCookies';
import { useThemeStore } from '../store/useThemeStore'
import { Link } from 'react-router-dom';

const AddUsers = () => {
    const { getAllUsers, GetAllUsers, getUsersFriends, UsersFriends, getUserRequests, UsersFriendRequests } = useChatStore();
    const { authUser } = useGetCookies();
    const { theme } = useThemeStore()
    const [newFriends, setNewFriends] = useState([]);
    const [query, setQuery] = useState("");

    const filterNewFriends = () => {
        const friendIds = UsersFriends.map(friend => friend.friendId);
        const filteredUsers = GetAllUsers.filter(user =>
            user._id !== authUser &&
            !friendIds.includes(user._id) &&
            (user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()))
        );
        setNewFriends(filteredUsers);
    };

    useEffect(() => {
        getUserRequests(authUser)
        getAllUsers();
        getUsersFriends(authUser);
    }, []);

    useEffect(() => {
        filterNewFriends();
    }, [GetAllUsers, UsersFriends, query]);

    const handleAddFriend = async (data) => {
        const { _id: friendId } = data;
        try {
            const res = await axiosInstance.post('/addfriends', {
                userId: authUser,
                friendId,
            });
            alert(res.data.message);
            getUserRequests(authUser)
            getAllUsers();
            getUsersFriends(authUser);
        } catch (error) {
            console.error("Error adding friend:", error);
            alert("Unable to add friend");
        }
    };

    return (
        <div className='mt-[65px] container mx-auto h-[calc(100vh-65px)]'>
            <div className='px-4 mt-1'>
                <Link to={'/'}>
                    <button><ArrowLeft className='size-7' /></button>
                </Link>
            </div>
            <div className='w-full pt-2'>
                <div className='w-full px-4 mb-4'>
                    <div className='w-full border border-gray-300 flex items-center px-2 py-1'>
                        <Search className='size-7 text-gray-400' />
                        <input
                            type="search"
                            className={`w-full outline-none px-4 py-2 ${theme === "dark" && "bg-inherit"} `}
                            placeholder='Search Username or Email ...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className='w-full px-2 sm:px-4'>
                        {newFriends.length > 0 ? (
                            newFriends.map((v) => {
                                const userRequest = UsersFriendRequests?.friendRequests?.filter(user => user.receiverId === v._id);
                                // console.log("User's friend request:", userRequest);

                                return (
                                    <div key={v._id} className={`flex justify-between items-center w-full border-b border-gray-300 p-1 sm:p-2  ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"} transition-shadow duration-300 pr-6 sm:pr-0 sm:px-4`}>
                                        <div className='flex items-center min-w-full sm:min-w-max'>
                                            <div className="w-14 h-14">
                                                <img
                                                    src={v.profile || "no-image.png"}
                                                    alt="Profile"
                                                    className="w-full h-full max-w-full max-h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1 ">
                                                <h2 className={`text-sm sm:text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} `}>{v.name}</h2>
                                                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"} tracking-tighter sm:tracking-normal`}>{v.email}</p>
                                            </div>
                                        </div>
                                        <div className=''>
                                            {userRequest?.length > 0 ? (
                                                userRequest.some(request => request.status === "pending") ? (
                                                    <p className="text-sky-600 text-sm">Already Requested</p>
                                                ) : userRequest.some(request => request.status === "rejected") ? (
                                                    <PlusCircle onClick={() => handleAddFriend(v)} className='size-8 text-emerald-500 cursor-pointer' />
                                                ) : null
                                            ) : (
                                                <PlusCircle onClick={() => handleAddFriend(v)} className='size-8 text-emerald-500 cursor-pointer' />
                                            )}


                                        </div>
                                    </div>

                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6  rounded-lg">
                                <p className="text-lg font-semibold text-gray-500">
                                    No Users Found
                                    {query && (<>
                                        with <span className="text-red-600 font-bold"> "{query}"</span>
                                    </>)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;