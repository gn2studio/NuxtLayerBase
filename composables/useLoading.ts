/**
 * useLoading — global loading overlay composable.
 *
 * Usage:
 *   const { loading } = useLoading()
 *   loading(true, { message: 'Saving changes...' })
 *   loading(false)
 */
import type { LoadingOptions } from '~/types'

interface LoadingState {
  visible: boolean
  message: string
}

function getLoadingState() {
  return useState<LoadingState>('loading', () => ({
    visible: false,
    message: 'Loading...',
  }))
}

export function useLoading() {
  const state = getLoadingState()

  function loading(flag: boolean, options?: LoadingOptions | string) {
    if (flag) {
      const normalised: LoadingOptions =
        typeof options === 'string' ? { message: options } : (options ?? {})

      state.value = {
        visible: true,
        message: normalised.message ?? 'Loading...',
      }
      return
    }

    state.value.visible = false
  }

  function hide() {
    state.value.visible = false
  }

  return {
    state,
    loading,
    hide,
  }
}
