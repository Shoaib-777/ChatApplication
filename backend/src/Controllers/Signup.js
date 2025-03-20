import ConnectDB from "../DB/ConnectDB.js";
import User from "../Models/User.js";
import bcrypt from 'bcrypt'

export const UserSignUp = async (req, res) => {
    const { name, email, profile, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create new user
        const newUser = new User({
            name,
            email,
            profile,
            password:hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.log("error signup user", error)
        return res.status(500).json({ message: "Error User Signup", error: error.message });
    }
};


export const UserLogin = async (req,res) => {
    const {email,password}=req.body
    try {
        if(!email || !password){
            return res.status(400).json({message:"email and password is required to login"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({isPasswordCorrect:false,message:"Incorrect Email or Password"})
        }
        return res.status(200).json({isPasswordCorrect:true,message:"Login Sucessfully",userId:user._id})
    } catch (error) {
        console.log("error user login",error)
        return res.status(500).json({message:"error user login internal server error",error:error})
    }
}

export const VerifyUserEmail = async(req,res)=>{
    const {email} = req.body
    try{
        if(!email){
            return res.status(400).josn({message:"Email id is required to verify user"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({IsUserExists:false,message:"user account not registered with this email"})
        }
        return res.status(200).json({IsUserExists:true,message:"user found with email and email is registered"})
    }catch(error){
        console.log("error veryfying  user email ",error)
        return res.status(500).json({message:"internal server error for verifying user email"})
    }
}

export const UpdatePassword = async(req,res)=>{
    const {email,password} = req.body
    const token = req.cookies.otp_sucess;
    if(!token){
        return res.status(400).json({PasswordUpdated:false,message:"user otp session should sucess"})
    }
    try{
        if(!email || !password){
            return res.status(400).json({PasswordUpdated:false,message:"Email id and password is required to update password of user"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({PasswordUpdated:false,message:"user account not registered with this email and password not updated "})
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword
        await user.save()
        res.clearCookie("otp_sucess");
        return res.status(200).json({PasswordUpdated:true,message:"user password updated sucessfully"})
    }catch(error){
        console.log("error updating user password ",error)
        return res.status(500).json({PasswordUpdated:false,message:"internal server error for updating user password"})
    }
}