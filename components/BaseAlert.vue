<script setup lang="ts">
/**
 * BaseAlert — global alert modal driven by the useAlert composable.
 *
 * Mount this component once in your root layout or app.vue:
 *   <BaseAlert />
 *
 * Appearance is controlled by Tailwind CSS and can be overridden per-project
 * by adding a deeper specificity rule or by replacing this component.
 */
import { useAlert } from '~/composables/useAlert'

const { state, _dismiss } = useAlert()

const typeClasses = computed(() => {
  const t = state.value.options.type ?? 'info'
  return {
    info: {
      icon: 'ℹ️',
      header: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
    success: {
      icon: '✅',
      header: 'bg-green-600',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    warning: {
      icon: '⚠️',
      header: 'bg-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
    },
    error: {
      icon: '❌',
      header: 'bg-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  }[t]
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="state.options.title ? 'alert-title' : undefined"
        aria-describedby="alert-message"
        @keydown.esc="_dismiss"
      >
        <!-- Modal panel -->
        <div
          class="w-full max-w-sm overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-gray-800"
          @click.stop
        >
          <!-- Header -->
          <div :class="['px-5 py-4 flex items-center gap-3', typeClasses?.header]">
            <span class="text-xl select-none" aria-hidden="true">{{ typeClasses?.icon }}</span>
            <h2
              v-if="state.options.title"
              id="alert-title"
              class="text-base font-semibold text-white truncate"
            >
              {{ state.options.title }}
            </h2>
          </div>

          <!-- Body -->
          <div class="px-5 py-5">
            <p
              id="alert-message"
              class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
            >
              {{ state.options.message }}
            </p>
          </div>

          <!-- Footer -->
          <div class="px-5 pb-5 flex justify-end">
            <button
              :class="[
                'inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium text-white',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                typeClasses?.button,
              ]"
              autofocus
              @click="_dismiss"
            >
              {{ state.options.okLabel ?? '확인' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
