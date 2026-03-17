/**
 * useAlert — Promise-based global alert modal composable.
 *
 * Usage:
 *   const { alert } = useAlert()
 *   await alert({ message: '저장되었습니다.', type: 'success' })
 *
 * The `<BaseAlert />` component must be mounted in the layout/app for the
 * modal to render.
 */
import type { AlertOptions } from '~/types'

interface AlertState {
  visible: boolean
  options: AlertOptions
  resolve: (() => void) | null
}

const _alertState = useState<AlertState>('alert', () => ({
  visible: false,
  options: { message: '' },
  resolve: null,
}))

export function useAlert() {
  /**
   * Show the alert modal and wait until the user dismisses it.
   */
  function alert(options: AlertOptions | string): Promise<void> {
    const normalised: AlertOptions =
      typeof options === 'string' ? { message: options } : options

    return new Promise<void>((resolve) => {
      _alertState.value = {
        visible: true,
        options: normalised,
        resolve,
      }
    })
  }

  /** Called internally by <BaseAlert /> when the user clicks OK. */
  function _dismiss() {
    const { resolve } = _alertState.value
    _alertState.value.visible = false
    if (resolve) resolve()
    _alertState.value.resolve = null
  }

  return {
    /** Reactive state consumed by the BaseAlert component */
    state: _alertState,
    alert,
    _dismiss,
  }
}
