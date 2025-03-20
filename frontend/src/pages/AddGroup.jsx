// test starts 
import { ArrowLeft, Camera, Check, ChevronDown, PlusCircle, Search, SendHorizonal, Users, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useGetCookies } from "../store/useGetCookies";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../ImageUpload-FDB/FirebaseConfig";
import { axiosInstance } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore"

const AddGroup = () => {
    const router = useNavigate()
    const [selectedUser, setSelectedUser] = useState([]);
    const [showGroupComp, setShowGroupComp] = useState(false)
    const [hasValue, setHasValue] = useState(false);
    const [image, setImage] = useState(null)
    const [groupDetails, setGroupDetails] = useState({
        groupName: "",
        icon: ""
    })
    const { authUser } = useGetCookies()
    const { theme } = useThemeStore()
    const { UserAvailable, getAvailableUser } = useGroupStore()
    const { getAllUsers, GetAllUsers } = useChatStore()
    const [showFriends, setShowFriends] = useState(true)
    const [showAllUsers, setShowAllUsers] = useState(false)
    const [AllUsers, setAllUsers] = useState([])
    const [query, setQuery] = useState("")



    const SearchUser = () => {
        const filterAndSort = (data) => {
            const filtered = data.filter(search =>
                search.name.toLowerCase().includes(query.toLowerCase()) ||
                search.email.toLowerCase().includes(query.toLowerCase())
            );

            if (query.trim() !== "") {
                filtered.sort((a, b) => {
                    const aStarts = a.name.toLowerCase().startsWith(query.toLowerCase()) || a.email.toLowerCase().startsWith(query.toLowerCase());
                    const bStarts = b.name.toLowerCase().startsWith(query.toLowerCase()) || b.email.toLowerCase().startsWith(query.toLowerCase());
                    return bStarts - aStarts;
                });
            }
            return filtered;
        };

        const searchInFriends = filterAndSort(UserAvailable);
        const searchInAllUsers = filterAndSort(AllUsers);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Create preview URL
            setGroupDetails(prev => ({ ...prev, icon: file })); // Store file for upload
        }
    };


    const handleSelectedUser = (data) => {
        setSelectedUser((prevUsers) => {
            const userId = data.friendId || data._id;
            const isDuplicate = prevUsers.some((user) => user.userId === userId);

            if (isDuplicate) {
                alert("User already exists");
                return prevUsers;
            }

            return [
                ...prevUsers,
                {
                    userId,
                    userName: data.name,
                    userProfile: data.profile || "no-image.png",
                },
            ];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        // users,icon,groupName,AdminId
        try {
            let DownloadUrl = ""
            if (groupDetails.icon) {
                const storageRef = ref(storage, `Chat-App/GroupIcons/${Date.now()}`)
                await uploadBytes(storageRef, groupDetails.icon);
                DownloadUrl = await getDownloadURL(storageRef)
            }
            // console.log("iam selected users", selectedUser)
            const usersmap = selectedUser.map(user => user.userId)
            // console.log("iam users.......", usersmap)
            const res = await axiosInstance.post('/groups/create', {
                users: [...usersmap, authUser],  // Extract user IDs
                icon: DownloadUrl,
                groupName: groupDetails.groupName,
                AdminId: authUser
            })
            // console.log("crated group sucessfully", res)
            // console.log("iam selected users ids", usersmap)
            router('/group')
        } catch (error) {
            console.log("error creating group", error)
        }
        // console.log("iam data", groupDetails)
    }



    const FilterUsers = () => {
        const FriendsIds = UserAvailable.map(user => user.friendId)
        const AllUsersIds = GetAllUsers.filter(users => users._id !== authUser && !FriendsIds.includes(users._id))
        // console.log("iam current users.....", AllUsersIds)
        setAllUsers(AllUsersIds)
    }

    useEffect(() => {
        getAvailableUser(authUser)
        getAllUsers()
    }, [])

    useEffect(() => {
        SearchUser()
    }, [query])

    useEffect(() => {
        FilterUsers()
    }, [GetAllUsers, UserAvailable])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setGroupDetails(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === "groupName") {
            setHasValue(!!value);
        }
    };



    return (
        <div className={`mt-[65px] container relative mx-auto h-[calc(100vh-65px)] ${theme === "dark" ? "bg-[#1d232a]" : "bg-none"} overflow-y-auto `}>
            <div className='px-4 mt-1' hidden={showGroupComp}>
                <button><ArrowLeft onClick={() => router(-1)} className='size-7' /></button>
            </div>
            <div className={`${showGroupComp ? " absolute " : " hidden "} ${theme === "dark" ? "bg-[#1d232a]" : "bg-white"} h-[calc(100vh-65px)]  z-10 w-full  px-4 py-2 `}>
                <div className="px-4 py-1">
                    <ArrowLeft onClick={() => setShowGroupComp(false)} className="size-8 cursor-pointer " />
                </div>
                <div className="w-full h-[calc(100%-10%)] flex flex-col justify-between items-center border border-gray-300 py-4">
                    <form onSubmit={handleSubmit}>
                        <div className=" w-full h-[300px]  ">
                            <div>
                                <input
                                    type="file"
                                    id="file"
                                    hidden
                                    accept="image/*"
                                    name="icon"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="file" className=" cursor-pointer ">
                                    <div className="w-[250px] h-[250px] mx-auto  rounded-full p-4  mt-2 relative border border-gray-300">
                                        {image ? (
                                            <img src={image} alt="no image" className="w-full h-full rounded-full object-contain" />
                                        ) : (
                                            <Users className="w-full h-full rounded-full object-contain " />
                                        )}

                                        <div className={`${image && "hidden"} absolute w-full h-full   rounded-full top-0 right-0 bg-[#54656fcc] z-40  flex justify-center items-center`}>
                                            <div className="w-full h-full  rounded-full flex flex-col justify-center items-center">
                                                <Camera className="text-white size-10  mb-2 mt-4" />
                                                <span className="text-white font-semibold text-lg">Add Group <span className="block text-center">Icon</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {/* <div className="w-full flex justify-center items-center mt-4">
                        <div className="w-full max-w-[600px]">
                            <div className="hidden"><span>Group Subject or Name</span></div>
                            <input type="text" className=" py-2 outline-none border-b-[3px] w-full max-w-[600px] border-emerald-700" placeholder="Group Subject or Name" />
                        </div>
                    </div> */}
                        <div className="w-full flex justify-center items-center mt-4">
                            <div className="w-full max-w-[600px] relative mt-2">
                                {/* Span tag */}
                                <span
                                    className={`absolute left-0 transition-all duration-300  ${hasValue ? "top-[-20px] text-sm text-emerald-700" : "top-[12px] text-base text-gray-400"
                                        }`}
                                >
                                    Group Subject or Name
                                </span>
                                {/* Input field */}
                                <input
                                    type="text"
                                    className={`py-2 outline-none border-b-[3px] w-full max-w-[600px] border-emerald-700 ${theme === "dark" && "bg-inherit border border-gray-300"}`}
                                    placeholder=""
                                    name="groupName"
                                    value={groupDetails.groupName}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-center items-center mt-20">
                            <div className="flex justify-center items-center rounded-full w-10 h-10 bg-emerald-600">
                                <button type="submit"><Check className="text-white text-lg" /></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-full pt-2">
                <div className="w-full px-4 mb-4">
                    <div className="w-full border border-gray-300 flex items-center px-2 py-1 rounded-l-3xl">
                        <Search className="size-7 text-gray-400" />
                        <input
                            type="search"
                            className={`w-full outline-none px-4 py-2  ${theme === "dark" && "bg-inherit"} `}
                            placeholder="Search User With Name or Email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                {selectedUser.length > 0 && (
                    <>
                        <div className=" mx-4 py-3 overflow-x-auto overflow-y-hidden">
                            <div className="w-full mt-2 mb-6 flex items-center px-3 lg:px-6 gap-x-2 lg:gap-x-4  ">
                                {selectedUser.map((v) => (
                                    <div key={v.userId} className="w-16 h-16 p-1 relative">
                                        <div className="w-full h-full flex flex-col">
                                            <img
                                                src={v.userProfile}
                                                alt="no profile"
                                                className="min-w-16 min-h-16 object-contain rounded-full"
                                            />
                                            <span className="text-xs font-light text-center mt-1">
                                                {v.userName}
                                            </span>
                                        </div>
                                        <div className="absolute -right-1 bottom-0">
                                            <XCircle
                                                className="size-6 fill-gray-200 cursor-pointer"
                                                onClick={() =>
                                                    setSelectedUser((prevUsers) =>
                                                        prevUsers.filter(
                                                            (user) => user.userId !== v.userId
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full mx-auto mt-4 pt-4 pb-2 flex justify-center items-center">
                            <div className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-2 rounded-lg">
                                <button onClick={() => setShowGroupComp(true)} className=" flex justify-center items-center gap-x-4 font-medium text-center px-4 py-2">Create Group <SendHorizonal className="size-7 " /></button>
                            </div>
                        </div>
                    </>)}
                <div className="w-full flex justify-between items-center">
                    <div className="w-full px-4">
                        <div>
                            <div onClick={() => setShowFriends(!showFriends)} className="flex w-full items-center gap-x-4 border border-gray-300 shadox-lg px-4 py-2 cursor-pointer">
                                <div>
                                    <ChevronDown
                                        className={`size-6 transition-transform duration-150 ${showFriends ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Friends</h2>
                                </div>
                            </div>
                            <div className={`${showFriends ? "block" : "hidden"} border border-gray-300`}>
                                {UserAvailable.length > 0 ? (
                                    UserAvailable.map((v) => {
                                        const isMatched = query.trim() !== "" &&
                                            (v.name.toLowerCase().includes(query.toLowerCase()) ||
                                                v.email.toLowerCase().includes(query.toLowerCase()));
                                        return (
                                            <div
                                                key={v.friendId}
                                                className={`flex justify-between items-center w-full border-b border-gray-300 p-2 transition-shadow duration-300 px-4 bg-none
                        ${isMatched ? "bg-sky-300" : ""} ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"}  `} // Highlight matched users
                                            >
                                                <div className="flex items-center w-full">
                                                    <div className="w-14 h-14">
                                                        <img
                                                            src={v.profile || "no-image.png"}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <h2 className={`text-lg font-bold ${isMatched ? "text-emerald-600" : theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
                                                        >
                                                            {v.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div>
                                                    <PlusCircle
                                                        onClick={() => handleSelectedUser(v)}
                                                        className="size-8 text-emerald-500 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-lg font-bold">
                                        <h2 className="text-center">
                                            You Don{"’"}t Have Any Friends <span className="text-red-500">Yet!</span>
                                        </h2>
                                        <Link to={"/adduser"}>
                                            <h2 className="text-center text-blue-600 underline">Add New Friends</h2>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div onClick={() => setShowAllUsers(!showAllUsers)} className="flex w-full items-center gap-x-4 border border-gray-300 shadox-lg px-4 py-2">
                                <div>
                                    <ChevronDown
                                        className={`size-6 transition-transform duration-150 ${showAllUsers ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Users</h2>
                                </div>
                            </div>
                            <div className={`${showAllUsers ? "block" : "hidden"} border border-gray-300`}>
                                {AllUsers.length > 0 ? (
                                    AllUsers.map((v) => {
                                        const isMatched = query.trim() !== "" &&
                                            (v.name.toLowerCase().includes(query.toLowerCase()) ||
                                                v.email.toLowerCase().includes(query.toLowerCase()));
                                        return (
                                            <div
                                                key={v._id}
                                                className={`flex justify-between items-center w-full border-b border-gray-300 p-2 transition-shadow duration-300 px-4 bg-none
                        ${isMatched ? "bg-sky-300" : ""} ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"} `} // Highlight matched users
                                            >
                                                <div className="flex items-center w-full">
                                                    <div className="w-14 h-14">
                                                        <img
                                                            src={v.profile || "no-image.png"}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <h2 className={`text-lg font-bold ${isMatched ? "text-emerald-600" : theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                                                            {v.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div>
                                                    <PlusCircle
                                                        onClick={() => handleSelectedUser(v)}
                                                        className="size-8 text-emerald-500 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>
                                        <h2 className="text-lg font-bold py-2 text-center">No User Available</h2>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGroup;
