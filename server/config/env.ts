import { z } from 'zod'

const envSchema = z.object({
  ORS_API_KEY: z.string().min(1, 'ORS_API_KEY is required'),
  ORS_API_BASE_URL: z.string().url().default('https://api.openrouteservice.org'),
  PORT: z.coerce.number().int().positive().default(8787),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export type ServerEnv = z.infer<typeof envSchema>

export const getServerEnv = (): ServerEnv => {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(', '))
  }
  return parsed.data
}
