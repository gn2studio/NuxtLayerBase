/**
 * useConfirm — Promise-based global confirm modal composable.
 *
 * Usage:
 *   const { confirm } = useConfirm()
 *   const confirmed = await confirm('삭제하시겠습니까?')
 *   if (confirmed) { ... }
 */
import type { ConfirmOptions } from '~/types'

interface ConfirmState {
  visible: boolean
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

function getConfirmState() {
  return useState<ConfirmState>('confirm', () => ({
    visible: false,
    options: { message: '' },
    resolve: null,
  }))
}

export function useConfirm() {
  const _confirmState = getConfirmState()
  /**
   * Show the confirm modal and wait for the user's answer.
   * Resolves to `true` (OK) or `false` (cancel).
   */
  function confirm(options: ConfirmOptions | string): Promise<boolean> {
    const normalised: ConfirmOptions =
      typeof options === 'string' ? { message: options } : options

    return new Promise<boolean>((resolve) => {
      const current = _confirmState.value
      // If a confirm is already visible, auto-cancel it so its Promise settles.
      if (current.visible && current.resolve) {
        current.visible = false
        current.resolve(false)
        current.resolve = null
      }

      _confirmState.value = {
        visible: true,
        options: normalised,
        resolve,
      }
    })
  }

  /** Called internally by <BaseConfirm /> when the user clicks OK. */
  function _accept() {
    const { resolve } = _confirmState.value
    _confirmState.value.visible = false
    if (resolve) resolve(true)
    _confirmState.value.resolve = null
  }

  /** Called internally by <BaseConfirm /> when the user clicks Cancel. */
  function _cancel() {
    const { resolve } = _confirmState.value
    _confirmState.value.visible = false
    if (resolve) resolve(false)
    _confirmState.value.resolve = null
  }

  return {
    /** Reactive state consumed by the BaseConfirm component */
    state: _confirmState,
    confirm,
    _accept,
    _cancel,
  }
}
