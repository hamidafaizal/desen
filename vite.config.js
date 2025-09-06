import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Desen',
        short_name: 'Desen',
        description: 'Aplikasi Desain Grafis',
        theme_color: '#2D3748',
        icons: [
          {
            src: 'logodesen192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logodesen512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})

