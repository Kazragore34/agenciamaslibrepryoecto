import { logger } from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })

  const statusCode = err.statusCode || 500
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
}
