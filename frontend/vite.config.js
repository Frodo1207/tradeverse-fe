import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = decodeURIComponent(new URL('.', import.meta.url).pathname)
  const env = loadEnv(mode, root, '')
  const apiTarget = env.VITE_API_PROXY_TARGET || env.VITE_PROXY_TARGET || 'http://localhost:9001'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
