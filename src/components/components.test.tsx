import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Filters } from './Filters'
import { KpiCard } from './KpiCard'
import { OutcomeSplit } from './OutcomeSplit'
import { SourceHealth } from './SourceHealth'
import { StatusBadge } from './StatusBadge'
import { ThemeBars } from './ThemeBars'
import { snapshotManifest } from '../data/snapshot'
import type { FilterState, SourceRecord } from '../types'

beforeAll(() => {
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

const filters: FilterState = {
  search: '',
  businessModel: 'all',
  status: 'all',
  theme: 'all',
  year: 'all',
}

const source: SourceRecord = {
  id: 'source-1',
  title: 'Official source',
  url: 'https://example.com',
  type: 'official_page',
  checkedAt: '2026-11-19',
  scope: 'Scope',
}

describe('dashboard primitives', () => {
  it('renders a status badge and KPI context', () => {
    const markup = renderToStaticMarkup(
      <>
        <StatusBadge label="调查中" tone="risk" />
        <KpiCard label="活跃协调行动" value={3} helper="按案件计数" tone="accent" />
      </>,
    )

    expect(markup).toContain('调查中')
    expect(markup).toContain('按案件计数')
    expect(markup).toContain('3')
  })

  it('renders filters and chart text alternatives', () => {
    const markup = renderToStaticMarkup(
      <>
        <Filters filters={filters} onChange={vi.fn()} onClear={vi.fn()} resultCount={12} years={['2025']} />
        <ThemeBars items={[{ tag: 'dark_patterns', count: 4 }]} onSelect={vi.fn()} />
        <OutcomeSplit items={[{ type: 'final_penalty', count: 0 }]} />
      </>,
    )

    expect(markup).toContain('搜索公司、主题或来源')
    expect(markup).toContain('暗黑模式')
    expect(markup).toContain('最终罚款')
    expect(markup).toContain('12 条记录')
    expect(markup).toContain('type="button"')
  })

  it('renders source freshness and review boundary', () => {
    const markup = renderToStaticMarkup(<SourceHealth sources={[source]} recordCount={12} snapshot={snapshotManifest} />)

    expect(markup).toContain('公开来源快照，需人工复核')
    expect(markup).toContain('2026')
    expect(markup).toContain('12')
    expect(markup).toContain('2026年12月3日')
  })

  it('dispatches a theme selection from the interactive bar', async () => {
    document.body.innerHTML = '<div id="theme-root"></div>'
    const root = createRoot(document.getElementById('theme-root')!)
    const onSelect = vi.fn()

    await act(async () => {
      root.render(<ThemeBars items={[{ tag: 'dark_patterns', count: 4 }]} onSelect={onSelect} />)
    })
    await act(async () => {
      ;(document.querySelector('.theme-bar--interactive') as HTMLButtonElement).click()
    })

    expect(onSelect).toHaveBeenCalledWith('dark_patterns')
    await act(async () => {
      root.unmount()
    })
  })
})
