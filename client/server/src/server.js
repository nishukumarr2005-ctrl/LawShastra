import app from './app.js'
import { env } from './config/env.js'
import logger from './config/logger.js'

const startServer = async () => {
  try {
    app.listen(env.port, () => {
      logger.info(`LawShastra server started on port ${env.port}`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()
