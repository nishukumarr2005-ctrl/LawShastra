import { verifyAccessToken } from '../utils/jwt.js'
import { hasPermission } from '../config/rbac.js'
import { sendError } from '../utils/response.js'

export const authenticate = (req, res, next) => {
  let token = null

  // 1. Check Authorization Header (Bearer token)
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  // 2. Check Cookie if header is missing
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc, str) => {
      const [key, val] = str.trim().split('=')
      if (key && val) acc[key] = decodeURIComponent(val)
      return acc
    }, {})
    token = cookies.access_token || null
  }

  if (!token) {
    return sendError(res, 'Authentication required', [], 401)
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    return sendError(res, 'Invalid or expired token', [], 401)
  }

  req.user = decoded
  next()
}

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401)
    }

    if (!hasPermission(req.user.permissions, permission)) {
      return sendError(res, `Forbidden: Insufficient permissions for ${permission}`, [], 403)
    }

    next()
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401)
    }

    if (!roles.includes(req.user.role) && !req.user.permissions?.includes('*')) {
      return sendError(res, 'Forbidden: Role unauthorized', [], 403)
    }

    next()
  }
}
