/**
 * auth.client.ts — Client-side plugin that hydrates auth state on app startup.
 *
 * Runs once when the Nuxt app is mounted in the browser.  It calls `loadUser()`
 * which reads any existing session from storage and populates the reactive
 * auth state — so components / middleware see the correct value immediately.
 */
export default defineNuxtPlugin(async () => {
  const { loadUser } = useAuth()
  await loadUser()
})
