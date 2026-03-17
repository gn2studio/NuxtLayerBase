/**
 * auth.global.ts — Global route middleware that protects authenticated routes.
 *
 * By default every route is protected.  To mark a route as public, either:
 *
 *   a) Set the `NUXT_PUBLIC_AUTH_PUBLIC_ROUTES` env var to a comma-separated
 *      list of route prefixes:
 *        NUXT_PUBLIC_AUTH_PUBLIC_ROUTES=/,/about,/login,/auth
 *
 *   b) Add `definePageMeta({ auth: false })` in the page component.
 *
 * This middleware runs on the client only (oidc-client-ts is browser-only).
 */
import { watch } from 'vue'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side rendering — OIDC state is only available in the browser.
  if (import.meta.server) return

  // Allow routes that explicitly opt out via page meta
  const meta = to.meta as Record<string, unknown>
  if (meta.auth === false) return

  const config = useRuntimeConfig()
  const publicRoutes = (config.public.authPublicRoutes as string)
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)

  // Allow routes whose path starts with any public prefix
  const isPublic = publicRoutes.some(
    (prefix) => to.path === prefix || to.path.startsWith(prefix + '/'),
  )
  if (isPublic) return

  const { isAuthenticated, loading, loadUser, login } = useAuth()

  // Ensure auth state is hydrated before deciding whether to redirect.
  if (!isAuthenticated.value) {
    if (!loading.value) {
      // No hydration in progress, trigger it ourselves.
      await loadUser()
    } else {
      // Hydration already in progress (e.g. from auth.client plugin);
      // wait for it to finish before checking auth status.
      await new Promise<void>((resolve) => {
        const stop = watch(
          () => loading.value,
          (isLoading) => {
            if (!isLoading) {
              stop()
              resolve()
            }
          },
        )
      })
    }
  }

  if (!isAuthenticated.value) {
    // Pass the current path as post-login redirect state
    await login({ returnTo: to.fullPath })
    // Abort navigation — the browser will redirect to the Identity Server
    return abortNavigation()
  }
})
