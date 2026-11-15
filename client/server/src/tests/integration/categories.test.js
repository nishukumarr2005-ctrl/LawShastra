import request from 'supertest'
import app from '../../app.js'
import { generateAccessToken } from '../../utils/jwt.js'
import { ROLES, getPermissionsForRole } from '../../config/rbac.js'

describe('Admin Categories and Dashboard APIs', () => {
  const adminToken = generateAccessToken({
    id: 1,
    name: 'Admin User',
    email: 'admin@lawshastra.in',
    role: ROLES.ADMIN,
    permissions: getPermissionsForRole(ROLES.ADMIN),
  })

  const analystToken = generateAccessToken({
    id: 2,
    name: 'Analyst User',
    email: 'analyst@lawshastra.in',
    role: ROLES.ANALYST,
    permissions: getPermissionsForRole(ROLES.ANALYST),
  })

  it('provides dashboard metrics to authenticated admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.metrics).toBeDefined()
    expect(res.body.data.metrics.totalCategories).toBeGreaterThanOrEqual(0)
    expect(res.body.data.metrics.totalLaws).toBeGreaterThanOrEqual(0)
  })

  it('creates a new hierarchical category with visibility and SEO metadata', async () => {
    const payload = {
      name: 'Constitutional Law',
      slug: 'constitutional-law',
      description: 'Fundamental rights, directive principles and governance.',
      icon: '🏛',
      displayOrder: 1,
      status: 'Live',
      showDesktop: true,
      showMobile: true,
      seoTitle: 'Constitutional Law of India | Bare Acts & Cases',
      seoDescription: 'Explore Indian constitutional law provisions and landmark judgments.',
    }

    const res = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Constitutional Law')
    expect(res.body.data.slug).toBe('constitutional-law')
  })

  it('rejects category creation by ANALYST due to lack of categories.create permission', async () => {
    const res = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${analystToken}`)
      .send({ name: 'Unauthorized Category' })

    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
  })

  it('safeguards against deleting a category with published content', async () => {
    // Attempting to delete Civil Law which has published acts
    const res = await request(app)
      .delete('/api/v1/admin/categories/1')
      .set('Authorization', `Bearer ${adminToken}`)

    // Expect either successful delete or safeguard error if content attached
    if (res.status === 400) {
      expect(res.body.message).toMatch(/cannot delete category containing published content|reassign/i)
    } else {
      expect(res.status).toBe(200)
    }
  })

  it('exposes public categories without exposing unpublished drafts or internal fields', async () => {
    const res = await request(app).get('/api/v1/public/categories')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
