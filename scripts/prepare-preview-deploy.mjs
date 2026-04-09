import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourceDir = resolve('playground/.output/public')
const targetDir = resolve('preview-dist')

if (!existsSync(sourceDir)) {
  throw new Error(
    'Preview output not found. Run "npm run generate:preview" first.',
  )
}

rmSync(targetDir, { recursive: true, force: true })
mkdirSync(targetDir, { recursive: true })
cpSync(sourceDir, targetDir, { recursive: true })

// Keep github.io from treating files as a Jekyll site.
writeFileSync(resolve(targetDir, '.nojekyll'), '')

console.log('Preview deploy package created at: preview-dist')
