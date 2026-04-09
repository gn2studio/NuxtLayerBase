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
import { useLayerUiConfig } from '~/composables/useLayerUiConfig'

const { state, _dismiss } = useAlert()
const { overlayZIndex, useBuiltInAlert } = useLayerUiConfig()
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
        v-if="state.visible && useBuiltInAlert"
        class="fixed inset-0 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] supports-[backdrop-filter]:bg-black/35"
        :style="{ zIndex: overlayZIndex }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="state.options.title ? 'alert-title' : undefined"
        aria-describedby="alert-message"
        @keydown.esc="_dismiss"
      >
        <!-- Modal panel -->
        <div
          class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/8 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          @click.stop
        >
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/45 via-black/35 to-black/45"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/8 via-white/4 to-white/0"
            aria-hidden="true"
          />

          <div class="relative px-7 pb-7 pt-7 sm:px-8">
            <h2
              id="alert-title"
              class="text-2xl font-semibold leading-tight tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] sm:text-3xl"
              style="color: rgb(255 255 255)"
            >
              {{ state.options.title ?? '알림' }}
            </h2>
            <p
              id="alert-message"
              class="mt-4 whitespace-pre-wrap text-lg leading-8 text-slate-100/92 [text-shadow:0_1px_2px_rgba(0,0,0,0.68)]"
              style="color: rgb(241 245 249)"
            >
              {{ state.options.message }}
            </p>

            <div class="mt-7 flex justify-start">
              <button
                class="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/20 px-5 py-2.5 text-base font-semibold leading-none text-white
                       shadow-lg shadow-black/25 backdrop-blur-md transition hover:bg-white/28 focus:outline-none focus:ring-2
                       focus:ring-white/60 focus:ring-offset-0 active:scale-[0.98]"
                autofocus
                @click="_dismiss"
              >
                {{ state.options.okLabel ?? '확인' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
