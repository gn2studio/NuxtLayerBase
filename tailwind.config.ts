/**
 * Tailwind CSS base configuration for the NuxtLayerBase layer.
 *
 * Sub-projects extend this file by providing their own tailwind.config.ts
 * that spreads / merges these defaults:
 *
 *   import baseConfig from '@gn2studio/nuxt-layer-base/tailwind.config'
 *   export default { ...baseConfig, theme: { extend: { colors: { brand: '#...' } } } }
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  // ── Content paths ────────────────────────────────────────────────────────
  // Include the layer's own files so Tailwind can purge unused utilities.
  // Consuming projects should add their own paths on top of these.
  content: [
    './components/**/*.{vue,ts,tsx}',
    './composables/**/*.{ts,tsx}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{ts,tsx}',
    './app.vue',
    './error.vue',
  ],

  // ── Dark mode ────────────────────────────────────────────────────────────
  darkMode: 'class',

  theme: {
    extend: {
      // ── Brand colours ──────────────────────────────────────────────────
      // Override these in your project's tailwind.config.ts to match the
      // project's visual identity.
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // default brand colour (blue-500)
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────
      // Override `fontFamily.sans` to use the project's preferred font.
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ── Border radius ──────────────────────────────────────────────────
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },

  plugins: [],
}

export default config
