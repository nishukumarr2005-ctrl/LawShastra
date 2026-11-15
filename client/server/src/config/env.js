const gEnv =
  (typeof globalThis !== 'undefined' && globalThis.process?.env)
    ? globalThis.process.env
    : (typeof process !== 'undefined' ? process.env : {})

export const env = {
  port: Number(gEnv.PORT || 5000),
  nodeEnv: gEnv.NODE_ENV || 'development',
  databaseUrl: gEnv.DATABASE_URL || '',
  jwtSecret: gEnv.JWT_SECRET || 'local-development-secret',
  jwtExpiresIn: gEnv.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: gEnv.JWT_REFRESH_SECRET || 'local-development-refresh-secret',
  jwtRefreshExpiresIn: gEnv.JWT_REFRESH_EXPIRES_IN || '30d',
  corsOrigin: gEnv.CORS_ORIGIN || 'http://localhost:5173',
  apiVersion: gEnv.API_VERSION || 'v1',
  logLevel: gEnv.LOG_LEVEL || 'info',
  rateLimitWindowMs: Number(gEnv.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMaxRequests: Number(gEnv.RATE_LIMIT_MAX_REQUESTS || 100),
}

if (gEnv && !gEnv.DATABASE_URL && env.databaseUrl) {
  gEnv.DATABASE_URL = env.databaseUrl
}
