<script setup lang="ts">
/**
 * BaseLoading — global loading overlay driven by useLoading composable.
 *
 * Mount this once in app.vue or a root layout:
 *   <BaseLoading />
 */
import { useLayerUiConfig } from '~/composables/useLayerUiConfig'
import { useLoading } from '~/composables/useLoading'

const { state } = useLoading()
const { loadingZIndex, useBuiltInLoading } = useLayerUiConfig()
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
        v-if="state.visible && useBuiltInLoading"
        class="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[3px] supports-[backdrop-filter]:bg-black/40"
        :style="{ zIndex: loadingZIndex }"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          class="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/0"
            aria-hidden="true"
          />

          <div class="relative flex items-center gap-4">
            <span class="relative inline-flex h-9 w-9 items-center justify-center">
              <span class="absolute inset-0 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span class="h-2.5 w-2.5 rounded-full bg-white/85" />
            </span>

            <p
              class="text-base font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
              style="color: rgb(255 255 255)"
            >
              {{ state.message }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
