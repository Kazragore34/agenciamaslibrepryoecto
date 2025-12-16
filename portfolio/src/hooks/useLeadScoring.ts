import { useEffect, useState } from 'react'
import { trackEvent } from '../utils/analytics'

interface LeadScore {
  total: number
  breakdown: {
    pages: number
    time: number
    interactions: number
    ctas: number
    forms: number
    retellCalls: number
    chats: number
  }
}

const SCORING_WEIGHTS = {
  pages: 10,
  time: 1, // por minuto
  interactions: 5,
  ctas: 20,
  forms: 50,
  retellCalls: 30,
  chats: 15,
}

export function useLeadScoring() {
  const [score, setScore] = useState<LeadScore>({
    total: 0,
    breakdown: {
      pages: 0,
      time: 0,
      interactions: 0,
      ctas: 0,
      forms: 0,
      retellCalls: 0,
      chats: 0,
    },
  })

  useEffect(() => {
    // Cargar score desde localStorage
    const savedScore = localStorage.getItem('lead_score')
    if (savedScore) {
      try {
        setScore(JSON.parse(savedScore))
      } catch (error) {
        console.error('Error loading lead score:', error)
      }
    }

    // Iniciar tracking de tiempo
    const startTime = Date.now()
    const interval = setInterval(() => {
      const minutesSpent = Math.floor((Date.now() - startTime) / 60000)
      updateScore('time', minutesSpent * SCORING_WEIGHTS.time)
    }, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

  const updateScore = (type: keyof typeof SCORING_WEIGHTS, value: number) => {
    setScore((prev) => {
      const newScore = {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          [type]: value,
        },
        total: Object.values({
          ...prev.breakdown,
          [type]: value,
        }).reduce((sum, val) => sum + val, 0),
      }
      localStorage.setItem('lead_score', JSON.stringify(newScore))
      return newScore
    })
  }

  const trackPageView = () => {
    setScore((prev) => {
      const newPages = prev.breakdown.pages + 1
      const newScore = {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          pages: newPages,
        },
        total: prev.total + SCORING_WEIGHTS.pages,
      }
      localStorage.setItem('lead_score', JSON.stringify(newScore))
      return newScore
    })
  }

  const trackInteraction = () => {
    updateScore('interactions', score.breakdown.interactions + SCORING_WEIGHTS.interactions)
  }

  const trackCTA = () => {
    updateScore('ctas', score.breakdown.ctas + SCORING_WEIGHTS.ctas)
    trackEvent('cta_click')
  }

  const trackFormSubmit = () => {
    updateScore('forms', score.breakdown.forms + SCORING_WEIGHTS.forms)
    trackEvent('form_submit', { form_name: 'contact' })
  }

  const trackRetellCall = () => {
    updateScore('retellCalls', score.breakdown.retellCalls + SCORING_WEIGHTS.retellCalls)
    trackEvent('retell_call_started')
  }

  const trackChat = () => {
    updateScore('chats', score.breakdown.chats + SCORING_WEIGHTS.chats)
    trackEvent('chatbot_message')
  }

  return {
    score,
    trackPageView,
    trackInteraction,
    trackCTA,
    trackFormSubmit,
    trackRetellCall,
    trackChat,
  }
}
