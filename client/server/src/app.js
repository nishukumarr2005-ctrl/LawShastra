import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
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

// Lightweight body parsing to avoid body-parser/iconv-lite issues in Workers runtime
app.use((req, _res, next) => {
  const method = (req.method || '').toUpperCase()
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return next()
  const ct = String(req.headers['content-type'] || '').toLowerCase()
  if (!ct.includes('application/json')) {
    req.body = req.body ?? {}
    return next()
  }
  let raw = ''
  req.setEncoding?.('utf8')
  req.on('data', (chunk) => {
    raw += chunk
    if (raw.length > 1_000_000) {
      req.destroy?.()
    }
  })
  req.on('end', () => {
    if (!raw) {
      req.body = {}
      return next()
    }
    try {
      req.body = JSON.parse(raw)
    } catch {
      req.body = {}
    }
    next()
  })
  req.on('error', next)
})

app.use(morgan('combined'))

let apiLimiter
app.use('/api/v1', (req, res, next) => {
  if (!apiLimiter) {
    apiLimiter = rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMaxRequests,
      standardHeaders: true,
      legacyHeaders: false,
    })
  }
  return apiLimiter(req, res, next)
})

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { status: 'ok' } })
})

app.get('/api/docs', (req, res) => {
  res.json(swaggerSpec)
})

app.use(`/api/${env.apiVersion}`, apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
