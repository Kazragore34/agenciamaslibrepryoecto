import { logger } from '../utils/logger.js'
import crypto from 'crypto'

export function verifyRetellSignature(req, res, next) {
  const signature = req.headers['x-retell-signature']
  const RETELL_API_KEY = process.env.RETELL_API_KEY

  if (!signature || !RETELL_API_KEY) {
    logger.warn('Missing Retell signature or API key')
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    // Retell usa HMAC SHA256 para firmar los webhooks
    const body = JSON.stringify(req.body)
    const expectedSignature = crypto
      .createHmac('sha256', RETELL_API_KEY)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      logger.warn('Invalid Retell signature')
      return res.status(401).json({ error: 'Firma inválida' })
    }

    next()
  } catch (error) {
    logger.error('Error verifying Retell signature:', error)
    return res.status(500).json({ error: 'Error al verificar firma' })
  }
}
