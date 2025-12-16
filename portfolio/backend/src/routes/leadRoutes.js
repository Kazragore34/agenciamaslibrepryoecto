import express from 'express'
import { calculateLeadScore, trackEvent } from '../services/leadScoringService.js'

const router = express.Router()

// Obtener score de un lead
router.get('/score/:visitorId', async (req, res, next) => {
  try {
    const { visitorId } = req.params
    const score = await calculateLeadScore(visitorId)
    res.json({ visitorId, score })
  } catch (error) {
    next(error)
  }
})

// Trackear evento para lead scoring
router.post('/track', async (req, res, next) => {
  try {
    const { visitorId, eventType, metadata } = req.body
    await trackEvent(visitorId, eventType, metadata)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

export default router
