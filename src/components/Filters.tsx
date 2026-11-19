import type { ChangeEvent } from 'react'
import type { BusinessModel, CaseStatus, FilterState, PracticeTag } from '../types'
import { businessModelLabels, practiceLabels, statusLabels } from '../lib/format'
import { Icon } from './Icon'

type FiltersProps = {
  filters: FilterState
  onChange: (next: FilterState) => void
  onClear: () => void
  resultCount: number
  years: string[]
}

const businessModels: BusinessModel[] = ['app', 'ecommerce', 'marketplace', 'subscription', 'payments', 'advertising']
const statuses: CaseStatus[] = ['investigating', 'ongoing', 'commitment_monitoring', 'closed', 'enforcement_possible']
const themes: PracticeTag[] = [
  'dark_patterns',
  'subscription_renewal_cancellation',
  'misleading_discounts',
  'reviews_ratings',
  'advertising',
]

export function Filters({ filters, onChange, onClear, resultCount, years }: FiltersProps) {
  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value })
  }

  return (
    <section className="filters" aria-label="案件筛选">
      <div className="search-field">
        <Icon name="search" size={17} />
        <input
          aria-label="搜索公司、主题或来源"
          name="search"
          placeholder="搜索公司、主题或来源"
          value={filters.search}
          onChange={update}
        />
      </div>
      <label className="select-field">
        <span className="sr-only">业务模式</span>
        <select name="businessModel" value={filters.businessModel} onChange={update}>
          <option value="all">全部模式</option>
          {businessModels.map((model) => <option key={model} value={model}>{businessModelLabels[model]}</option>)}
        </select>
        <Icon name="chevron-down" size={15} />
      </label>
      <label className="select-field">
        <span className="sr-only">案件状态</span>
        <select name="status" value={filters.status} onChange={update}>
          <option value="all">全部状态</option>
          {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
        <Icon name="chevron-down" size={15} />
      </label>
      <label className="select-field">
        <span className="sr-only">重点主题</span>
        <select name="theme" value={filters.theme} onChange={update}>
          <option value="all">全部主题</option>
          {themes.map((theme) => <option key={theme} value={theme}>{practiceLabels[theme]}</option>)}
        </select>
        <Icon name="chevron-down" size={15} />
      </label>
      <label className="select-field select-field--year">
        <span className="sr-only">年份</span>
        <select name="year" value={filters.year} onChange={update}>
          <option value="all">全部年份</option>
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
        <Icon name="chevron-down" size={15} />
      </label>
      <button type="button" className="clear-button" onClick={onClear}>
        <Icon name="filter" size={15} />
        清除筛选
      </button>
      <span className="filter-result-count">{resultCount} 条记录</span>
    </section>
  )
}
