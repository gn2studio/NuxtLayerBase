<script setup lang="ts">
/**
 * BaseProgressLoading — progress loading overlay driven by useProgressLoading.
 *
 * Mount this once in app.vue or a root layout:
 *   <BaseProgressLoading />
 */
import { useLayerUiConfig } from '~/composables/useLayerUiConfig'
import { useProgressLoading } from '~/composables/useProgressLoading'

const { state, progressPercent } = useProgressLoading()
const { progressLoadingZIndex, useBuiltInProgressLoading } = useLayerUiConfig()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-180"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-130"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.visible && useBuiltInProgressLoading"
        class="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[3px] supports-[backdrop-filter]:bg-black/40"
        :style="{ zIndex: progressLoadingZIndex }"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          class="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/0"
            aria-hidden="true"
          />

          <div class="relative space-y-4">
            <p
              class="text-base font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
              style="color: rgb(255 255 255)"
            >
              {{ state.message }}
            </p>

            <div class="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                class="h-full rounded-full bg-white/90 transition-[width] duration-300 ease-out"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>

            <p class="text-right text-xs font-semibold tracking-wide text-slate-100/90">
              {{ progressPercent }}%
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
