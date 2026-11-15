import { sendSuccess, sendError } from '../utils/response.js'
import { loginUser, getUserById } from '../services/auth.service.js'

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return sendError(res, 'Email and password are required', [], 400)
    }

    const result = await loginUser({ email, password })

    // Set secure HttpOnly cookies for session storage
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 mins
    })

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return sendSuccess(res, 'Login successful', {
      user: result.user,
      token: result.accessToken,
    })
  } catch (error) {
    return sendError(res, error.message || 'Login failed', [], 401)
  }
}

export const getMeController = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, 'Unauthorized', [], 401)
    }

    let user = await getUserById(req.user.id)
    if (!user) {
      // Fallback to verified token payload if DB record is not accessible
      user = {
        id: req.user.id,
        name: req.user.name || 'Admin User',
        email: req.user.email,
        role: req.user.role,
        isActive: true,
        permissions: req.user.permissions,
      }
    }

    return sendSuccess(res, 'Current user profile fetched', user)
  } catch (error) {
    return next(error)
  }
}

export const logoutController = async (req, res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return sendSuccess(res, 'Logged out successfully', { loggedOut: true })
}
