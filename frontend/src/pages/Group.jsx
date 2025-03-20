import React, { useEffect, useState } from 'react'
import { ContactRound, PlusSquare, Search, UserPlus, Users2, X } from 'lucide-react'
import NotSelectedMessage from '../components/NotSelectedMessage'
import { Link } from 'react-router-dom'
import { useGetCookies } from '../store/useGetCookies'
import { useGroupStore } from '../store/useGroupStore'
import {useChatStore} from '../store/useChatStore'
import MessageContainerGroup from '../components/MessageContainerGroup'
import GroupsComp from '../components/GroupsComp'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../ImageUpload-FDB/FirebaseConfig'
import { axiosInstance } from '../lib/axios'
import { useThemeStore } from '../store/useThemeStore'

const Group = () => {
  const [showPopUp, setShowPopUp] = useState(false)
  const { authUser } = useGetCookies()
  const { GroupSelectedId, GroupSelectedData, LoadingGroupsChats, GetUsersGroupProfile, GroupUsersProfile,SetGroupSelectedId ,getUserGroups, GetUserGroups,sendGroupMessage } = useGroupStore()
    const { getAllUsers, LoadingAllUsers, GetAllUsers } = useChatStore()
    const [groupInfo, setGroupInfo] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [groupname, setGroupName] = useState(GroupUsersProfile?.groupName || '')
    const [initialName, setInitialName] = useState(GroupUsersProfile?.groupName || '');
    const [isNameChanged, setIsNameChanged] = useState(false)
    const [showAvailableUsers, setShowAvailableusers] = useState(false)
    const [notInGroupUsers, setNotInGroupUsers] = useState([])
    const [query, setQuery] = useState('')
    const [searchUser, setSearchUser] = useState([])
    const [queryfind, setQueryfind] = useState('')
    const [searchFind, setSearchFind] = useState([])
    const [previewIcon, setPreviewIcon] = useState("")
    const [icon, seticon] = useState(null)
    const [showDeleteGroupPopUp, setShowDeleteGroupPopUp] = useState(false)
    const [showExitGroupPopUp, setShowExitGroupPopUp] = useState(false)
    const [showOptions,setShowOptions]=useState("")
    const {theme} = useThemeStore()
  // console.log("iam user cookie", authUser)
  // console.log("iam group id", GroupSelectedId)


  const [message,setMessage]=useState("")
  const [uploadImageUrl,setUploadImageUrl]=useState(null)
  const [image, setImage] = useState({
    imageUrl: "",
    file: null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          imageUrl: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };
  

  const handleCancel = () => {
    setImage({ imageUrl: "", file: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let DownloadUrl = ""
      if(image.file){
        const storageRef = ref(storage,`Chat-App/${Date.now()}`)
        await uploadBytes(storageRef, image.file);
        DownloadUrl = await getDownloadURL(storageRef);
        setUploadImageUrl(DownloadUrl);
      }
      sendGroupMessage(message,DownloadUrl,GroupSelectedId,authUser)
      // const res = await axiosInstance.post(`/groups/send`,{message,image:DownloadUrl,groupId:GroupSelectedId,senderId:authUser})
      // console.log("message send sucessfully",res)
      setMessage("")
      setImage({imageUrl:"",file:null})
    } catch (error) {
      console.error("error sending message", error);
    }
  };


  const FilterSearch = () => {
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '') // Remove special characters
        .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
        .trim();
  
    const normalizedQuery = normalize(queryfind);
  
    const filteredGroups = GetUserGroups.filter(({ groupName }) =>
      normalize(groupName).includes(normalizedQuery)
    );
    // console.log("Searching for:", filteredGroups);
    setSearchFind(filteredGroups);
  };
  

  useEffect(()=>{
    getAllUsers(authUser)
  },[])
  

  useEffect(()=>{
    FilterSearch()
  },[queryfind])



  return (
    <div className='mt-[65px] container mx-auto'>
      <div className='flex w-full h-[calc(100vh-65px)] overflow-y-hidden'>

        {GroupSelectedId ? (
          <div className='lg:hidden w-full h-full'>
            <MessageContainerGroup message={message} setMessage={setMessage} image={image} setImage={setImage} handleImageUpload={handleImageUpload} handleCancel={handleCancel} handleSubmit={handleSubmit} 


            GroupSelectedData={GroupSelectedData} LoadingGroupsChats={LoadingGroupsChats} GroupUsersProfile={GroupUsersProfile} GetUsersGroupProfile={GetUsersGroupProfile}
            GroupSelectedId={GroupSelectedId}
            SetGroupSelectedId={SetGroupSelectedId}
            getAllUsers={getAllUsers}
            LoadingAllUsers={LoadingAllUsers}
            GetAllUsers={GetAllUsers}
            groupInfo={groupInfo} setGroupInfo={setGroupInfo} showEdit={showEdit} setShowEdit={setShowEdit}
            groupname={groupname} setGroupName={setGroupName} initialName={initialName} setInitialName={setInitialName} isNameChanged={isNameChanged} setIsNameChanged={setIsNameChanged} showAvailableUsers={showAvailableUsers} setShowAvailableusers={setShowAvailableusers} notInGroupUsers={notInGroupUsers} setNotInGroupUsers={setNotInGroupUsers} query={query} setQuery={setQuery} searchUser={searchUser} setSearchUser={setSearchUser} previewIcon={previewIcon} setPreviewIcon={setPreviewIcon} icon={icon} seticon={seticon} showDeleteGroupPopUp={showDeleteGroupPopUp} setShowDeleteGroupPopUp={setShowDeleteGroupPopUp} showExitGroupPopUp={showExitGroupPopUp} setShowExitGroupPopUp={setShowExitGroupPopUp} showOptions={showOptions} setShowOptions={setShowOptions}
            />
          </div>
        ) : (
          <div className={`min-w-[350px] h-full w-full sm:max-w-lg border border-gray-500 py-2 mx-auto lg:hidden lg:mx-0 `}>
            <div className='relative'>
              <div className='flex justify-around items-center'>
                <h2 className='text-center text-xl font-bold mb-2'><span>{GetUserGroups.length} </span>Contacts</h2>
                <div className='bg-green-400 p-1 rounded-lg flex justify-center items-center'>
                  <button>
                    <PlusSquare onClick={() => setShowPopUp(true)} className='size-6 text-white ' />
                  </button>
                </div>
              </div>
              <div className={`${showPopUp ? "absolute" : "hidden"} w-full h-[calc(100vh-66px)] ${theme === "dark" ? "bg-[#1d232a]" :"bg-white"} border border-black z-20 -top-2 right-0`}>
                <div className='absolute top-0 right-0'>
                  <button>
                    <X onClick={() => setShowPopUp(false)} className='size-6' />
                  </button>
                </div>
                <div className='w-full h-full flex flex-col justify-center gap-y-8 items-center px-4 '>
                  <Link to={'/adduser'} className='w-full'>
                    <div className='w-full flex  items-center gap-x-4 border border-gray-200 rounded-3xl py-1  px-8 shadow-xl'>
                      <div className='bg-green-400 p-2'><UserPlus className='size-8 text-white' /></div>
                      <div><h3 className='text-xl font-bold '>New Contact</h3></div>
                    </div>
                  </Link>
                  <Link to={'/addgroup'} className='w-full'>
                    <div className='w-full flex  items-center gap-x-4 border border-gray-200 rounded-3xl py-1  px-8 shadow-xl'>
                      <div className='bg-green-400 p-2'><Users2 className='size-8 text-white' /></div>
                      <div><h3 className='text-xl font-bold '>Create Group</h3></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className='px-4 mb-1'>
              <div className='border border-gray-300 rounded-3xl flex items-center px-2 py-1'>
                <Search className='size-6' />
                <input type="search" className='w-full px-2 py-1 outline-none bg-inherit' placeholder='Search Group Name'
                value={queryfind} onChange={(e)=>setQueryfind(e.target.value)}
                />
              </div>
            </div>
            <div className='flex items-center gap-x-4 px-4 py-1 font-bold text-white border-b border-gray-300'>
              <Link to="/"><button className='px-2 py-1 text-center rounded-lg bg-emerald-500'>Friends</button></Link>
              <Link to="/group"><button className='px-2 py-1 text-center rounded-lg bg-yellow-500'>Groups</button></Link>
            </div>
            <div className=''>
              <GroupsComp queryfind={queryfind} setQueryfind={setQueryfind} searchFind={searchFind} setSearchFind={setSearchFind} setGroupInfo={setGroupInfo} />
            </div>
          </div>
        )}

        <div className={`min-w-[350px] h-[calc(100vh-65px)] w-full sm:max-w-md border border-gray-500 py-2 mx-auto hidden lg:block lg:mx-0 `}>
          <div className='relative'>
            <div className='flex justify-around items-center'>
              <h2 className='text-center text-xl font-bold mb-2'><span>{GetUserGroups.length} </span>Contacts</h2>
              <div className='bg-green-400 p-1 rounded-lg flex justify-center items-center'>
                <button>
                  <PlusSquare onClick={() => setShowPopUp(true)} className='size-6 text-white ' />
                </button>
              </div>
            </div>
            <div className={`${showPopUp ? "absolute" : "hidden"} w-full h-[calc(100vh-66px)] ${theme === "dark" ? "bg-[#1d232a]" :"bg-white"} border border-black z-20 -top-2 right-0`}>
              <div className='absolute top-0 right-0'>
                <button>
                  <X onClick={() => setShowPopUp(false)} className='size-6' />
                </button>
              </div>
              <div className='w-full h-full flex flex-col justify-center gap-y-8 items-center px-4 '>
                <Link to={'/adduser'} className='w-full'>
                  <div className='w-full flex  items-center gap-x-4 border border-gray-200 rounded-3xl py-1  px-8 shadow-xl'>
                    <div className='bg-green-400 p-2'><UserPlus className='size-8 text-white' /></div>
                    <div><h3 className='text-xl font-bold '>New Contact</h3></div>
                  </div>
                </Link>
                <Link to={'/addgroup'} className='w-full'>
                  <div className='w-full flex  items-center gap-x-4 border border-gray-200 rounded-3xl py-1  px-8 shadow-xl'>
                    <div className='bg-green-400 p-2'><Users2 className='size-8 text-white' /></div>
                    <div><h3 className='text-xl font-bold '>Create Group</h3></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className='px-4 mb-1'>
            <div className='border border-gray-300 rounded-3xl flex items-center px-2 py-1'>
              <Search className='size-6' />
              <input type="search" className='w-full px-2 py-1 outline-none bg-inherit' placeholder='Search Group Name'
              value={queryfind} onChange={(e)=>setQueryfind(e.target.value)}
              />
            </div>
          </div>
          <div className='flex items-center gap-x-4 px-4 py-1 font-bold text-white border-b border-gray-300'>
            <Link to='/'><button className='px-2 py-1 text-center rounded-lg bg-emerald-500'>Friends</button></Link>
            <Link to='/group'><button className='px-2 py-1 text-center rounded-lg bg-yellow-500'>Groups</button></Link>
          </div>
          <div className=''>
              <GroupsComp queryfind={queryfind} setQueryfind={setQueryfind} searchFind={searchFind} setSearchFind={setSearchFind} setGroupInfo={setGroupInfo} />
          </div>
        </div>
        <div className="border border-gray-500 w-full h-full hidden lg:block ">
          {GroupSelectedId ? (
            <MessageContainerGroup message={message} setMessage={setMessage} image={image} setImage={setImage} handleImageUpload={handleImageUpload} handleCancel={handleCancel} handleSubmit={handleSubmit}
            
            GroupSelectedData={GroupSelectedData} LoadingGroupsChats={LoadingGroupsChats} GroupUsersProfile={GroupUsersProfile} GetUsersGroupProfile={GetUsersGroupProfile}
            GroupSelectedId={GroupSelectedId}
            SetGroupSelectedId={SetGroupSelectedId}
            getAllUsers={getAllUsers}
            LoadingAllUsers={LoadingAllUsers}
            GetAllUsers={GetAllUsers}
            groupInfo={groupInfo} setGroupInfo={setGroupInfo} showEdit={showEdit} setShowEdit={setShowEdit}
            groupname={groupname} setGroupName={setGroupName} initialName={initialName} setInitialName={setInitialName} isNameChanged={isNameChanged} setIsNameChanged={setIsNameChanged} showAvailableUsers={showAvailableUsers} setShowAvailableusers={setShowAvailableusers} notInGroupUsers={notInGroupUsers} setNotInGroupUsers={setNotInGroupUsers} query={query} setQuery={setQuery} searchUser={searchUser} setSearchUser={setSearchUser} previewIcon={previewIcon} setPreviewIcon={setPreviewIcon} icon={icon} seticon={seticon} showDeleteGroupPopUp={showDeleteGroupPopUp} setShowDeleteGroupPopUp={setShowDeleteGroupPopUp} showExitGroupPopUp={showExitGroupPopUp} setShowExitGroupPopUp={setShowExitGroupPopUp} 
            showOptions={showOptions} setShowOptions={setShowOptions}
            />
          ) : (
            <NotSelectedMessage />
          )}
        </div>
      </div>
    </div>
  )
}

export default Group