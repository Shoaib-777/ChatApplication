import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import RightSideImage from '../components/RightSideImage'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../lib/axios';
import Cookies from 'js-cookie'
import { useGetCookies } from '../store/useGetCookies';

const Login = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: ""
  })
  const router = useNavigate()
  const { updateAuthUser } = useGetCookies();
  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLogin(true);
      const res = await axiosInstance.post(`/sign-up/login`, {
        email: userCredentials.email,
        password: userCredentials.password
      });

      if (res.data.isPasswordCorrect) {
        alert("Login successful");
        const userId = res.data.userId;
        Cookies.set("userLoggedIn", userId,{ expires: 30, secure: true });
        updateAuthUser(userId);
        router('/');
      }
    } catch (error) {
      setIsLogin(false);
      if (error.response) {
        alert(error.response.data.message || "Incorrect Email or Password");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };


  return (
    <div className="container mx-auto mt-16">
      <div className="flex justify-center items-center w-full mx-auto h-[calc(100vh-65px)] gap-x-4 py-6 ">
        <div className="border border-gray-300 shadow-gray-400 shadow-2xl w-full h-full lg:w-1/2 max-w-lg py-[100px] mx-4">

          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                <p className="text-base-content/60">
                  Login to your account
                </p>
              </div>
            </div>
            {/* Email */}
            <div className="mt-4 px-4">
              <label className="font-bold text-lg">Email <span className='text-red-600'>*</span></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Johndoe@gmail.com"
                  value={userCredentials.email}
                  onChange={handleChange}
                  className="w-full p-2 outline-none"
                  required
                />
              </div>
            </div>
            {/* Password */}
            <div className="mt-4 px-4">
              <label className="font-bold text-lg">Password <span className='text-red-600'>*</span></label>
              <div className="flex items-center border border-gray-200 w-full mt-1">
                <div className="w-[40px] flex justify-center items-center">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <div className="w-full relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={userCredentials.password}
                    onChange={handleChange}
                    className="w-full p-2 outline-none"
                    minLength={6}
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
            </div>

              <Link to="/forget-password"><h2 className='text-red-500 hover:text-red-600 font-bold px-4 mt-1'>Forget Password</h2></Link>

            {/* Submit Button */}
            <div className="mx-4 mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLogin && 'cursor-not-allowed'}`}
                disabled={isLogin}
              >
                {isLogin ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>


          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Don{"'"}t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className='h-full'>
          <RightSideImage title={"Welcome Back!"}
            subtitle={"Login in to continue your conversation and catch with your messages"} />
        </div>
      </div>
    </div>
  )
}

export default Login