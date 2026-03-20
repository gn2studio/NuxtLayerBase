import { watch } from 'vue'
import type { CurrentUserProfile, CurrentUserProfileState, User } from '~/types'

type CurrentUserProfileStateRef = ReturnType<typeof useState<CurrentUserProfileState>>

let _profileStateReal: CurrentUserProfileStateRef | null = null
let _profileSyncRegistered = false
let _pendingProfileRequest: Promise<CurrentUserProfile | null> | null = null
let _pendingProfileUserId: string | null = null
let _profileRequestSequence = 0

function ensureProfileState(): CurrentUserProfileStateRef {
  if (!_profileStateReal) {
    _profileStateReal = useState<CurrentUserProfileState>('current-user-profile', () => ({
      profile: null,
      loading: false,
      error: null,
      loadedUserId: null,
      requestedUserId: null,
    }))
  }

  return _profileStateReal
}

const _profileState: CurrentUserProfileStateRef = new Proxy({} as CurrentUserProfileStateRef, {
  get(_target, prop, receiver) {
    const state = ensureProfileState()
    return Reflect.get(state as unknown as object, prop, receiver)
  },
  set(_target, prop, value, receiver) {
    const state = ensureProfileState()
    return Reflect.set(state as unknown as object, prop, value, receiver)
  },
})

function getAuthenticatedUserId(user: User | null): string | null {
  if (!user) return null

  if (typeof user.id === 'string' && user.id.trim().length > 0) {
    return user.id
  }

  const sub = user.sub
  return typeof sub === 'string' && sub.trim().length > 0 ? sub : null
}

function resetPendingRequest(): void {
  _pendingProfileRequest = null
  _pendingProfileUserId = null
}

function getAuthApiBaseUrl(config: ReturnType<typeof useRuntimeConfig>): string {
  return config.public.authApiBaseUrl || config.public.apiBaseUrl || ''
}

function resolveDisplayName(user: User | null, profile: CurrentUserProfile | null): string | null {
  const candidates = [
    profile?.userName,
    typeof user?.name === 'string' ? user.name : null,
    typeof user?.email === 'string' ? user.email : null,
    typeof user?.preferred_username === 'string' ? user.preferred_username : null,
    typeof user?.sub === 'string' ? user.sub : null,
    user?.id ?? null,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate
    }
  }

  return null
}

export function clearCurrentUserProfileState(): void {
  _profileRequestSequence += 1
  _profileState.value.profile = null
  _profileState.value.loading = false
  _profileState.value.error = null
  _profileState.value.loadedUserId = null
  _profileState.value.requestedUserId = null
  resetPendingRequest()
}

export function useCurrentUserProfile() {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const config = useRuntimeConfig()
  const { get } = useApi(getAuthApiBaseUrl(config))

  async function loadProfile(force = false): Promise<CurrentUserProfile | null> {
    if (import.meta.server) {
      return null
    }

    const currentUserId = getAuthenticatedUserId(user.value)

    if (!isAuthenticated.value || !currentUserId) {
      clearCurrentUserProfileState()
      return null
    }

    if (!force) {
      if (_profileState.value.loadedUserId === currentUserId && _profileState.value.profile) {
        return _profileState.value.profile
      }

      if (_pendingProfileRequest && _pendingProfileUserId === currentUserId) {
        return _pendingProfileRequest
      }

      if (_profileState.value.requestedUserId === currentUserId) {
        return _profileState.value.profile
      }
    }

    const authApiBaseUrl = getAuthApiBaseUrl(config)

    if (!authApiBaseUrl) {
      _profileState.value.profile = null
      _profileState.value.loading = false
      _profileState.value.error = 'authApiBaseUrl 또는 apiBaseUrl 설정이 필요합니다.'
      _profileState.value.loadedUserId = null
      _profileState.value.requestedUserId = currentUserId
      resetPendingRequest()
      return null
    }

    _profileState.value.loading = true
    _profileState.value.error = null
    _profileState.value.requestedUserId = currentUserId

    const requestSequence = ++_profileRequestSequence

    const request = (async () => {
      const response = await get<CurrentUserProfile>(`/api/Users/${encodeURIComponent(currentUserId)}`)

      if (
        requestSequence !== _profileRequestSequence ||
        _profileState.value.requestedUserId !== currentUserId
      ) {
        return null
      }

      if (response.success && response.data) {
        _profileState.value.profile = response.data
        _profileState.value.loadedUserId = currentUserId
        _profileState.value.error = null
        return response.data
      }

      _profileState.value.profile = null
      _profileState.value.loadedUserId = null
      _profileState.value.error = response.message || '사용자 상세 정보를 불러오지 못했습니다.'
      return null
    })()

    _pendingProfileRequest = request
    _pendingProfileUserId = currentUserId

    try {
      return await request
    } finally {
      if (requestSequence === _profileRequestSequence) {
        _profileState.value.loading = false
        resetPendingRequest()
      }
    }
  }

  async function reload(): Promise<CurrentUserProfile | null> {
    return loadProfile(true)
  }

  function clear(): void {
    clearCurrentUserProfileState()
  }

  if (import.meta.client && !_profileSyncRegistered) {
    _profileSyncRegistered = true

    watch(
      [() => isAuthenticated.value, () => authLoading.value, () => getAuthenticatedUserId(user.value)],
      ([authenticated, isAuthLoading, currentUserId], [, previousAuthLoading, previousUserId]) => {
        if (!authenticated || !currentUserId) {
          clearCurrentUserProfileState()
          return
        }

        if (isAuthLoading) {
          return
        }

        const shouldLoad =
          previousAuthLoading ||
          previousUserId !== currentUserId ||
          _profileState.value.requestedUserId !== currentUserId

        if (shouldLoad) {
          void loadProfile()
        }
      },
      { immediate: true },
    )
  }

  return {
    profile: computed(() => _profileState.value.profile),
    loading: computed(() => _profileState.value.loading),
    error: computed(() => _profileState.value.error),
    loadedUserId: computed(() => _profileState.value.loadedUserId),
    displayName: computed(() => resolveDisplayName(user.value, _profileState.value.profile)),
    loadProfile,
    reload,
    clear,
  }
}