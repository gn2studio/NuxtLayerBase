// https://nuxt.com/docs/guide/going-further/layers
export default defineNuxtConfig({
  /**
   * Modules bundled with the layer.
   * Sub-projects that extend this layer will automatically inherit these modules.
   */
  modules: ['@nuxtjs/tailwindcss'],

  /**
   * Runtime configuration exposed to the application.
   * Values are overridden by the matching environment variables in the
   * consuming project's .env file.
   *
   * Public keys are exposed to the client; private keys are server-only.
   */
  runtimeConfig: {
    // Server-only – never sent to the browser
    oidcClientSecret: '',

    public: {
      // OIDC / Duende Identity Server settings
      oidcIssuer: '',
      oidcClientId: '',
      oidcRedirectUri: '',
      oidcPostLogoutRedirectUri: '',
      oidcScope: 'openid profile email offline_access',
      oidcResponseType: 'code',

      // Base URL for API requests made via useApi()
      apiBaseUrl: '',

      // Base URL for the authentication domain API
      authApiBaseUrl: '',

      // Convenience flag: routes that do NOT require authentication.
      // Comma-separated list of route prefixes, e.g. "/,/about,/login"
      authPublicRoutes: '/',
    },
  },

  /**
   * Tailwind CSS – point to the layer-level config as the default.
   * Sub-projects may provide their own tailwind.config.ts to extend it.
   */
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
    exposeConfig: true,
  },

  /**
   * TypeScript strict mode for the layer.
   */
  typescript: {
    strict: true,
  },
})
