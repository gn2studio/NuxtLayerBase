import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)

const originalGetBuiltinModule =
  typeof process.getBuiltinModule === 'function'
    ? process.getBuiltinModule.bind(process)
    : null

process.getBuiltinModule = (moduleName) => {
  if (moduleName === 'module') {
    return { createRequire }
  }

  return originalGetBuiltinModule?.(moduleName)
}

function resolveNuxiEntry() {
  const candidates = [
    join(process.cwd(), 'node_modules', 'nuxi', 'bin', 'nuxi.mjs'),
    join(process.cwd(), 'node_modules', '@nuxt', 'cli', 'bin', 'nuxi.mjs'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  throw new Error('Unable to resolve a Nuxt CLI entry point.')
}

const nuxiEntry = pathToFileURL(resolveNuxiEntry()).href

await import(nuxiEntry)