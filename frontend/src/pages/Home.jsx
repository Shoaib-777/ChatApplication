import React, { useEffect, useRef, useState } from 'react'
import { ContactRound, PlusSquare, Search, UserCheckIcon, UserPlus, Users2, X } from 'lucide-react'
import Users from '../components/Users'
import NotSelectedMessage from '../components/NotSelectedMessage'
import MessageContainer from '../components/MessageContainer'
import { Link } from 'react-router-dom'
import { useChatStore } from '../store/useChatStore'
import { useGetCookies } from '../store/useGetCookies'
import { axiosInstance } from '../lib/axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../ImageUpload-FDB/FirebaseConfig'
import { useThemeStore } from '../store/useThemeStore'


const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPopUp, setShowPopUp] = useState(false)
  const { MessagingLoding, getSelectedUserMessages, Messages, sendMessage, getSelectedUserProfile, getUsersFriends, UsersFriends, subscribeToMessages, SelectedUser,
    unsubscribeFromMessages, } = useChatStore()
  const { authUser } = useGetCookies()
  const [query, setQuery] = useState("")
  const [searchUser, setSearchUser] = useState([])
  const { theme } = useThemeStore()
  const [showUserOnly,setShowUserOnlyOnline]=useState(false)


  // new start input

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  // const {authUser}=useGetCookies()

  // new start input function 

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const OnlineUsersLength = UsersFriends.filter((user)=>user.status === "online").length

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const sendImage = ref(storage, `Chat-App/${file.name}`)
      await uploadBytes(sendImage, file);
      const previewDownload = await getDownloadURL(sendImage)
      setImagePreview(previewDownload);
    } catch (error) {
      console.log("error sending message", error)
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const texts = text.trim()

    try {
      sendMessage(authUser, selectedUser, texts, imagePreview)
      // const res = await axiosInstance.post('/user/message',{
      //   senderId:authUser,
      //   receiverId:selectedUser,
      //   message: text.trim(),
      //   image: imagePreview,
      // });
      // console.log("send message sucessfully",res)
      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const props = {
    text,
    setText,
    imagePreview,
    setImagePreview,
    fileInputRef,
    removeImage,
    handleImageChange,
    handleSendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  };
  useEffect(() => {
    getSelectedUserMessages(selectedUser);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [SelectedUser, getSelectedUserMessages, subscribeToMessages, unsubscribeFromMessages]);

  // the end of input function 


  useEffect(() => {
    getUsersFriends(authUser)
  }, [])

  const filterSearch = () => {
    if (!query.trim()) {
      setSearchUser([]); // Reset search if query is empty
      return;
    }
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s@.]/gi, '') // Keep only letters, numbers, '@', '.', and spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim();

    const normalizedQuery = normalize(query);

    const filteredUsers = UsersFriends.filter(({ name, email }) =>
      normalize(name).includes(normalizedQuery) || normalize(email).includes(normalizedQuery)
    );

    // console.log("Filtered Results:", filteredUsers);
    setSearchUser(filteredUsers);
  };


  useEffect(() => {
    filterSearch()
  }, [query])


  useEffect(() => {
    getSelectedUserProfile(selectedUser)
    // getSelectedUserMessages(selectedUser)
  }, [selectedUser])
  return (
    <div className='mt-[65px] h-[calc(100vh-65px)] container mx-auto'>
      <div className='flex w-full h-full overflow-y-hidden '>

        {selectedUser ? (
          <div className='lg:hidden w-full h-full '>
            <MessageContainer MessagingLoding={MessagingLoding} Messages={Messages} selectedUser={selectedUser} setSelectedUser={setSelectedUser}

              {...props}

            />
          </div>
        ) : (
          <div className={`min-w-[350px] h-full w-full sm:max-w-lg border border-gray-500  py-2 mx-auto lg:hidden lg:mx-0 `}>
            <div className='relative'>
              <div className='flex justify-around items-center'>
                <h2 className='text-center text-xl font-bold mb-2'><span>{UsersFriends.length}</span>Contacts</h2>
                <div className='bg-green-400 p-1 rounded-lg flex justify-center items-center'>
                  <button>
                    <PlusSquare onClick={() => setShowPopUp(true)} className='size-6 text-white ' />
                  </button>
                </div>
              </div>
              <div className={`${showPopUp ? "absolute" : "hidden"} w-full h-[calc(100vh-66px)] ${theme === "dark" ? "bg-[#1d232a]" : "bg-white"} border border-black z-20 -top-2 right-0`}>
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
              <div className='flex justify-center gap-x-4 items-center mb-1'>
                <input type="checkbox" className='size-[18px]' checked={showUserOnly} onChange={(e)=>setShowUserOnlyOnline(e.target.checked)} />
                <h4 className="font-semibold text-xl">
                  <span>
                    {UsersFriends.filter((v) => v.status === "online").length}
                  </span> Online
                </h4>
              </div>
            </div>
            <div className='px-4 mb-1'>
              <div className='border border-gray-300 rounded-3xl flex items-center px-2 py-1'>
                <Search className='size-6' />
                <input type="search" className='w-full px-2 py-1 outline-none bg-inherit' placeholder='Search Friends Name or Email' value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            <div className='flex items-center gap-x-4 px-4 py-1 font-bold text-white border-b border-gray-300'>
              <Link to="/"><button className='px-2 py-1 text-center rounded-lg bg-emerald-500'>Friends</button></Link>
              <Link to="/group"><button className='px-2 py-1 text-center rounded-lg bg-yellow-500'>Groups</button></Link>
            </div>
            <div className=''>
              <Users query={query} setQuery={setQuery} searchUser={searchUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser} showUserOnly={showUserOnly} setShowUserOnlyOnline={setShowUserOnlyOnline} />
            </div>
          </div>
        )}

        <div className={`min-w-[350px] h-full border border-gray-500 w-full sm:max-w-md  py-2 mx-auto hidden lg:block lg:mx-0 `}>
          <div className='relative'>
            <div className='flex justify-around items-center'>
              <h2 className='text-center text-xl font-bold mb-2'><span>{UsersFriends.length} </span>Contacts</h2>
              <div className='bg-green-400 p-1 rounded-lg flex justify-center items-center'>
                <button>
                  <PlusSquare onClick={() => setShowPopUp(true)} className='size-6 text-white ' />
                </button>
              </div>
            </div>
            <div className={`${showPopUp ? "absolute" : "hidden"} w-full h-[calc(100vh-66px)] ${theme === "dark" ? "bg-[#1d232a]" : "bg-white"} border border-gray-500 z-20 -top-2 right-0`}>
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
            <div className='flex justify-center gap-x-4 items-center mb-1'>
              <input type="checkbox" className='size-[18px]' checked={showUserOnly} onChange={(e)=>setShowUserOnlyOnline(e.target.checked)} />
              <h4 className='font-semibold text-xl'><span>{OnlineUsersLength}</span> Online</h4>
            </div>
          </div>
          <div className='px-4 mb-1'>
            <div className='border border-gray-300 rounded-3xl flex items-center px-2 py-1'>
              <Search className='size-6' />
              <input type="search" className='w-full px-2 py-1 outline-none bg-inherit' placeholder='Search Friends Name or Email' value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className='flex items-center gap-x-4 px-4 py-1 font-bold text-white border-b border-gray-300'>
            <Link to='/'><button className='px-2 py-1 text-center rounded-lg bg-emerald-500'>Friends</button></Link>
            <Link to='/group'><button className='px-2 py-1 text-center rounded-lg bg-yellow-500'>Groups</button></Link>
          </div>
          <div className=''>
            <Users query={query} setQuery={setQuery} searchUser={searchUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser} showUserOnly={showUserOnly} setShowUserOnlyOnline={setShowUserOnlyOnline} />
          </div>
        </div>
        <div className="border border-gray-500 w-full h-full hidden lg:block ">
          {selectedUser ? (
            <MessageContainer MessagingLoding={MessagingLoding} Messages={Messages} selectedUser={selectedUser} setSelectedUser={setSelectedUser}
              {...props}
              text={text} setText={setText} imagePreview={imagePreview} setImagePreview={setImagePreview} fileInputRef={fileInputRef} removeImage={removeImage} handleImageChange={handleImageChange} handleSendMessage={handleSendMessage}
            />
          ) : (
            <NotSelectedMessage />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home