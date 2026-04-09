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

      // Built-in UI toggles for this layer (Alert/Confirm/Toast).
      // Set false in a consuming project when you want to provide your own UI.
      uiUseBuiltInAlert: true,
      uiUseBuiltInConfirm: true,
      uiUseBuiltInToast: true,
      uiUseBuiltInLoading: true,
      uiUseBuiltInProgressLoading: true,

      // Keep overlays above any app layer by default.
      uiOverlayZIndex: 2147483000,
      uiToastZIndex: 2147483001,
      uiLoadingZIndex: 2147483002,
      uiProgressLoadingZIndex: 2147483003,
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
