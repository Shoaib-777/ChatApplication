import express from 'express'
import { DeleteUserAccount, GetAllUsers, GetSingleUser,  UpdateUserProfile } from '../Controllers/Users.js'

const router = express.Router()

router.get('/',GetAllUsers)
router.get('/:id',GetSingleUser)
router.put('/:id',UpdateUserProfile)
router.delete('/:id',DeleteUserAccount)


export default router