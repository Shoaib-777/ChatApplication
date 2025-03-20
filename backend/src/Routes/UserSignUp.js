import express from 'express'
import { UpdatePassword, UserLogin, UserSignUp, VerifyUserEmail } from '../Controllers/Signup.js'

const router = express.Router()

router.post('/login',UserLogin)
router.post('/',UserSignUp)
router.post('/verify',VerifyUserEmail)
router.put('/',UpdatePassword)

export default router