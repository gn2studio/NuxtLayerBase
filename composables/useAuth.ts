/**
 * useAuth — OIDC authentication composable (oidc-client-ts)
 *
 * Wraps the Duende Identity Server / OIDC flow and exposes reactive auth
 * state plus helper functions that can be used anywhere in the app.
 *
 * Usage:
 *   const { isAuthenticated, user, login, logout, getAccessToken } = useAuth()
 */
import {
  UserManager,
  type UserManagerSettings,
  type User as OidcUser,
} from 'oidc-client-ts'
import type { AuthState, AuthToken, User } from '~/types'

// ─── Singleton UserManager ────────────────────────────────────────────────────
// The UserManager is created once and shared across all composable instances.
let _userManager: UserManager | null = null

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err))
}

function getMissingOidcSettings(config: ReturnType<typeof useRuntimeConfig>) {
  const missing: string[] = []

  if (!config.public.oidcIssuer) {
    missing.push('NUXT_PUBLIC_OIDC_ISSUER or NUXT_PUBLIC_AUTH_AUTHORITY')
  }

  if (!config.public.oidcClientId) {
    missing.push('NUXT_PUBLIC_OIDC_CLIENT_ID or NUXT_PUBLIC_AUTH_CLIENT_ID')
  }

  if (!config.public.oidcRedirectUri) {
    missing.push('NUXT_PUBLIC_OIDC_REDIRECT_URI or NUXT_PUBLIC_AUTH_REDIRECT_URI')
  }

  return missing
}

function getUserManager(): UserManager {
  if (_userManager) return _userManager

  const config = useRuntimeConfig()
  const missing = getMissingOidcSettings(config)

  if (missing.length > 0) {
    throw new Error(`OIDC 설정이 누락되었습니다: ${missing.join(', ')}`)
  }

  const settings: UserManagerSettings = {
    authority: config.public.oidcIssuer,
    client_id: config.public.oidcClientId,
    redirect_uri: config.public.oidcRedirectUri,
    post_logout_redirect_uri:
      // Fall back to the redirect_uri when no explicit post-logout URI is configured.
      // This is safe because both URIs point to the same app.
      config.public.oidcPostLogoutRedirectUri || config.public.oidcRedirectUri,
    scope: config.public.oidcScope,
    response_type: config.public.oidcResponseType,
    // Enable silent token renewal via a hidden iframe
    automaticSilentRenew: true,
    // oidc-client-ts uses WebStorageStateStore backed by sessionStorage by default
    // for browser session isolation.  Set `userStore` explicitly to change this,
    // e.g. `new WebStorageStateStore({ store: window.localStorage })`.
    userStore: undefined,
  }

  _userManager = new UserManager(settings)
  return _userManager
}

// ─── Shared reactive state (single instance across all composable calls) ──────
type AuthStateRef = ReturnType<typeof useState<AuthState>>

// Real underlying state ref, created lazily when first accessed via the proxy.
let _authStateReal: AuthStateRef | null = null

function ensureAuthState(): AuthStateRef {
  if (!_authStateReal) {
    _authStateReal = useState<AuthState>('auth', () => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    }))
  }
  return _authStateReal
}

// Publicly used shared state ref. This proxy defers the actual `useState` call
// until `_authState` is first accessed, avoiding Nuxt composable usage at
// module evaluation time while keeping the `_authState.value` API intact.
const _authState: AuthStateRef = new Proxy({} as AuthStateRef, {
  get(_target, prop, receiver) {
    const state = ensureAuthState()
    return Reflect.get(state as unknown as object, prop, receiver)
  },
  set(_target, prop, value, receiver) {
    const state = ensureAuthState()
    return Reflect.set(state as unknown as object, prop, value, receiver)
  },
})

// Track whether UserManager event listeners have already been registered.
let _eventsRegistered = false

// ─── Internal helpers ─────────────────────────────────────────────────────────

function mapOidcUser(oidcUser: OidcUser): { user: User; token: AuthToken } {
  const profile = oidcUser.profile

  const roles: string[] = (() => {
    const r = profile.role ?? profile['roles']
    if (!r) return []
    return Array.isArray(r) ? (r as string[]) : [r as string]
  })()

  const user: User = {
    ...profile,
    id: profile.sub,
    email: (profile.email as string) ?? '',
    name: profile.name ?? profile.preferred_username ?? profile.sub,
    roles,
  }

  const token: AuthToken = {
    accessToken: oidcUser.access_token,
    refreshToken: oidcUser.refresh_token ?? undefined,
    expiresAt: oidcUser.expires_at ?? undefined,
    scope: oidcUser.scope ?? undefined,
    tokenType: oidcUser.token_type ?? 'Bearer',
  }

  return { user, token }
}

// ─── Public composable ────────────────────────────────────────────────────────

export function useAuth() {
  // Only initialise the UserManager on the client side (it needs browser APIs).
  if (import.meta.client && !_eventsRegistered) {
    _eventsRegistered = true
    const manager = getUserManager()

    // Keep reactive state in sync with UserManager events.
    manager.events.addUserLoaded((oidcUser) => {
      const { user, token } = mapOidcUser(oidcUser)
      _authState.value.isAuthenticated = true
      _authState.value.user = user
      _authState.value.token = token
      _authState.value.error = null
    })

    manager.events.addUserUnloaded(() => {
      _authState.value.isAuthenticated = false
      _authState.value.user = null
      _authState.value.token = null
    })

    manager.events.addSilentRenewError((error) => {
      _authState.value.error = error.message
    })
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Redirect the user to the Identity Server login page.
   * Optional `state` payload is passed through the OIDC flow and available
   * in the callback.
   */
  async function login(state?: Record<string, unknown>): Promise<void> {
    if (!import.meta.client) return
    _authState.value.loading = true
    _authState.value.error = null
    try {
      await getUserManager().signinRedirect({ state })
    } catch (err: unknown) {
      const error = toError(err)
      _authState.value.error = error.message
      _authState.value.loading = false
      throw error
    }
  }

  /**
   * Redirect the user to the Identity Server logout endpoint.
   */
  async function logout(): Promise<void> {
    if (!import.meta.client) return
    _authState.value.loading = true
    _authState.value.error = null
    try {
      await getUserManager().signoutRedirect()
    } catch (err: unknown) {
      const error = toError(err)
      _authState.value.error = error.message
      _authState.value.loading = false
      throw error
    }
  }

  /**
   * Handle the OIDC callback after the user is redirected back from the
   * Identity Server.  Call this inside the redirect_uri page.
   */
  async function handleCallback(): Promise<void> {
    if (!import.meta.client) return
    _authState.value.loading = true
    _authState.value.error = null
    try {
      const oidcUser = await getUserManager().signinRedirectCallback()
      const { user, token } = mapOidcUser(oidcUser)
      _authState.value.isAuthenticated = true
      _authState.value.user = user
      _authState.value.token = token
    } catch (err: unknown) {
      const error = toError(err)
      _authState.value.error = error.message
      throw error
    } finally {
      _authState.value.loading = false
    }
  }

  /**
   * Handle the silent-renew callback inside the silent_redirect_uri page.
   */
  async function handleSilentCallback(): Promise<void> {
    if (!import.meta.client) return
    try {
      await getUserManager().signinSilentCallback()
    } catch (err: unknown) {
      const error = toError(err)
      _authState.value.error = error.message
      throw error
    }
  }

  /**
   * Load the user from local storage (useful on app startup / page refresh).
   */
  async function loadUser(): Promise<void> {
    if (!import.meta.client) return
    _authState.value.loading = true
    try {
      const oidcUser = await getUserManager().getUser()
      if (oidcUser && !oidcUser.expired) {
        const { user, token } = mapOidcUser(oidcUser)
        _authState.value.isAuthenticated = true
        _authState.value.user = user
        _authState.value.token = token
      } else {
        _authState.value.isAuthenticated = false
        _authState.value.user = null
        _authState.value.token = null
      }
    } catch {
      _authState.value.isAuthenticated = false
    } finally {
      _authState.value.loading = false
    }
  }

  /**
   * Return the current access token string, or null if not authenticated.
   */
  function getAccessToken(): string | null {
    return _authState.value.token?.accessToken ?? null
  }

  /**
   * Attempt a silent token refresh.  Returns the new access token or null.
   */
  async function refreshToken(): Promise<string | null> {
    if (!import.meta.client) return null
    try {
      const oidcUser = await getUserManager().signinSilent()
      if (oidcUser) {
        const { user, token } = mapOidcUser(oidcUser)
        _authState.value.isAuthenticated = true
        _authState.value.user = user
        _authState.value.token = token
        return token.accessToken
      }
    } catch (err: unknown) {
      _authState.value.error = err instanceof Error ? err.message : String(err)
    }
    return null
  }

  return {
    // Reactive state (readonly to discourage direct mutation)
    isAuthenticated: computed(() => _authState.value.isAuthenticated),
    user: computed(() => _authState.value.user),
    token: computed(() => _authState.value.token),
    loading: computed(() => _authState.value.loading),
    error: computed(() => _authState.value.error),

    // Actions
    login,
    logout,
    handleCallback,
    handleSilentCallback,
    loadUser,
    getAccessToken,
    refreshToken,
  }
}
