import { createApp } from './app.js'
import { getServerEnv } from './config/env.js'

const env = getServerEnv()
const app = createApp()

app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT}`)
})
