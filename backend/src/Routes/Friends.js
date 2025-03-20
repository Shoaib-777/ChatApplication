import express from 'express'
import { AcceptFriendRequest, AddFriends, DeleteFriend,CancelFriendRequest, GetUserFriends, GetUserFriendsRequest, GetUserFriendsRequestProfiles,  } from '../Controllers/Friends.js'

const router = express.Router()

router.post('/',AddFriends)
router.get('/:id',GetUserFriends)
router.get('/request/:id',GetUserFriendsRequest)
router.get('/request/profiles/:id',GetUserFriendsRequestProfiles)
router.put('/accepts',AcceptFriendRequest)
router.put('/cancel',CancelFriendRequest)
router.put('/:id',DeleteFriend)

export default router