import Joi from 'joi'

const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  sessionId: Joi.string().optional()
})

export function validateChatMessage(req, res, next) {
  const { error } = chatMessageSchema.validate(req.body)
  
  if (error) {
    return res.status(400).json({ 
      error: 'Mensaje inválido',
      details: error.details[0].message 
    })
  }
  
  next()
}
