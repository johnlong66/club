export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'People I Know',
      short_name: 'People',
      description: 'Keep track of people you know',
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
    },
  },
})
