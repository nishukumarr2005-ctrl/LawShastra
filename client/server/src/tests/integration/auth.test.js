import request from 'supertest'
import app from '../../app.js'
import { generateAccessToken } from '../../utils/jwt.js'
import { ROLES, getPermissionsForRole } from '../../config/rbac.js'

describe('Authentication and RBAC Endpoints', () => {
  it('rejects access to /api/v1/auth/me without an authentication token', async () => {
    const res = await request(app).get('/api/v1/auth/me')

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/unauthorized|authentication required/i)
  })

  it('rejects login with missing fields', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: '' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('allows access to /api/v1/auth/me with a valid Bearer token', async () => {
    const permissions = getPermissionsForRole(ROLES.SUPER_ADMIN)
    const token = generateAccessToken({
      id: 999,
      email: 'admin@lawshastra.in',
      name: 'Super Admin',
      role: ROLES.SUPER_ADMIN,
      permissions,
    })

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe('admin@lawshastra.in')
    expect(res.body.data.role).toBe(ROLES.SUPER_ADMIN)
    expect(res.body.data.permissions).toContain('*')
  })

  it('enforces RBAC permissions: rejects user with insufficient permissions', async () => {
    // ANALYST only has read permissions; cannot access users.manage
    const permissions = getPermissionsForRole(ROLES.ANALYST)
    const analystToken = generateAccessToken({
      id: 888,
      email: 'analyst@lawshastra.in',
      name: 'Legal Analyst',
      role: ROLES.ANALYST,
      permissions,
    })

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${analystToken}`)

    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/forbidden|insufficient permissions/i)
  })

  it('allows user with users.read permission to access /api/v1/admin/users', async () => {
    const permissions = getPermissionsForRole(ROLES.ADMIN)
    const adminToken = generateAccessToken({
      id: 777,
      email: 'admin_content@lawshastra.in',
      name: 'Content Admin',
      role: ROLES.ADMIN,
      permissions,
    })

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
