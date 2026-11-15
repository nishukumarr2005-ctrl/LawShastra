import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn || '15m',
  })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret || env.jwtSecret, {
    expiresIn: env.jwtRefreshExpiresIn || '7d',
  })
}

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch (err) {
    return null
  }
}

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret || env.jwtSecret)
  } catch (err) {
    return null
  }
}
