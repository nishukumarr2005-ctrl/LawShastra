import { registerSchema, loginSchema } from '../../validators/auth.validator.js'

describe('auth validation schemas', () => {
  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse({
      name: 'Law Admin',
      email: 'admin@example.com',
      password: 'Password123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email format', () => {
    const result = registerSchema.safeParse({
      name: 'Law Admin',
      email: 'not-an-email',
      password: 'Password123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects short passwords', () => {
    const result = loginSchema.safeParse({
      email: 'admin@example.com',
      password: 'short',
    })

    expect(result.success).toBe(false)
  })
})
