/**
 * Shared UI runtime configuration helpers for layer components.
 */
function toBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase()
    if (!normalised) return fallback
    if (['false', '0', 'off', 'no'].includes(normalised)) return false
    if (['true', '1', 'on', 'yes'].includes(normalised)) return true
  }
  return fallback
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function useLayerUiConfig() {
  const config = useRuntimeConfig()

  const overlayZIndex = computed(() =>
    toNumber(config.public.uiOverlayZIndex, 2147483000),
  )
  const toastZIndex = computed(() =>
    toNumber(config.public.uiToastZIndex, 2147483001),
  )
  const loadingZIndex = computed(() =>
    toNumber(config.public.uiLoadingZIndex, 2147483002),
  )
  const progressLoadingZIndex = computed(() =>
    toNumber(config.public.uiProgressLoadingZIndex, 2147483003),
  )

  const useBuiltInAlert = computed(() =>
    toBoolean(config.public.uiUseBuiltInAlert, true),
  )
  const useBuiltInConfirm = computed(() =>
    toBoolean(config.public.uiUseBuiltInConfirm, true),
  )
  const useBuiltInToast = computed(() =>
    toBoolean(config.public.uiUseBuiltInToast, true),
  )
  const useBuiltInLoading = computed(() =>
    toBoolean(config.public.uiUseBuiltInLoading, true),
  )
  const useBuiltInProgressLoading = computed(() =>
    toBoolean(config.public.uiUseBuiltInProgressLoading, true),
  )

  return {
    overlayZIndex,
    toastZIndex,
    loadingZIndex,
    progressLoadingZIndex,
    useBuiltInAlert,
    useBuiltInConfirm,
    useBuiltInToast,
    useBuiltInLoading,
    useBuiltInProgressLoading,
  }
}
