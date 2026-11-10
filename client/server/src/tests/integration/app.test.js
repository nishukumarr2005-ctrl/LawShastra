import request from 'supertest'
import app from '../../app.js'

describe('API health and routes', () => {
  it('returns ok for the health endpoint', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.status).toBe('ok')
  })

  it('returns auth registration placeholder response', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test Admin', email: 'admin@example.com', password: 'Pass12345' })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe('admin@example.com')
  })
})
