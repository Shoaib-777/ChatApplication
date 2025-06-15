import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import RightSideImage from '../components/RightSideImage';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import {useThemeStore} from '../store/useThemeStore'
import { useGetCookies } from '../store/useGetCookies';

const ForgetPassword = () => {
    const router = useNavigate();
    const [email, setEmail] = useState('');
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [userSearching, setUserSearching] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef([]);
    const {theme}=useThemeStore()
    const { logoutUser } = useGetCookies()
    

    // ✅ Function to update password
    const updatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            return alert("Please Enter Password First atleast 6 characters ")
        }
        try {
            const res = await axiosInstance.put(`/sign-up`, { email, password: newPassword });
            if (res.data.PasswordUpdated) {
                alert("Password updated successfully!");
                logoutUser()
                router('/login');
            }
        } catch (error) {
            console.log("Error updating password", error);
            alert("Please try again later.");
        }
    };

    // ✅ Function to verify OTP
    const verifyOtp = async () => {
        try {
            const res = await axiosInstance.post('/email/verify', { otp: otp.join("") });
            // console.log("iam otp written", otp)
            if (res.data.isValid) {
                setShowNewPasswordInput(true);
                alert("Please Enter New password")
                setShowOtp(false)
            } else {
                alert("Incorrect OTP. Please try again.");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    // ✅ Function to generate and send OTP
    const genOtp = async () => {
        let otp = ""
        for (let i = 0; i < 6; i++) {
            const gen = Math.floor(Math.random() * 10)
            otp += gen
        }
        try {
            const res = await axiosInstance.post('/email', { email, otp });

            if (res.data.Issent) {
                setShowOtp(true);
                alert("OTP sent successfully.");
            } else {
                alert(res.data.message); // Show backend message
            }
        } catch (error) {
            console.log("Error sending OTP:", error);

            if (error.response) {
                alert(error.response.data.message); // Show specific backend error
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };


    // ✅ Function to check email and send OTP
    const checkEmailAndSendOtp = async () => {
        try {
            setUserSearching(true);
            const res = await axiosInstance.post('/sign-up/verify', { email });
            if (res.data.IsUserExists) {
                genOtp();
            } else {
                alert("Email not registered.");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setUserSearching(false);
        }
    };

    // ⏳ Timer for OTP Resend Button
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsResendDisabled(false);
        }
    }, [timer]);

    // 🔢 OTP Input Handling
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // ♻️ Handle OTP Resend
    const handleResend = () => {
        setOtp(["", "", "", "", "", ""]);
        setTimer(30);
        setIsResendDisabled(true);
        genOtp();
    };

    return (
        <div className="container mx-auto mt-[65px]">
            <div className="flex justify-center items-center w-full mx-auto min-h-[calc(100vh-65px)] gap-x-4 py-8 ">
                <div className={`border border-gray-300 shadow-gray-400 ${theme === "dark" ? "shadow-sm":"shadow-2xl"} w-full h-full lg:w-1/2 max-w-lg py-[100px] mx-4`}>
                    <form>
                        <div className="text-center mb-8">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="size-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                                <p className="text-base-content/60">Update your account password</p>
                            </div>
                        </div>
                        {/* Email Input */}
                        <div className="mt-4 px-4">
                            <label className="font-bold text-lg">Email <span className='text-red-600'>*</span></label>
                            <div className="flex items-center border border-gray-200 w-full mt-1">
                                <div className="w-[40px] flex justify-center items-center">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className={`w-full p-2 outline-none ${showNewPasswordInput && "cursor-not-allowed"} `}
                                    required
                                    readOnly={showNewPasswordInput}
                                />
                            </div>
                        </div>
                        {/* OTP Input */}
                        {showOtp && (
                            <div className={`flex flex-col items-center space-y-4 p-6 mt-2  ${theme === "dark" ? "bg-gray-700":"bg-white"} shadow-lg rounded-xl max-w-sm mx-auto`}>
                                <h2 className="text-xl font-bold">Enter OTP</h2>
                                <div className="flex space-x-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={digit}
                                            maxLength={1}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ))}
                                </div>
                                <button onClick={handleResend} disabled={isResendDisabled} className={`btn  ${isResendDisabled ? "btn-disabled" : "btn-primary"}`}>
                                    {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                                </button>
                            </div>
                        )}
                        {/* Password */}
                        {showNewPasswordInput && (
                            <div className="mt-4 px-4">
                                <label className="font-bold text-lg">New Password <span className='text-red-600'>*</span></label>
                                <div className="flex items-center border border-gray-200 w-full mt-1">
                                    <div className="w-[40px] flex justify-center items-center">
                                        <Lock className="size-5 text-base-content/40" />
                                    </div>
                                    <div className="w-full relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Enter New Password ••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                        )}

                        {/* Submit Button */}
                        <div className="mx-4 mt-6">
                            <button
                                type="button"
                                className={`btn btn-primary w-full ${userSearching && 'cursor-not-allowed'}`}
                                onClick={() => {
                                    if (!showOtp && !showNewPasswordInput) checkEmailAndSendOtp();
                                    else if (showOtp && !showNewPasswordInput) verifyOtp();
                                    else if (showNewPasswordInput) updatePassword();
                                }}
                                disabled={userSearching}
                            >
                                {userSearching ? <><Loader2 className="size-5 animate-spin" /> Loading...</> : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className='h-full'>
                    <RightSideImage title="Welcome Back!" subtitle="Reset or update your password securely and safe data from un authorised user." />
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
