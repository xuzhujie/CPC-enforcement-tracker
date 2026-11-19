import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { cases } from '../data/cases'
import { sources } from '../data/sources'
import { App } from '../App'
import { CaseDrawer } from './CaseDrawer'
import { CaseTable } from './CaseTable'

beforeAll(() => {
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

describe('case review workflow', () => {
  it('renders a keyboard-selectable case table row', () => {
    const markup = renderToStaticMarkup(<CaseTable cases={[cases[0]]} onSelect={vi.fn()} />)

    expect(markup).toContain('SHEIN')
    expect(markup).toContain('调查中')
    expect(markup).toContain('暗黑模式')
    expect(markup).toContain('tabindex="0"')
  })

  it('renders sortable operational review columns', () => {
    const markup = renderToStaticMarkup(
      <CaseTable
        cases={[cases[0]]}
        onSelect={vi.fn()}
        sort={{ key: 'priority', direction: 'desc' }}
        onSort={vi.fn()}
      />,
    )

    expect(markup).toContain('复核')
    expect(markup).toContain('下次复核')
    expect(markup).toContain('高优先级')
    expect(markup).toContain('aria-sort="descending"')
  })

  it('renders mixed outcomes and distinguishes an unrecorded fine', () => {
    const mixedRecord = {
      ...cases.find((record) => record.company === 'SHEIN')!,
      commitments: [{ summary: '整改承诺仍在监测' }],
    }
    const markup = renderToStaticMarkup(
      <CaseDrawer record={mixedRecord} onClose={vi.fn()} sources={sources} />,
    )

    expect(markup).toContain('协调行动')
    expect(markup).toContain('企业承诺')
    expect(markup).toContain('暂无公开罚款记录')
    expect(markup).toContain('Market places and digital services')
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('运营复核')
    expect(markup).toContain('待分配')
  })

  it('moves focus into the drawer and restores it on close', async () => {
    document.body.innerHTML = '<div id="test-root"></div><button id="trigger">trigger</button>'
    const trigger = document.getElementById('trigger') as HTMLButtonElement
    const root = createRoot(document.getElementById('test-root')!)
    trigger.focus()

    await act(async () => {
      root.render(<CaseDrawer record={cases[0]} onClose={vi.fn()} sources={sources} />)
    })
    expect(document.activeElement).toBe(document.querySelector('[aria-label="关闭案件详情"]'))

    await act(async () => {
      root.render(<CaseDrawer record={undefined} onClose={vi.fn()} sources={sources} />)
    })
    expect(document.activeElement).toBe(trigger)
    await act(async () => {
      root.unmount()
    })
  })

  it('renders the overview shell and default KPI labels', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('CPC Enforcement Tracker')
    expect(markup).toContain('活跃协调行动')
    expect(markup).toContain('已记录企业承诺')
    expect(markup).toContain('最终罚款记录')
    expect(markup).toContain('REVIEW QUEUE')
    expect(markup).toContain('导出当前案件')
  })
})
