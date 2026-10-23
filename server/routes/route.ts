import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { HttpError, asyncHandler } from '../middleware/errorHandler.js'
import { fetchRouteFromORS } from '../services/openRouteService.js'
import { isValidLatitude, isValidLongitude } from '../utils/validation.js'

const coordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const routeRequestSchema = z.object({
  start: coordinateSchema,
  end: coordinateSchema,
})

const router = Router()

router.use(
  rateLimit({
    windowMs: 60_000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

router.post(
  '/route',
  asyncHandler(async (req, res) => {
    const parsed = routeRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new HttpError(400, 'Invalid route request payload')
    }

    const { start, end } = parsed.data
    if (!isValidLatitude(start.latitude) || !isValidLatitude(end.latitude)) {
      throw new HttpError(400, 'Latitude must be between -90 and 90')
    }
    if (!isValidLongitude(start.longitude) || !isValidLongitude(end.longitude)) {
      throw new HttpError(400, 'Longitude must be between -180 and 180')
    }

    const route = await fetchRouteFromORS(start, end)
    if (!route.geometry.length) {
      throw new HttpError(502, 'No valid road route found')
    }

    res.json(route)
  }),
)

export default router
