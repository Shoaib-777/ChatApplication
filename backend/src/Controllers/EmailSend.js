import User from '../Models/User.js';
import { sendMail } from '../utils/SendOtpToMail.js';
import { GenerateToken } from '../utils/Tokens.js';
import jwt from 'jsonwebtoken'



export const SendOTPViaMail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ Issent: false, message: "Email and OTP are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ Issent: false, message: "User account is not registered with this email." });
        }

        // Generate a token for security purposes
        const token = GenerateToken(otp);
        const sendSucess = sendMail(email,otp)
        // Set OTP Token in Cookie
        res.cookie("otp", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,  // Use secure in production only
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: "strict"
        });
        

        return res.status(200).json({ Issent: true, message: "OTP sent successfully." });

    } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ Issent: false, message: "Internal server error. Failed to send OTP.", error: error.message });
    }
};



export const VerifyOTP = async (req, res) => {
    const { otp } = req.body;
    const token = req.cookies.otp;

    try {
        if (!otp) {
            return res.status(400).json({ isValid: false, message: "OTP is required." });
        }
        if (!token) {
            return res.status(401).json({ isValid: false, message: "No OTP token found. Request a new one." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET);

        // Ensure OTP matches
        if (!decoded || String(decoded.data) !== String(otp)) {
            return res.status(400).json({ isValid: false, message: "Invalid or expired OTP." });
        }

        // OTP is valid, clear cookie
        res.clearCookie("otp");
        res.cookie("otp_sucess", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,  // Use secure in production only
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: "strict"
        });
        return res.status(200).json({ isValid: true, message: "OTP verified successfully." });

    } catch (error) {
        console.error("Error verifying OTP:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ isValid: false, message: "OTP has expired. Request a new one." });
        }

        return res.status(500).json({ isValid: false, message: "Error verifying OTP. Please try again." });
    }
};
