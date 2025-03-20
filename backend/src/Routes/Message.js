import express from 'express'
import { DeletedMessage, GetSelectedUserMessages, SendMessage } from '../Controllers/Messages.js'

const router = express.Router()

router.get('/:id',GetSelectedUserMessages)
router.post('/',SendMessage)
router.put('/:id',DeletedMessage)

export default router