import cors from 'cors'
import express from 'express'
import { getServerEnv } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import routeRouter from './routes/route.js'

export const createApp = (): express.Express => {
  const env = getServerEnv()

  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '20kb' }))
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
    }),
  )

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', routeRouter)
  app.use(errorHandler)

  return app
}
