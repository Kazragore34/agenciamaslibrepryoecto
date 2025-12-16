import express from 'express'
import { sendMessageToN8N } from '../services/n8nService.js'
import { validateChatMessage } from '../middleware/validation.js'

const router = express.Router()

router.post('/send', validateChatMessage, async (req, res, next) => {
  try {
    const { message, sessionId } = req.body
    
    const response = await sendMessageToN8N(message, sessionId)
    
    res.json({ 
      response,
      sessionId: sessionId || `session_${Date.now()}`
    })
  } catch (error) {
    next(error)
  }
})

export default router
