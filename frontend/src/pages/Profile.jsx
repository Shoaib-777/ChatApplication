import { ArrowLeft, Camera, CheckCircle, Mail, User2, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { useGetCookies } from '../store/useGetCookies'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../ImageUpload-FDB/FirebaseConfig'
import { redirect, useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/useThemeStore'

const Profile = () => {
  const [userDetails, setUserDetails] = useState([])
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const { authUser,logoutUser } = useGetCookies()
  const [updating, setUpdating] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false)
  const router = useNavigate()
  const {theme}= useThemeStore()

  const GetImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowPreview(true)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };


  const ProfileUpdate = async () => {
    try {
      setUpdating(true)
      let ImageUrl = ""
      if (imageFile) {
        const StorageRef = ref(storage, `Chat-App/user-profile/${Date.now()}`)
        await uploadBytes(StorageRef, imageFile)
        ImageUrl = await getDownloadURL(StorageRef)
      }
      const res = await axiosInstance.put(`/users/${authUser}`, { profile: ImageUrl })
      // console.log("profile updated sucessfully ", res)
      setImagePreview("")
      setShowPreview(false)
      setImageFile(null)
      GetUserProfile()
    } catch (error) {
      console.log("error updating user profile", error)
    } finally {
      setUpdating(false)
    }
  }

  const GetUserProfile = async () => {
    try {
      const res = await axiosInstance.get(`/users/${authUser}`)
      setUserDetails(res.data.data)
    } catch (error) {
      console.log("error fetching user Account Details", error)
    }
  }

  const handleBack = () => {
    setImageFile(null);
    setImagePreview("");
    setShowPreview(false)
  }

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    // MongoDB ObjectId validation regex (24 characters, hex)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
    if (!objectIdRegex.test(authUser)) {
      logoutUser();
      alert("Invalid user ID format.");
      return;
    }
  
    try {
      const res = await axiosInstance.delete(`/users/${authUser}`);
      console.log(res.data);
      alert("Account deleted successfully!");
  
      setTimeout(() => {
        logoutUser();
        router.push('/login'); // assuming router is from Next.js's useRouter
      }, 1000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert("User not found. It might have already been deleted.");
        } else {
          alert(error.response.data.message || "An error occurred while deleting the account.");
        }
      } else {
        alert("Network error or server is unreachable.");
      }
      console.log("Error deleting user account:", error);
    }
  };
  
  


  useEffect(() => {
    GetUserProfile()
  }, [])

  return (
    <>
    <div className='text-white mt-[65px] mx-2 md:mx-6 py-2'>
    <ArrowLeft onClick={()=>router(-1)} className={`size-7 ${theme === "dark" ? "text-white":"text-black"} `} />
    </div>
    <div className={` min-h-[calc(100vh-65px)] continer mx-auto flex justify-center items-center sm:p-6  `}>
      <div className={`w-full min-h-[calc(100vh-65px)] sm:h-full sm:max-w-lg px-4 py-6 border border-primary rounded-md`}>
        <div className='flex flex-col justify-center items-center gap-y-4'>
          <h4 className='font-bold text-xl'>Profile</h4>
          <span className='font-semibold text-lg'>Your Profile Information</span>
          <div className='flex flex-col justify-center items-center'>



           <div className="relative p-1 w-[120px]">
              <img
                src={showPreview ? imagePreview : userDetails.profile || "no-image.png"}
                alt="no profile"
                className="size-[120px] avatar rounded-full border border-blue-600 object-contain"
              />
              {/* Camera Button */}
              <div className={`rounded-full bg-yellow-400 absolute bottom-0 right-0 p-1 ${imagePreview ? "hidden" : "block"
                      }`}>
                <input type="file" id="profile" hidden onChange={GetImageFile} />
                <label htmlFor="profile">
                  <Camera
                    className={`${imagePreview ? "hidden" : "block"
                      } size-6 cursor-pointer`}
                  />
                </label>
              </div>
              {/* Check & Cancel Buttons */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button disabled={updating} onClick={ProfileUpdate}>
                  <CheckCircle
                    className={`${imagePreview ? "block" : "hidden"
                      } size-6 cursor-pointer text-green-600 bg-white rounded-full ${updating && "cursor-not-allowed opacity-50"
                      }`}
                  />
                </button>
                <button disabled={updating} onClick={handleBack}>
                  <XCircle
                    className={`${imagePreview ? "block" : "hidden"
                      } size-6 cursor-pointer text-red-600 bg-white rounded-full ${updating && "cursor-not-allowed opacity-50"
                      }`}
                  />
                </button>
              </div>
            </div> 





            
            <p className='text-lg font-semibold'>Click the camera icon to update your profile image</p>
          </div>
        </div>
        <div className='mt-4'>
          <div className='mb-4'>
            <div className='flex items-center gap-x-2 mb-2'>
              <User2 className='size-6' /> <label className='text-xl font-bold'>Full Name</label>
            </div>
            <input type="text" value={userDetails.name || ""} placeholder='John Doe' className='w-full px-4 py-2 outline-none border border-gray-200 rounded-md' readOnly />
          </div>
          <div className='mb-4'>
            <div className='flex items-center gap-x-2 mb-2'>
              <Mail className='size-6' /> <label className='text-xl font-bold'>Email</label>
            </div>
            <input type="email" value={userDetails.email || ""} placeholder='Johndoe@gmail.com' className='w-full px-4 py-2 outline-none border border-gray-200 rounded-md' readOnly />
          </div>
        </div>
        <div className=''>
          <div>
            <h4 className='text-2xl font-bold mb-2'>Account Information</h4>
            <div className='flex justify-between items-center'>
              <h2 className='font-semibold text-lg'>Member Since</h2>
              <span className='text-base-content/40'>{userDetails.createdAt ? formatTimestampToDate(userDetails.createdAt) : "Sorry Un Available"}</span>
            </div>
            <hr className='mt-2 ' />
            <div className='flex justify-between items-center'>
              <h2 className='font-semibold text-lg'>Account Status</h2>
              <span className='text-[aqua]'>Active</span>
            </div>
          </div>
        </div>
        <div className={` w-full`}>
          <h2 className='text-2xl font-bold mb-2'>Danger Zone</h2>
          <div>
            <button onClick={() => setShowPopUp(true)} className='text-white bg-red-600 font-bold rounded-xl hover:bg-red-700 px-4 py-2'>Delete the Account</button>
          </div>
        </div>
        <div
          onClick={() => setShowPopUp(false)}
          className={`${showPopUp ? "fixed" : "hidden"
            } w-full h-screen top-0 left-0 bg-black/50 z-20 flex justify-center items-center`}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            role="dialog"
            aria-modal="true"
            className={`max-w-[400px] px-4 py-6 ${theme === "dark" ? "bg-[#1d232a]":"bg-white"} rounded-lg flex flex-col z-30`}
          >
            <div>
              <p className="font-bold text-lg text-center">
                Are you sure you want to delete the <br />
                account? <br />
                <span className="text-red-500">This action cannot be undone.</span>
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setShowPopUp(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold text-lg rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} // Assuming you have a delete handler
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold text-lg rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>)
}

export default Profile