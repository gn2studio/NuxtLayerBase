<script setup lang="ts">
/**
 * BaseToast — global toast presenter driven by the useToast composable.
 *
 * Mount this component once in your root layout or app.vue:
 *   <BaseToast />
 */
import { useToast } from '~/composables/useToast'
import { useLayerUiConfig } from '~/composables/useLayerUiConfig'

const { state, dismiss } = useToast()
const { toastZIndex, useBuiltInToast } = useLayerUiConfig()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="useBuiltInToast"
      class="pointer-events-none fixed inset-0 p-4 sm:p-6"
      :style="{ zIndex: toastZIndex }"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col items-end gap-3"
      >
        <div
          v-for="item in state"
          :key="item.id"
          class="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/10 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/0"
            aria-hidden="true"
          />

          <div class="relative">
            <p
              v-if="item.title"
              class="text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
            >
              {{ item.title }}
            </p>
            <p
              class="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
            >
              {{ item.message }}
            </p>

            <div class="mt-3 flex justify-end">
              <button
                class="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-0"
                @click="dismiss(item.id)"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
