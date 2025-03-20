import express from 'express'
import { SendOTPViaMail, VerifyOTP } from '../Controllers/EmailSend.js'

const router = express.Router()

router.post('/',SendOTPViaMail)
router.post('/verify',VerifyOTP)

export default router