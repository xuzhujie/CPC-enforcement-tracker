import { businessModelLabels, formatDate, practiceLabels, reviewPriorityLabels, statusLabels } from '../lib/format'
import type { CaseSort, CaseSortKey } from '../lib/caseWorkflow'
import type { CaseRecord } from '../types'
import { Icon } from './Icon'
import { StatusBadge } from './StatusBadge'

type CaseTableProps = {
  cases: CaseRecord[]
  onSelect: (record: CaseRecord) => void
  sort?: CaseSort
  onSort?: (key: CaseSortKey) => void
}

function statusTone(status: CaseRecord['status']): 'risk' | 'success' | 'neutral' | 'amber' {
  if (status === 'investigating' || status === 'ongoing') return 'risk'
  if (status === 'commitment_monitoring') return 'success'
  if (status === 'enforcement_possible') return 'amber'
  return 'neutral'
}

export function CaseTable({ cases, onSelect, sort, onSort }: CaseTableProps) {
  if (cases.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><Icon name="search" size={20} /></div>
        <h3>没有匹配的案件</h3>
        <p>试试清除一个筛选条件，或换一个公司、主题关键词。</p>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="case-table">
        <thead>
          <tr>
            <SortableHeader label="企业 / 平台" sortKey="company" sort={sort} onSort={onSort} />
            <th scope="col">业务模式</th>
            <th scope="col">重点主题</th>
            <th scope="col">状态</th>
            <th scope="col">结果记录</th>
            <SortableHeader label="复核" sortKey="priority" sort={sort} onSort={onSort} />
            <SortableHeader label="最近更新" sortKey="lastUpdate" sort={sort} onSort={onSort} />
            <SortableHeader label="下次复核" sortKey="nextReviewDate" sort={sort} onSort={onSort} />
            <th scope="col" className="case-table__arrow"><span className="sr-only">打开详情</span></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((record) => {
            const sourceCount = new Set(record.evidence.map((item) => item.sourceId)).size
            return (
              <tr
                className="case-row"
                key={record.id}
                tabIndex={0}
                aria-label={`${record.company} 案件详情`}
                onClick={() => onSelect(record)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect(record)
                  }
                }}
              >
                <td data-label="企业 / 平台">
                  <div className="case-company">
                    <strong>{record.company}</strong>
                    <span>{record.leadAuthority ?? 'CPC Network'}</span>
                  </div>
                </td>
                <td data-label="业务模式">
                  <div className="model-list">
                    {record.businessModels.slice(0, 2).map((model) => <span key={model}>{businessModelLabels[model]}</span>)}
                  </div>
                </td>
                <td data-label="重点主题">
                  <div className="tag-list">
                    {record.practiceTags.slice(0, 3).map((tag) => <span className="theme-tag" key={tag}>{practiceLabels[tag]}</span>)}
                    {record.practiceTags.length > 3 && <span className="theme-tag theme-tag--more">+{record.practiceTags.length - 3}</span>}
                  </div>
                </td>
                <td data-label="状态"><StatusBadge label={statusLabels[record.status]} tone={statusTone(record.status)} /></td>
                <td data-label="结果记录">
                  <div className="result-badges">
                    {record.coordinatedActions.length > 0 && <span className="result-label result-label--action">行动</span>}
                    {record.commitments.length > 0 && <span className="result-label result-label--commitment">承诺</span>}
                    {record.finalPenalties.length > 0 && <span className="result-label result-label--penalty">罚款</span>}
                    {record.coordinatedActions.length === 0 && record.commitments.length === 0 && record.finalPenalties.length === 0 && <span className="result-label result-label--muted">待更新</span>}
                  </div>
                </td>
                <td data-label="复核">
                  <div className="review-cell">
                    <StatusBadge label={reviewPriorityLabels[record.review.priority]} tone={record.review.priority === 'critical' || record.review.priority === 'high' ? 'risk' : 'neutral'} dot={false} />
                    <small>{record.review.owner}</small>
                  </div>
                </td>
                <td data-label="最近更新">
                  <div className="date-cell">
                    <span>{formatDate(record.dates.lastUpdate ?? record.dates.firstAction)}</span>
                    <small>{sourceCount} 个来源</small>
                  </div>
                </td>
                <td data-label="下次复核">
                  <div className="date-cell"><span>{formatDate(record.review.nextReviewDate)}</span></div>
                </td>
                <td className="case-table__arrow"><Icon name="chevron-right" size={18} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: CaseSortKey
  sort?: CaseSort
  onSort?: (key: CaseSortKey) => void
}) {
  const active = sort?.key === sortKey
  const ariaSort = active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
  return (
    <th scope="col" aria-sort={ariaSort}>
      <button type="button" className="table-sort-button" onClick={() => onSort?.(sortKey)}>
        {label}
        <span className="sort-indicator" aria-hidden="true">{active ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )
}
