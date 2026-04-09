/**
 * useProgressLoading — global progress loading overlay composable.
 *
 * Usage:
 *   const { startProgress, completeStep } = useProgressLoading()
 *   startProgress(3, { message: 'Uploading files...' })
 *   completeStep() // 33%
 *   completeStep() // 66%
 *   completeStep() // 100% and auto-hide
 */
import type { ProgressLoadingOptions } from '~/types'

interface ProgressLoadingState {
  visible: boolean
  message: string
  totalSteps: number
  completedSteps: number
}

function getProgressLoadingState() {
  return useState<ProgressLoadingState>('progress-loading', () => ({
    visible: false,
    message: 'Processing...',
    totalSteps: 0,
    completedSteps: 0,
  }))
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function useProgressLoading() {
  const state = getProgressLoadingState()

  const progressPercent = computed(() => {
    const total = state.value.totalSteps
    if (total <= 0) return 0
    return Math.round((state.value.completedSteps / total) * 100)
  })

  function hide() {
    state.value.visible = false
  }

  function reset() {
    state.value = {
      visible: false,
      message: 'Processing...',
      totalSteps: 0,
      completedSteps: 0,
    }
  }

  function startProgress(totalSteps: number, options?: ProgressLoadingOptions | string) {
    const normalised: ProgressLoadingOptions =
      typeof options === 'string' ? { message: options } : (options ?? {})

    const safeTotal = Math.max(1, Math.floor(totalSteps))

    state.value = {
      visible: true,
      message: normalised.message ?? 'Processing...',
      totalSteps: safeTotal,
      completedSteps: 0,
    }
  }

  function completeStep(step = 1) {
    if (!state.value.visible || state.value.totalSteps <= 0) return

    const next = clamp(
      state.value.completedSteps + Math.max(1, Math.floor(step)),
      0,
      state.value.totalSteps,
    )

    state.value.completedSteps = next

    if (state.value.completedSteps >= state.value.totalSteps) {
      state.value.visible = false
    }
  }

  function setProgress(completedSteps: number) {
    if (!state.value.visible || state.value.totalSteps <= 0) return

    state.value.completedSteps = clamp(
      Math.floor(completedSteps),
      0,
      state.value.totalSteps,
    )

    if (state.value.completedSteps >= state.value.totalSteps) {
      state.value.visible = false
    }
  }

  return {
    state,
    progressPercent,
    startProgress,
    completeStep,
    setProgress,
    hide,
    reset,
  }
}
