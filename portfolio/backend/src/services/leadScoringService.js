import { logger } from '../utils/logger.js'

// Sistema de scoring basado en reglas
const SCORING_RULES = {
  page_view: 10,
  time_on_site: 1, // por minuto
  interaction: 5, // clicks, scrolls
  download: 20,
  cta_click: 20,
  form_submit: 50,
  retell_call: 30,
  chatbot_message: 15,
}

// Almacenamiento en memoria (en producción usar Redis o DB)
const leadScores = new Map()
const leadEvents = new Map()

export function trackEvent(visitorId, eventType, metadata = {}) {
  if (!visitorId) {
    throw new Error('visitorId es requerido')
  }

  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    metadata
  }

  // Guardar evento
  if (!leadEvents.has(visitorId)) {
    leadEvents.set(visitorId, [])
  }
  leadEvents.get(visitorId).push(event)

  // Calcular score
  const points = SCORING_RULES[eventType] || 0
  const currentScore = leadScores.get(visitorId) || 0
  const newScore = currentScore + points

  leadScores.set(visitorId, newScore)

  logger.info('Event tracked', { visitorId, eventType, points, newScore })

  return newScore
}

export function calculateLeadScore(visitorId) {
  if (!visitorId) {
    throw new Error('visitorId es requerido')
  }

  const baseScore = leadScores.get(visitorId) || 0
  const events = leadEvents.get(visitorId) || []

  // Calcular tiempo en sitio (si hay eventos)
  let timeOnSite = 0
  if (events.length > 1) {
    const firstEvent = new Date(events[0].timestamp)
    const lastEvent = new Date(events[events.length - 1].timestamp)
    timeOnSite = Math.floor((lastEvent - firstEvent) / 1000 / 60) // minutos
  }

  // Agregar puntos por tiempo en sitio
  const timePoints = timeOnSite * SCORING_RULES.time_on_site
  const totalScore = baseScore + timePoints

  return {
    score: totalScore,
    baseScore,
    timeOnSite,
    eventsCount: events.length,
    category: getScoreCategory(totalScore)
  }
}

function getScoreCategory(score) {
  if (score >= 100) return 'hot'
  if (score >= 50) return 'warm'
  if (score >= 20) return 'cool'
  return 'cold'
}
