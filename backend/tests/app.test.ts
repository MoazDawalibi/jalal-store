import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

describe('API shell', () => {
  it('reports health with the standard envelope', async () => {
    const response = await request(app).get('/health').expect(200)
    expect(response.body).toEqual({ success: true, data: { status: 'ok' } })
    expect(response.headers['x-powered-by']).toBeUndefined()
    expect(response.headers['x-content-type-options']).toBe('nosniff')
  })

  it('allows configured development origins', async () => {
    const response = await request(app).options('/api/products').set('Origin', 'http://localhost:5173').expect(204)
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })

  it('rejects unconfigured origins', async () => {
    const response = await request(app).get('/health').set('Origin', 'https://untrusted.example').expect(403)
    expect(response.body.code).toBe('CORS_FORBIDDEN')
  })

  it('protects every admin route before database access', async () => {
    const response = await request(app).get('/api/admin/products').expect(401)
    expect(response.body).toMatchObject({ success: false, code: 'UNAUTHORIZED' })
  })

  it('returns a safe 400 response for malformed JSON', async () => {
    const response = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{').expect(400)
    expect(response.body).toMatchObject({ success: false, code: 'INVALID_JSON' })
  })

  it('returns a consistent 404 envelope', async () => {
    const response = await request(app).get('/missing').expect(404)
    expect(response.body).toMatchObject({ success: false, code: 'NOT_FOUND' })
  })
})
