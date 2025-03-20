import React, { useEffect, useRef, useState } from 'react'
import MessageHeaderGroup from './MessageHeaderGroup'
import MessageInputGroup from './MessageInputGroup'
import { ArrowLeft, Camera, Check, EllipsisVertical, LogOut, Pencil, Plus, Search, Trash2, UserRoundPlus, X } from 'lucide-react'
import Loading from './Loading'
import { axiosInstance } from '../lib/axios'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../ImageUpload-FDB/FirebaseConfig'
import { useGetCookies } from '../store/useGetCookies'
import GroupChatsLoading from '../components/loading/GroupChatsLoading'
import { useThemeStore } from '../store/useThemeStore'


const MessageContainerGroup = ({ message, setMessage, image, setImage, handleImageUpload, handleCancel, handleSubmit,GroupSelectedData, LoadingGroupsChats,  GroupUsersProfile, GetUsersGroupProfile, GroupSelectedId, SetGroupSelectedId, getAllUsers, LoadingAllUsers, GetAllUsers, groupInfo, setGroupInfo, showEdit, setShowEdit, groupname, setGroupName, initialName, setInitialName, isNameChanged, setIsNameChanged, showAvailableUsers, setShowAvailableusers, notInGroupUsers, setNotInGroupUsers, query, setQuery, searchUser, setSearchUser, previewIcon, setPreviewIcon, icon, seticon, showDeleteGroupPopUp, setShowDeleteGroupPopUp, showExitGroupPopUp, setShowExitGroupPopUp ,showOptions, setShowOptions }) => {
 const {theme}=useThemeStore()
 const messageEndRef = useRef(null)
 const [selectedImage, setSelectedImage] = useState(null);

 const scrollToBottom = ()=>{
  messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
 }

  const {authUser}=useGetCookies()

  const handleBack = () => {
    setGroupInfo(false)
    setShowEdit(false)
  }
  const handleChange = (e) => {
    const newValue = e.target.value;
    setGroupName(newValue);
    setIsNameChanged(newValue !== initialName);
  }

  const handleAddMembers = () => {
    setShowAvailableusers(true)
    Getusers()
  }

  const AddUserInGroup = async (userId) => {
    try {
      const res = await axiosInstance.put(`/groups/update`, {
        groupId: GroupSelectedId,
        userId,
      });
      // console.log("Joined Group Successfully", res.data.message);
      setNotInGroupUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
      setSearchUser((prevUsers) => prevUsers.filter(user => user._id !== userId));
      GetUsersGroupProfile(GroupSelectedId)
    } catch (error) {
      console.log("Error joining the group", error);
    }
  };

  // Fetch users initially
  const Getusers = () => {
    getAllUsers(); // Ensure the users are fetched first
  };

  useEffect(() => {
    if (GetAllUsers.length > 0 && GroupUsersProfile?.users) {
      filterData();
    }
  }, [GetAllUsers, GroupUsersProfile]);
   // Ensuring the filter runs only when users are fetched

  const filterData = () => {
    const UserInGroupIds = GroupUsersProfile.users.map((user) => user._id);
    const AllUserIds = GetAllUsers.filter((user) => !UserInGroupIds.includes(user._id));
    
    setNotInGroupUsers(AllUserIds);
  };

  useEffect(() => {
    if (query) {
      const filteredUsers = notInGroupUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchUser(filteredUsers);
    } else {
      setSearchUser(notInGroupUsers);
    }
  }, [query, notInGroupUsers]);

  const handleEditClick = () => {
    setGroupName(GroupUsersProfile?.groupName || ''); // Ensure input is populated with the latest group name
    setInitialName(GroupUsersProfile?.groupName || '');
    setShowEdit(true);
  }

  const handleUpdateName = async () => {
    try {
      const res = await axiosInstance.put(`/groups/update/groupname`, { groupId: GroupSelectedId, groupName: groupname })
      // console.log("updated group name sucessfully!", res)
      GetUsersGroupProfile(GroupSelectedId)
      setInitialName(groupname); // Update the initial name after success
      setIsNameChanged(false); // Reset change state
      setShowEdit(false);
    } catch (error) {
      console.log("error updating group name")
    }
  }

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewIcon(url)
      seticon(file)
    }
  }
  const handleCancelIcon = () => {
    setPreviewIcon("")
    seticon(null)
  }

  const UpdateGroupIcon = async () => {
    try {
      const storageRef = ref(storage, `Chat-App/GroupIcons/${Date.now()}`)
      await uploadBytes(storageRef, icon)
      const url = await getDownloadURL(storageRef)
      const res = await axiosInstance.put(`/groups/update/icon`, { groupId: GroupSelectedId, icon: url })
      // console.log("group icon updated sucessfully", res)
      seticon(null)
      setPreviewIcon("")
      GetUsersGroupProfile(GroupSelectedId)
    } catch (error) {
      console.log("error updating group icon", error)
    }
  }

  const handleRemoveUser = async (userId) => {
    try {
      const res = await axiosInstance.put(`/groups/removeuser`, { groupId: GroupSelectedId, userId })
      console.log("user removed sucessfully")
      GetUsersGroupProfile(GroupSelectedId)
      setShowOptions("")
    } catch (error) {
      console.log("error removing user from group", error)
    }
  }

  const handleMakeAdmin = async(userId)=>{
    try {
      const res = await axiosInstance.put(`/groups/update/admin`,{groupId:GroupSelectedId,userId})
      GetUsersGroupProfile(GroupSelectedId)
      setShowOptions("")
      // console.log("updated group admins",res)
    } catch (error) {
      console.log("error making user as a admin",error)
    }
  }

  const handleDeleteGroup = async () => {
    try {
      const res = await axiosInstance.delete(`/groups/${GroupSelectedId}`)
      console.log("group deleted sucessfully", res)
      handleBack()
      SetGroupSelectedId()
    } catch (error) {
      console.log("error deleting group", error)
    }
  }

  useEffect(()=>{
    scrollToBottom()
  },[GroupSelectedData])

  

  if(LoadingGroupsChats) return <GroupChatsLoading  message={message} setMessage={setMessage} image={image} setImage={setImage} handleImageUpload={handleImageUpload} handleCancel={handleCancel} handleSubmit={handleSubmit}/>

  return (
    <div className='w-full h-[calc(100vh-65px)] flex flex-col justify-between  max-w-lg lg:max-w-full mx-auto border-x border-gray-500 lg:border-none'>

      {groupInfo ? (
        <div className='w-full h-full overflow-y-auto'>
          {/* close header  */}
          <div className='w-full h-10 px-4 py-2 flex items-center gap-x-4'>
            <div>
              <X onClick={handleBack} className={`${theme === "dark" ? "text-gray-100 ":"text-black"} size-6`} />
            </div>
            <div>
              <span className={`text-base font-normal ${theme === "dark" ? "text-gray-100 ":"text-black"} `}>Group Info</span>
            </div>
          </div>
          <div className='w-full h-[300px] flex flex-col justify-center items-center'>
            <div className=' w-[250px] h-[250px] flex justify-center items-center border border-primary rounded-full relative'>
              <img src={previewIcon || GroupUsersProfile.icon || '/no-image.png'} alt="no profile" className='w-[85%] h-[85%] rounded-full object-contain' />
              <div className='absolute bottom-0 right-[60px]'>
                <input type="file" hidden id='icon' onChange={handleIconChange} />
                <label htmlFor='icon'><Camera className={`${previewIcon ? "hidden" : ""} size-6 ${theme === "dark" ? "text-gray-300 bg-gray-800":" text-black bg-white"}  cursor-pointer`} /></label>
                <div onClick={UpdateGroupIcon} className={`${previewIcon ? "block" : "hidden"} size-7 bg-emerald-600 rounded-full flex justify-center items-center cursor-pointer`}>
                  <Check className='size-6 rounded-full text-white' />
                </div>
              </div>
              <div className='absolute bottom-0 left-[60px]'>
                <div onClick={handleCancelIcon} className={`${previewIcon ? "block" : "hidden"} flex justify-center items-center size-7 rounded-full bg-red-700 cursor-pointer`}>
                  <X className='size-6 text-white' />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col justify-center items-center mb-1'>
            {showEdit ? (
              <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-full flex justify-center items-center'>
                  <input type="text" className={`w-full max-w-[70%] px-4 py-1  outline-none border-b border-emerald-600 ${theme === "dark" && "text-white bg-gray-700"}`}
                    value={groupname}
                    onChange={handleChange}
                  />
                </div>
                <div className='mt-2 space-x-4'>
                  <button onClick={() => setShowEdit(false)} className='px-4 py-1 font-bold bg-red-500 hover:bg-red-700 rounded-lg text-white'>Cancel</button>
                  <button
                    onClick={handleUpdateName}
                    disabled={!isNameChanged}
                    className={`${!isNameChanged ? " cursor-not-allowed bg-[#A0A0A0]" : "bg-green-500 hover:bg-green-700"} px-4 py-1 font-bold  rounded-lg text-white`}>Update</button>
                </div>
              </div>
            ) : (
              <div className='flex gap-x-3'>
                <div>
                  <h5 className='font-semibold text-lg '>{GroupUsersProfile.groupName}</h5>
                </div>
                <div>
                  <Pencil onClick={handleEditClick} className='size-6 text-gray-400 ' />
                </div>
              </div>
            )}
            <span className=''>Group Members: {GroupUsersProfile.users?.length}</span>
          </div>
          <div className='w-full px-4 border border-gray-300 shadow-xl relative'>
            <div className={` ${showAvailableUsers ? "block absolute" : "hidden"} top-0 right-0 w-full border border-black z-20 ${theme === "dark" ? "bg-gray-700" : "bg-white"} px-2 py-3`}>
              <div className='mb-1'>
                <ArrowLeft onClick={() => setShowAvailableusers(false)} className={`size-7 ${theme === "dark" ? "text-white":"text-black"} `} />
              </div>
              <div className={`flex items-center gap-x-2 shadow-2xl border  border-gray-300 rounded-3xl px-2`}>
                <div>
                  <Search className={`size-6  ${theme === "dark" ? "text-white ":"text-black"} cursor-pointer `} />
                </div>
                <input type="search" className={`px-4 py-2 w-full  outline-none ${theme === "dark" ? "bg-inherit border-l border-white":""} `} placeholder='Friends ...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className='w-full px-2 mt-2 overflow-y-auto'>
                {LoadingAllUsers ? (
                  <div className='w-full mt-1 '>
                    <Loading />
                  </div>
                ) : searchUser?.length > 0 ? (
                  searchUser.map((v) => (
                    <div
                      key={v._id}
                      className={`w-full flex items-center gap-x-4 border-b border-gray-300 mb-1 py-1`}
                    >
                      {/* Profile Image */}
                      <div className="min-w-10 min-h-10 border border-gray-400 flex justify-center items-center rounded-full">
                        <img
                          src={
                            v.profile ||
                            "https://firebasestorage.googleapis.com/v0/b/admin-dashboard-b87b4.appspot.com/o/Chat-App%2FGroupIcons%2F1739177092626?alt=media&token=44afc714-aa62-43fc-834c-02aa0abf03a5"
                          }
                          alt="profile"
                          className="min-w-full min-h-full max-w-10 max-h-10 object-cover rounded-full  shadow-xl"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 flex flex-col">
                        <h2 className="font-bold text-sm sm:text-lg">{v.name}</h2>
                        <span className="font-light text-sm sm:text-base">{v.email}</span>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => AddUserInGroup(v._id)}
                        className="size-10 bg-emerald-500 rounded-full flex justify-center items-center"
                      >
                        <Plus className="size-6 text-white" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div>No User Found</div>
                )}
              </div>
            </div>
            <div className='w-full border-b border-gray-300 py-1'>
              <div onClick={handleAddMembers} className={`w-full flex items-center gap-x-4 mb-1 cursor-pointer ${theme === "dark" && "bg-gray-700 px-2 py-1 "}`}>
                <div className='rounded-full p-2 bg-emerald-600'>
                  <UserRoundPlus className='size-8 text-white' />
                </div>
                <div>
                  <h4 className={`${theme === "dark" ? "text-white " : "text-black"} font-bold text-lg`}>Add Members</h4>
                </div>
              </div>
              {GroupUsersProfile.users
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => (a._id === authUser ? -1 : b._id === authUser ? 1 : 0)) // Prioritize authUserId
                .map((v) => {
                  return (
                    <div key={v._id} className={`w-full h-16 flex items-center gap-x-4 ${theme === "dark" ? "hover:bg-gray-800":"hover:bg-gray-200"} border-b border-gray-300`}>
                      <div className='w-14 h-14 flex justify-center items-center rounded-full border border-gray-300'>
                        <img
                          src={
                            v.profile ||
                            "/no-image.png"
                          }
                          alt="profile"
                          className='w-full h-full object-cover rounded-full'
                        />
                      </div>
                      <div className='w-full flex flex-col h-full relative'>
                        <div>
                          <h4 className='font-bold'>{v._id === authUser ? "you" : v.name}</h4>
                        </div>
                        <div className='w-full'>
                          <p className='font-light'>{v.email}</p>
                        </div>
                        <div className={`${GroupUsersProfile.admin?.includes(v._id) ? "block absolute" : "hidden"} top-1 right-0`}>
                          <span className='text-sky-600 font-bold px-2 py-[2px] bg-sky-100 rounded-lg'>Admin</span>
                        </div>
                        {GroupUsersProfile.admin?.includes(authUser) && ( // Check if the logged-in user is an admin
                          <div className={`${GroupUsersProfile.admin?.includes(v._id) ? "hidden" : "block absolute"} top-6 right-0`}>
                            <span onClick={()=>setShowOptions(v._id)} 
                            
                            className=' font-bold rounded-lg cursor-pointer'><EllipsisVertical className='size-6 '/></span>
                            <div className={` ${showOptions === v._id ? "block":" hidden "} w-[150px] bg-white  z-30 absolute -left-[7rem] top-0 border border-white`}>
                              <button
                              onClick={()=> handleMakeAdmin(v._id)}
                              className='w-full text-black font-bold hover:bg-gray-200 px-2 py-1 hover:text-sky-600 border-b border-gray-300'>Make Admin</button>
                              <button onClick={() => handleRemoveUser(v._id)} className='w-full text-black font-bold hover:bg-gray-200 px-2 py-1 hover:text-red-600 border-b border-gray-300'>Remove</button>
                            </div>
                          </div>
                        )}
                        <div onClick={()=>setShowOptions("")} className={` ${showOptions ? "fixed":"hidden"}  w-screen h-screen top-0 left-0 opacity-15 bg-black`}>

                        </div>
                      </div>
                    </div>
                  );
                })}

              <div onClick={() => {
                setShowExitGroupPopUp(false);
                setShowDeleteGroupPopUp(false);
              }}
                className={`${showDeleteGroupPopUp || showExitGroupPopUp ? "fixed" : "hidden"} inset-0 bg-black bg-opacity-50 flex justify-center items-center`}>
                {showDeleteGroupPopUp && (
                  <div className={`p-6 rounded-lg shadow-lg w-80 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                  <h2 className="text-lg font-semibold">Are you sure?</h2>
                  <p className="mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">You want to delete the group</p>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setShowDeleteGroupPopUp(false)}
                      className={`px-4 py-2 rounded-md hover:bg-gray-400 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteGroup}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      OK
                    </button>
                  </div>
                </div>
                )}
                {showExitGroupPopUp && (
                  <div className={`p-6 rounded-lg shadow-lg w-80 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                  <h2 className="text-lg font-semibold">Are you sure?</h2>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>You want to exit the group</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setShowExitGroupPopUp(false)}
                      className={`px-4 py-2 rounded-md hover:bg-gray-400 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleRemoveUser(authUser);
                        SetGroupSelectedId();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      OK
                    </button>
                  </div>
                </div>
                )}
              </div>
              <div className='mt-1'>
                {GroupUsersProfile.admin?.includes(authUser) ? (
                  <button onClick={() => setShowDeleteGroupPopUp(true)} className='px-4 py-2 bg-red-500 hover:bg-red-600 flex items-center gap-x-2 text-white rounded-lg '>
                    <Trash2 className='size-6' />
                    <span className='font-bold'>Delete This Group</span>
                  </button>
                ) : (
                  <button onClick={() => setShowExitGroupPopUp(true)} className='px-4 py-2 bg-red-500 hover:bg-red-600 flex items-center gap-x-2 text-white rounded-lg '>
                    <LogOut className='size-6' />
                    <span className='font-bold'>Exit From Group</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ProfileMessageHeader */}
          <div className='w-full'>
            <MessageHeaderGroup setGroupInfo={setGroupInfo} />
          </div>
          {/* Message */}
          <div className='h-[calc(100vh-188px)] overflow-y-auto '>

{/*            <div className="flex-1  p-4 space-y-4">

              {Array.isArray(GroupSelectedData) && GroupSelectedData.length > 0 ? (
                GroupSelectedData.map((message,i) => (
                  <div
                    key={message._id || i} // Use message.id if available
                    className={`chat ${message.senderId === authUser ? "chat-end" : "chat-start"
                      }`}
                  >
                    <div className="chat-image avatar">
                      <div className="size-10 rounded-full border">
                        <img
                          src={
                            message.senderId === authUser
                              ? "no-image.png"
                              : "no-image.png"
                          }
                          alt={`${message.senderName || "User"}'s profile picture`}
                        />
                      </div>
                    </div>
                    <div className="chat-header mb-1">
                      <time className="text-xs opacity-50 ml-1">
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                    <div className={`chat-bubble flex flex-col ${theme === "dark" ? " bg-gray-600" : "bg-sky-500"}`}>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />
                      )}
                      {message.message && <p className={`${theme === "dark" && "text-gray-100"}`}>{message.message}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center w-full'>Start Conversation </div>
              )}
              <div ref={messageEndRef}/>
            </div>
*/}

<div className="flex-1 p-4 space-y-4">
  {Array.isArray(GroupSelectedData) && GroupSelectedData.length > 0 ? (
    GroupSelectedData.map((message, i) => {
      // Find the sender details from users array
      const sender = GroupUsersProfile?.users?.find(user => user._id === message.senderId);
      console.log("iam sender",sender)

      return (
        <div
          key={message._id || i}
          className={`chat ${message.senderId === authUser ? "chat-end" : "chat-start"}`}
        >
          {/* Profile Image */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={sender?.profile || "no-image.png"}
                alt={`${sender?.name || "User"}'s profile picture`}
              />
            </div>
          </div>

          {/* Sender Name */}
          <div className="chat-header mb-1">
            <span className="font-semibold">{sender?._id === authUser ? "you" : sender?.name || "Unknown User"}</span>
          </div>

          {/* Message Content */}
          <div className={`chat-bubble flex flex-col ${theme === "dark" ? "bg-gray-600" : "bg-sky-500"}`}>
          {message.image && (
                    <div>
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                        onClick={() => setSelectedImage(message.image)}
                      />
                      <button
                        onClick={() => setSelectedImage(message.image)}
                        className={`text-xs ${theme === "dark"? "text-gray-300":"text-black"} underline mt-1`}
                      >
                        View Image
                      </button>
                    </div>
                  )}
                  {message.message && <p className={`${theme === "dark" && "text-gray-100"}`}>{message.message}</p>}
          </div>
          <div className='chat-footer'>
          <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center w-full">Start Conversation</div>
  )}
  <div ref={messageEndRef} />
</div>



          </div>
          {/* input */}
          <div className='w-full relative'>
            <MessageInputGroup message={message} setMessage={setMessage} image={image} setImage={setImage} handleImageUpload={handleImageUpload} handleCancel={handleCancel} handleSubmit={handleSubmit} />
          </div>
          {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full flex flex-col items-center">
            <img src={selectedImage} alt="Preview" className="w-full rounded-md" />
            <div className="mt-2 flex space-x-4">
              <a href={selectedImage} download className="text-blue-500 underline">Download</a>
              <button onClick={() => setSelectedImage(null)} className="text-red-500 underline">Close</button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  )
}

export default MessageContainerGroup


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