import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export default async ({ app }: { app: App }) => {
  app.use(pinia)
}

export { pinia }
