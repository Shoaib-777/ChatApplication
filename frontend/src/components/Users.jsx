import { EllipsisVertical, Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useChatStore } from '../store/useChatStore';
import { useGetCookies } from '../store/useGetCookies';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import UsersLoading from './loading/UsersLoading';

const Users = ({ query, setQuery, searchUser, selectedUser, setSelectedUser ,showUserOnly,setShowUserOnlyOnline }) => {
  const { getUsersFriends, UsersFriends, UsersFriendsLoading, upDataSelectedUser } = useChatStore()
  const { authUser } = useGetCookies()
  const [showSettings, setShowSettings] = useState("")

  const deleteFriend = async (friendId) => {
    try {
      const res = await axiosInstance.put(`/addfriends/${friendId}`, { userId: authUser, friendId })
      console.log(res.data.message || "friend remove sucessfully")
      alert("friend deleted sucessfully")
      setSelectedUser(null)
      upDataSelectedUser(null)
      setShowSettings("")
      getUsersFriends(authUser)
    } catch (error) {
      console.log("error deleting friend", error)
    }
  }

  const filteredUsers = showUserOnly
    ? UsersFriends.filter((user) => user.status === "online")
    : UsersFriends;

  // useEffect(()=>{

  // },[query])

  useEffect(() => {
    getUsersFriends(authUser)
  }, [])

  const { theme } = useThemeStore()


  if (UsersFriendsLoading) return <UsersLoading />

  return (
    <div className='relative'>
      <div className='h-[calc(100vh-200px)] overflow-y-auto'>


        {!query ? (
          UsersFriends.length > 0 ? (
            filteredUsers.map((v, i) => (
              <div key={i} className={`flex   items-center w-full border-b border-gray-300 p-2 ${theme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"} transition-shadow duration-300 `} style={{
                background:
                  v.friendId === selectedUser
                    ? theme === "dark"
                      ? "#374151" // Tailwind gray-600 for dark mode
                      : "#F3F4F6" // Light mode background
                    : "",
              }}
              >
                {/* todo image url change  */}
                <div className="w-14 h-14">
                  <img
                    src={v.profile || "no-image.png"}
                    alt="Profile"
                    className="w-full h-full  object-cover rounded-full "
                  />
                </div>
                <div onClick={() => {
                  setSelectedUser(v.friendId);
                  setQuery("")
                  upDataSelectedUser(v.friendId)
                }} className="ml-4 flex-1 ">
                  <h2 className={`text-lg font-bold  ${theme === "dark" ? "text-gray-200" : "text-gray-800"} `}>{v.name}</h2>
                  <span className={`text-sm font-medium ${v.status === "online" ? "text-green-500" : "text-red-500"}`}>
                    {v.status}
                  </span>
                </div>
                <div className='relative'>
                  <EllipsisVertical onClick={() => setShowSettings(v.friendId)} className=' size-6 cursor-pointer' />
                  <div className={` ${v.friendId === showSettings ? "absolute " : " hidden"} top-7 -left-[5rem] bg-white z-10 border border-black`}>
                    <div className='flex flex-col items-center justify-center text-black font-medium w-full'>
                      <div>
                        <button onClick={() => deleteFriend(v.friendId)} className='px-2 py-1 hover:bg-gray-200 text-nowrap hover:text-red-600'>Delete Friend</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className={`flex flex-col items-center justify-center h-[250px] p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <div className={`shadow-lg rounded-xl p-6 text-center w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h2 className="text-lg font-semibold">You have no friends yet</h2>
                <p className="text-sm mt-2">Start adding friends to connect and chat.</p>
                <Link to="/adduser"><button
                  className="mt-3 btn btn-primary w-full"
                >
                  Add Friends
                </button></Link>
              </div>
            </div>
          )
        ) : (
          searchUser.length > 0 ? (
            filteredUsers.map((v, i) => (
              <div key={i} className={`flex   items-center w-full border-b border-gray-300 p-2 ${theme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"} transition-shadow duration-300`} style={{
                background: v.friendId === selectedUser ? "#F3F4F6" : "",
              }}>
                <div className="w-14 h-14">
                  <img
                    src={v.profile || "no-image.png"}
                    alt="Profile"
                    className="w-full h-full  object-cover rounded-full "
                  />
                </div>
                <div onClick={() => {
                  setSelectedUser(v.friendId);
                  upDataSelectedUser(v.friendId)
                }} className="ml-4 flex-1 ">
                  <h2 className={`text-lg font-bold  ${theme === "dark" ? "text-gray-200" : "text-gray-800"} `}>{v.name}</h2>
                  <span className={`text-sm font-medium ${v.status === "online" ? "text-green-500" : "text-red-500"}`}>
                    {v.status}
                  </span>
                </div>
                <div className='relative'>
                  <EllipsisVertical onClick={() => setShowSettings(v.friendId)} className=' size-6 cursor-pointer' />
                  <div className={` ${v.friendId === showSettings ? "absolute " : " hidden"} top-7 -left-[5rem] bg-white z-10 border border-black`}>
                    <div className='flex flex-col items-center justify-center text-black font-medium w-full'>
                      <div>
                        <button onClick={() => deleteFriend(v.friendId)} className='px-2 py-1 hover:bg-gray-200 text-nowrap hover:text-red-600'>Delete Friend</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6  rounded-lg">
              <p className="text-lg font-semibold text-gray-700">
                No Friends Found with
                <span className="text-red-600 font-bold"> "{query}"</span>
              </p>
            </div>
          )
        )}


        <div className='w-full h-16'>
          <div className='flex justify-center items-center gap-x-2 py-1 '>
            <div>
              <Lock className='size-6 font-bold' />
            </div>
            <div>
              <p className='text-base font-semibold '>
                All Messages Are <span className='text-blue-400'>end-to-end-encrypted</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => setShowSettings("")} className={` ${showSettings ? "absolute" : "hidden"}  w-full -top-40 left-0 h-[calc(100vh-20px)] bg-black opacity-5`}>
      </div>
    </div>
  );
};

export default Users;
