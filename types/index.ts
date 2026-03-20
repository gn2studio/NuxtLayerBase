// ─── Common TypeScript types for the NuxtLayerBase ───────────────────────────

/**
 * Basic user information returned by the OIDC provider.
 *
 * The index signature `[key: string]: unknown` allows arbitrary OIDC claims
 * (e.g. custom claims added by the identity provider) to be stored alongside
 * the typed properties without casting.  TypeScript will still enforce that
 * the typed properties are present when creating a value of this type.
 */
export interface User {
  /** Unique subject identifier from the identity provider */
  id: string
  /** Primary email address */
  email: string
  /** Human-readable display name */
  name: string
  /** List of role claims (e.g. ["admin", "editor"]) */
  roles: string[]
  /** Any extra claims surfaced by the identity provider */
  [key: string]: unknown
}

/**
 * Access / refresh token pair with metadata.
 */
export interface AuthToken {
  /** JWT access token */
  accessToken: string
  /** Opaque or JWT refresh token (may be absent for implicit flows) */
  refreshToken?: string
  /** Unix epoch (seconds) when the access token expires */
  expiresAt?: number
  /** Space-separated list of scopes granted */
  scope?: string
  /** Token type – always "Bearer" for OIDC */
  tokenType: string
}

/**
 * Standard envelope for API responses returned by the backend services.
 *
 * @template T – the shape of the `data` payload
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request succeeded */
  success: boolean
  /** HTTP-style status code (200, 400, etc.) */
  statusCode: number
  /** Human-readable message (useful for error descriptions) */
  message: string
  /** The actual response payload; null when the request failed */
  data: T | null
  /** Optional pagination metadata */
  pagination?: Pagination
}

/**
 * Pagination metadata optionally embedded in ApiResponse.
 */
export interface Pagination {
  /** Current page (1-based) */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Total number of items across all pages */
  totalCount: number
  /** Total number of pages */
  totalPages: number
}

/**
 * Auth state persisted in `useState` / Pinia.
 */
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: AuthToken | null
  /** True while an auth operation (login/logout/refresh) is in progress */
  loading: boolean
  /** Last auth error message, if any */
  error: string | null
}

/**
 * Detailed user profile resolved from the authentication domain API.
 */
export interface CurrentUserProfile {
  id: string
  userName: string
  email: string
  emailConfirmed: boolean
  phoneNumber: string
  phoneNumberConfirmed: boolean
  lockoutEnabled: boolean
  twoFactorEnabled: boolean
  accessFailedCount: number
  lockoutEnd: string | null
}

/**
 * Shared client-side state for the current user's profile.
 */
export interface CurrentUserProfileState {
  profile: CurrentUserProfile | null
  loading: boolean
  error: string | null
  loadedUserId: string | null
  requestedUserId: string | null
}

/**
 * Payload used when opening the Alert modal.
 */
export interface AlertOptions {
  title?: string
  message: string
  /** Label for the OK button (default: "확인") */
  okLabel?: string
  /** Visual variant (maps to Tailwind colour utilities in the component) */
  type?: 'info' | 'success' | 'warning' | 'error'
}

/**
 * Payload used when opening the Confirm modal.
 */
export interface ConfirmOptions {
  title?: string
  message: string
  /** Label for the confirm button (default: "확인") */
  okLabel?: string
  /** Label for the cancel button (default: "취소") */
  cancelLabel?: string
  /** Visual variant */
  type?: 'info' | 'success' | 'warning' | 'danger'
}
