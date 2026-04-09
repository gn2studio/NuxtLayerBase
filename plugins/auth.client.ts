/**
 * auth.client.ts — Client-side plugin that hydrates auth state on app startup.
 *
 * Runs once when the Nuxt app is mounted in the browser.  It calls `loadUser()`
 * which reads any existing session from storage and populates the reactive
 * auth state — so components / middleware see the correct value immediately.
 */
export default defineNuxtPlugin({
  name: 'auth-hydration',
  async setup() {
    const config = useRuntimeConfig()
    const hasOidcConfig =
      !!config.public.oidcIssuer &&
      !!config.public.oidcClientId &&
      !!config.public.oidcRedirectUri

    // Allow layer UI preview (and local development without .env) to boot
    // without crashing when OIDC settings are not configured.
    if (!hasOidcConfig) {
      if (import.meta.dev) {
        console.info(
          '[auth-hydration] Skipped: missing OIDC config (issuer/clientId/redirectUri).',
        )
      }
      return
    }

    const { loadUser } = useAuth()

    // Register profile sync once so auth restoration and later auth changes
    // automatically load or clear the current user's detailed profile.
    useCurrentUserProfile()

    await loadUser()
  },
})
