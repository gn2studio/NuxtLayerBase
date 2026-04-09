/**
 * useToast — lightweight global toast composable.
 *
 * Usage:
 *   const { toast } = useToast()
 *   toast('Saved successfully.')
 *   toast({ title: 'Saved', message: 'Your changes are live.', duration: 2500 })
 */
import type { ToastOptions } from '~/types'

interface ToastItem {
  id: number
  title?: string
  message: string
  duration: number
}

const DEFAULT_DURATION = 3000

// Timer handles are managed outside useState.
const _timers = new Map<number, ReturnType<typeof setTimeout>>()

function getToastState() {
  return useState<ToastItem[]>('toasts', () => [])
}

export function useToast() {
  const state = getToastState()

  function dismiss(id: number) {
    const timer = _timers.get(id)
    if (timer) {
      clearTimeout(timer)
      _timers.delete(id)
    }

    state.value = state.value.filter((item) => item.id !== id)
  }

  function clear() {
    for (const timer of _timers.values()) {
      clearTimeout(timer)
    }
    _timers.clear()
    state.value = []
  }

  function toast(options: ToastOptions | string): number {
    const normalised: ToastOptions =
      typeof options === 'string' ? { message: options } : options

    const id = Date.now() + Math.floor(Math.random() * 10000)
    const item: ToastItem = {
      id,
      title: normalised.title,
      message: normalised.message,
      duration: normalised.duration ?? DEFAULT_DURATION,
    }

    state.value = [...state.value, item]

    if (item.duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id)
      }, item.duration)
      _timers.set(id, timer)
    }

    return id
  }

  return {
    state,
    toast,
    dismiss,
    clear,
  }
}
