import express from 'express'
import { createRetellCall, handleRetellWebhook } from '../services/retellService.js'
import { verifyRetellSignature } from '../middleware/retellAuth.js'

const router = express.Router()

// Crear llamada de prueba
router.post('/create-call', async (req, res, next) => {
  try {
    const accessToken = await createRetellCall()
    res.json({ access_token: accessToken })
  } catch (error) {
    next(error)
  }
})

// Webhook para eventos de Retell
router.post('/webhook', verifyRetellSignature, async (req, res, next) => {
  try {
    await handleRetellWebhook(req.body)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
