import request from 'supertest'
import { beforeAll, describe, expect, it, vi } from 'vitest'

process.env.ORS_API_KEY = 'test-key'

vi.mock('../services/openRouteService.js', () => ({
  fetchRouteFromORS: vi.fn().mockResolvedValue({
    geometry: [[77.5, 12.9], [73.8, 15.4]],
    distanceMeters: 1,
    durationSeconds: 1,
    instructions: [],
  }),
}))

let app: import('express').Express

beforeAll(async () => {
  const mod = await import('../app.js')
  app = mod.createApp()
})

describe('POST /api/route', () => {
  it('rejects invalid coordinates', async () => {
    const response = await request(app)
      .post('/api/route')
      .send({ start: { latitude: 120, longitude: 10 }, end: { latitude: 10, longitude: 10 } })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain('Latitude')
  })

  it('accepts valid payload', async () => {
    const response = await request(app)
      .post('/api/route')
      .send({ start: { latitude: 10, longitude: 10 }, end: { latitude: 11, longitude: 11 } })

    expect(response.status).toBe(200)
    expect(response.body.geometry).toHaveLength(2)
  })
})
