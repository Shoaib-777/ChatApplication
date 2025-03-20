import nodemailer from 'nodemailer'


const EMAILID = process.env.EMAILID
const PASSWORD = process.env.PASSWORD

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: EMAILID,
        pass: PASSWORD
    }
})

export function sendMail(to, otp) {
    transporter.sendMail({
        to: to,
        subject: "Reset Your Password for Chit-Chat",
        html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
  <p style="font-size: 16px; color: #333;">Dear <b>${to} User</b>,</p>
  <p style="font-size: 14px; color: #555;">
    You have requested to reset your password for <b style="color: #007bff;">Chit-Chat</b>. 
    Use the following One-Time Password (OTP) to proceed:
  </p>
  <h2 style="text-align: center; font-size: 24px; color: #d9534f; background: #fff3cd; padding: 10px; border-radius: 5px;">
    ${otp}
  </h2>
  <p style="font-size: 14px; color: #555;">
    For security reasons, please do not share this code with anyone. If you did not request a password reset, please ignore this email.
  </p>
  <p style="font-size: 14px; color: #333;">
    Best regards,<br>
    <b>Chit-Chat Team</b>
  </p>
</div>
`
    })
}