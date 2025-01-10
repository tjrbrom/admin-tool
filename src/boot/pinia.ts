import { createPinia } from 'pinia'
import type { App } from 'vue'

export default async ({ app }: { app: App }) => {
  app.use(createPinia())
}
