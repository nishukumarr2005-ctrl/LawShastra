import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { swaggerSpec } from './config/swagger.js'
import apiRoutes from './routes/index.js'
import { notFoundHandler } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

const allowedOrigins = env.corsOrigin
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    // allow non-browser/ same-origin requests with no Origin header
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // allow any localhost dev port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return callback(null, true)
    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

app.use(
  '/api/v1',
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { status: 'ok' } })
})

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(`/api/${env.apiVersion}`, apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
