/**
 * useApi — fetch wrapper that automatically attaches the Bearer access token.
 *
 * Built on top of Nuxt's `$fetch` (ofetch) so it respects Nuxt's server/client
 * hydration behaviour.
 *
 * Usage:
 *   const { get, post, put, del } = useApi()
 *
 *   const result = await get<User[]>('/api/users')
 *   const created = await post<User>('/api/users', { name: 'Alice' })
 */
import type { FetchOptions } from 'ofetch'
import type { ApiResponse } from '~/types'

export function useApi(baseURL?: string) {
  const { getAccessToken, refreshToken, isAuthenticated } = useAuth()
  const config = useRuntimeConfig()

  /**
   * Build fetch options with the Authorization header injected.
   */
  async function buildOptions<T>(
    options: FetchOptions<'json'> = {},
  ): Promise<FetchOptions<'json'>> {
    let token = getAccessToken()

    // If there's no token but the user appears authenticated, try a silent refresh
    if (!token && isAuthenticated.value) {
      token = await refreshToken()
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return {
      baseURL: baseURL ?? config.public.apiBaseUrl,
      ...options,
      headers,
    }
  }

  /**
   * Thin wrapper around $fetch that injects auth headers and normalises the
   * response into an ApiResponse envelope.
   *
   * If the backend already returns an ApiResponse the value is passed through;
   * otherwise the raw value is wrapped automatically.
   */
  async function request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options: FetchOptions<'json'> = {},
  ): Promise<ApiResponse<T>> {
    const opts = await buildOptions<T>({ ...options, method })

    try {
      const raw = await $fetch<ApiResponse<T> | T>(url, opts)

      // If the server already wraps the response, return as-is
      if (
        raw !== null &&
        typeof raw === 'object' &&
        'success' in raw &&
        'statusCode' in raw
      ) {
        return raw as ApiResponse<T>
      }

      // Otherwise wrap it
      return {
        success: true,
        statusCode: 200,
        message: 'OK',
        data: raw as T,
      }
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string; data?: ApiResponse<T> }

      // If the error body is already an ApiResponse, surface it
      if (error.data && 'success' in error.data) {
        return error.data as ApiResponse<T>
      }

      return {
        success: false,
        statusCode: error.statusCode ?? 500,
        message: error.message ?? 'Unknown error',
        data: null,
      }
    }
  }

  return {
    /** HTTP GET */
    get: <T>(url: string, options?: FetchOptions<'json'>) =>
      request<T>('GET', url, options),

    /** HTTP POST */
    post: <T>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
      request<T>('POST', url, { ...options, body }),

    /** HTTP PUT */
    put: <T>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
      request<T>('PUT', url, { ...options, body }),

    /** HTTP PATCH */
    patch: <T>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
      request<T>('PATCH', url, { ...options, body }),

    /** HTTP DELETE */
    del: <T>(url: string, options?: FetchOptions<'json'>) =>
      request<T>('DELETE', url, options),
  }
}
