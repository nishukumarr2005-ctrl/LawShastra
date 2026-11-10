import logger from '../config/logger.js'

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  })

  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [{ message: err.message }],
  })
}
