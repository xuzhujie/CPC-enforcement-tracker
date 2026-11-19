import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(process.cwd())

describe('release acceptance contract', () => {
  it('provides a runbook and executable acceptance check', () => {
    expect(existsSync(resolve(projectRoot, 'README.md'))).toBe(true)
    expect(existsSync(resolve(projectRoot, 'scripts/acceptance-check.mjs'))).toBe(true)

    const output = execFileSync(process.execPath, ['scripts/acceptance-check.mjs'], {
      cwd: projectRoot,
      encoding: 'utf8',
    })

    expect(output).toContain('ACCEPTANCE PASS')
  })

  it('documents the data check, production preview, and responsive acceptance targets', () => {
    const readme = readFileSync(resolve(projectRoot, 'README.md'), 'utf8')

    expect(readme).toContain('npm run data:check')
    expect(readme).toContain('npm run preview')
    expect(readme).toContain('320px')
    expect(readme).toContain('768px')
  })
})
