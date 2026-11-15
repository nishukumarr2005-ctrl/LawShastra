import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const SALT_ROUNDS = 12

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password, hash) => {
  if (!password || !hash) return false
  return bcrypt.compare(password, hash)
}

export const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex')
}

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
