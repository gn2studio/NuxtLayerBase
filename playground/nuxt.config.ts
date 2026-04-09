export default defineNuxtConfig({
  extends: ['../'],
  ssr: false,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      authPublicRoutes: '/',
    },
  },
})
