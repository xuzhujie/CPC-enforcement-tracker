import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const read = (file) => readFileSync(resolve(root, file), 'utf8')

const checks = [
  ['production build output exists', existsSync(resolve(root, 'dist/index.html'))],
  ['data check script is registered', packageJson.scripts?.['data:check'] === 'vitest --run src/lib/dataQuality.test.ts'],
  ['production preview script is registered', packageJson.scripts?.preview === 'vite preview'],
  ['responsive breakpoint is present', read('src/styles.css').includes('@media (max-width: 720px)')],
  ['mobile drawer fills the viewport', read('src/styles.css').includes('.case-drawer { width: 100vw; max-width: none; }')],
  ['case dialog keeps an accessible name and modal semantics', read('src/components/CaseDrawer.tsx').includes('aria-modal="true"') && read('src/components/CaseDrawer.tsx').includes('aria-label="关闭案件详情"')],
  ['source snapshot is wired to the app', read('src/App.tsx').includes('snapshotManifest') && read('src/data/sources.ts').includes('commission.europa.eu')],
]

const failed = checks.filter(([, passed]) => !passed)
if (failed.length > 0) {
  console.error('ACCEPTANCE FAIL')
  failed.forEach(([label]) => console.error(`- ${label}`))
  process.exit(1)
}

console.log(`ACCEPTANCE PASS (${checks.length} checks)`)
checks.forEach(([label]) => console.log(`- ${label}`))
