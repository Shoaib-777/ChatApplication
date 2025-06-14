import { Camera, Eye, EyeOff, FolderUp, Loader2, Lock, Mail, MessageSquare, SquareX, User, UserCircle2, } from 'lucide-react';
import React, { useState } from 'react';
import RightSideImage from '../components/RightSideImage';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../ImageUpload-FDB/FirebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { axiosInstance } from '../lib/axios';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    profile: "",
    password: "",
  });
  const [image, setImage] = useState({
    imgSrc: "",
    imgName: "",
    file: null, // Store actual file
  });
  const [errors, setErrors] = useState({});
  const router = useNavigate()
  const [showAlert, setShowAlert] = useState(false)



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));

    // Basic validation
    let newErrors = { ...errors };
    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }
    if (name === "password" && value.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else {
      delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        imgSrc: URL.createObjectURL(file), // Preview URL
        imgName: file.name,
        file: file, // Store actual file for Firebase upload
      });
    }
  };

  const handleRemoveImage = () => {
    setImage({ imgSrc: "", imgName: "", file: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    // Final validation before submission
    if (!userDetails.username || !userDetails.email || !userDetails.password) {
      alert("Please fill in all required fields");
      setIsSigningUp(false);
      return;
    }
    let imageUrl = ""
    try {
      if (image.file) {
        const storageRef = ref(storage, `/Chat-App/User-Signup/${image.imgName}`);
        await uploadBytes(storageRef, image.file);
        imageUrl = await getDownloadURL(storageRef);
        setUploadImageUrl(imageUrl);
      }

      const res = await axiosInstance.post("/sign-up", {
        name: userDetails.username,
        email: userDetails.email,
        profile: imageUrl, // Use uploaded image URL
        password: userDetails.password,
      });
      //todo alert signup sucessfully
      setShowAlert(true)
      console.log("Successful signup", res);
      // Reset form
      setUserDetails({ username: "", email: "", password: "", profile: "" });
      setImage({ imgSrc: "", imgName: "", file: null });
      setUploadImageUrl("");
      setIsSigningUp(false);
      setTimeout(() => {
        setShowAlert(false)
        router('/login')
      }, 3000);
    } catch (error) {
      if (error.response) {
        // If there's an error response from the server
        alert(error.response.data.message);  // This should show 'User already exists'
      } else {
        // If the error doesn't have a response
        alert("Something went wrong. Please try again.");
      }
      console.log("Error in signup ", error);
      setIsSigningUp(false);
    }
  };

  return (
    <div className="container mx-auto mt-[65px]">
      <div className={`w-full flex justify-center items-center mt-[65px] fixed top-2 ${showAlert ? " block " : "hidden "}`}>
        <div role="alert" className={`alert max-w-[400px] alert-success  flex justify-center items-center`}>
          <div className='flex items-center gap-x-4'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current text-white"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className='text-lg font-bold text-white'>Sign Up Sucessfully!</span>

          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mx-auto min-h-[calc(100vh-65px)] py-2 gap-x-4 ">
        <div className="border border-gray-300 shadow-xl w-full h-full overflow-y-auto py-2  lg:w-1/2 mx-4 max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            <div className='mt-2 flex justify-center items-center w-full'>
              <div className="avatar relative">
                <div className="w-24 rounded-full">
                  <img src={image.imgSrc || 'no-image.png'} alt='no-image.png' />
                </div>
                <div className='absolute -bottom-[9px] right-0 border border-white rounded-full flex items-center justify-center p-1 bg-gray-700'>
                  <input
                    type="file"
                    name="profile"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile"
                  />                    
                  <label htmlFor='profile'><Camera className='size-6 text-white cursor-pointer' /></label>
                </div>
              </div>
            </div>
            <h2 className='text-center mt-2 font-bold text-lg'>Profile Image</h2>

            {/* Username */}
            <div className="mt-2 px-4">
              <label className="font-bold text-lg">Full Name <span className='text-red-600'>*</span></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={userDetails.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-2 outline-none"
                  required
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="mt-2 px-4">
              <label className="font-bold text-lg">Email <span className='text-red-600'>*</span></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  placeholder="Johndoe@gmail.com"
                  className="w-full p-2 outline-none"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Profile Image */}

            {/* <div className="mt-4 px-4">
              <label className="font-bold text-lg">Profile <sup className='text-sm'>(optional)</sup></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center ml-1 mr-10">
                  <UserCircle2 className="size-7 text-base-content/40" />
                </div>
                <div className='w-full'>
                  <input
                    type="file"
                    name="profile"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile"
                  />
                  <label htmlFor="profile" className="cursor-pointer">
                    <div className="w-full flex items-center gap-x-4">
                      <FolderUp className="size-10 text-base-content/40 text-sky-600" />
                      <h2 className="font-semibold">
                        {image.imgName
                          ? image.imgName.length > 20
                            ? `${image.imgName.slice(0, 20)}...`
                            : image.imgName
                          : "Upload Your Profile Image"}
                      </h2>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            {image.imgSrc && (
              <div className="w-20 h-20 mt-2 mx-auto flex justify-center items-end border border-black relative">
                <img
                  src={image.imgSrc}
                  alt="profile"
                  className="w-16 h-16 object-contain rounded-full border border-blue-500"
                />
                <SquareX
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 size-5 text-red-500 cursor-pointer"
                />
              </div>
            )} */}

            {/* Password */}
            <div className="mt-2 px-4">
              <label className="font-bold text-lg">Password <span className='text-red-600'>*</span></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <div className="w-full relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-2 outline-none"
                    required
                  />
                  <div
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-6 text-base-content/40" />
                    ) : (
                      <Eye className="size-6 text-base-content/40" />
                    )}
                  </div>
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div className="mx-4 mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isSigningUp && 'cursor-not-allowed'}`}
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className='h-full'>
          <RightSideImage title={"Join our community"}
            subtitle={"Connect with friends, share moments, and stay in touch with your loved ones."} />
        </div>
      </div>

    </div>
  );
};
export default Signup