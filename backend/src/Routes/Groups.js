import express from 'express'
import { CreateGroup, DeleteGroup, GetGroupDetails, GetGroupMessage, GetUsersAllGroups, RemoveUserFromGroup, SendMessageGroup, UpdateGroupAdmins, UpdateGroupIcon, UpdateGroupMembers, UpdateGroupName } from '../Controllers/Groups.js'

const router = express.Router()

router.post('/create',CreateGroup)
router.post('/send',SendMessageGroup)
router.get('/group/:id',GetGroupDetails)
router.get('/:id',GetGroupMessage)
router.get('/groups/:id',GetUsersAllGroups)
router.put('/update',UpdateGroupMembers)
router.put('/update/groupname',UpdateGroupName)
router.put('/update/icon',UpdateGroupIcon)
router.put('/update/admin',UpdateGroupAdmins)
router.put('/removeuser',RemoveUserFromGroup)
router.delete('/:id',DeleteGroup)

export default router