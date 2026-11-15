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
// Disable CSP so /api/docs (Swagger UI via CDN + inline init) can load; keep other helmet protections
app.use(helmet({ contentSecurityPolicy: false }))

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

app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec)
})

app.get('/api/docs', (req, res) => {
  const spec = swaggerSpec || {}
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const groups = {}
  for (const [p, methods] of Object.entries(spec.paths || {})) {
    for (const [m, op] of Object.entries(methods || {})) {
      const tag = (op && op.tags && op.tags[0]) || 'Other'
      if (!groups[tag]) groups[tag] = []
      groups[tag].push({
        method: m.toUpperCase(),
        path: p,
        summary: (op && op.summary) || '',
        auth: Boolean(op && op.security),
      })
    }
  }
  const sections = Object.entries(groups)
    .map(([tag, items]) => {
      const rows = items
        .map(
          (i) =>
            `<tr><td><code>${esc(i.method)}</code></td><td><code>${esc(i.path)}</code></td><td>${esc(i.summary)}</td><td>${i.auth ? 'Bearer' : ''}</td></tr>`
        )
        .join('')
      return `<details open><summary><strong>${esc(tag)}</strong> (${items.length})</summary>
<table><thead><tr><th>Method</th><th>Path</th><th>Summary</th><th>Auth</th></tr></thead><tbody>${rows}</tbody></table></details>`
    })
    .join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(spec.info?.title || 'API Docs')}</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;margin:24px;color:#111;background:#fff}h1{margin:0 0 8px}p{margin:6px 0}table{border-collapse:collapse;width:100%;margin:8px 0 16px}th,td{border:1px solid #e2e5ea;padding:8px;text-align:left;font-size:14px;vertical-align:top}th{background:#f6f7f9}code{background:#f1f3f5;padding:2px 5px;border-radius:4px}details{margin:14px 0}summary{cursor:pointer;font-size:16px}.meta{color:#444}</style>
</head><body>
<h1>${esc(spec.info?.title || 'API')}</h1>
<p class="meta">${esc(spec.info?.description || '')}</p>
<p class="meta">Base: <code>${esc((spec.servers && spec.servers[0] && spec.servers[0].url) || '/api/v1')}</code> · OpenAPI: <a href="/api/docs.json">/api/docs.json</a></p>
${sections || '<p>No paths found in spec.</p>'}
</body></html>`
  res.type('html').send(html)
})

app.use(`/api/${env.apiVersion}`, apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
