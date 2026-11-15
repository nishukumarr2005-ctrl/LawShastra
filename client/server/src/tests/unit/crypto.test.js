import { hashPassword, comparePassword, generateSecureToken, hashToken } from '../../utils/crypto.js'

describe('Crypto Utility', () => {
  it('hashes a password and verifies it correctly', async () => {
    const raw = 'SecureLegalPass123!'
    const hash = await hashPassword(raw)

    expect(hash).toBeDefined()
    expect(hash).not.toBe(raw)
    expect(hash.startsWith('$2')).toBe(true)

    const isMatch = await comparePassword(raw, hash)
    expect(isMatch).toBe(true)

    const isWrongMatch = await comparePassword('WrongPassword', hash)
    expect(isWrongMatch).toBe(false)
  })

  it('generates random hex tokens of specified length', () => {
    const token1 = generateSecureToken(32)
    const token2 = generateSecureToken(32)

    expect(token1).toHaveLength(64)
    expect(token2).toHaveLength(64)
    expect(token1).not.toBe(token2)
  })

  it('hashes tokens consistently using sha256', () => {
    const token = 'sample-secret-refresh-token'
    const hash1 = hashToken(token)
    const hash2 = hashToken(token)

    expect(hash1).toBe(hash2)
    expect(hash1).toHaveLength(64)
  })
})
