import { useEffect, useRef } from 'react'
import { formatAmount, formatDate, practiceLabels, reviewPriorityLabels, statusLabels } from '../lib/format'
import type { CaseRecord, SourceRecord } from '../types'
import { Icon } from './Icon'
import { StatusBadge } from './StatusBadge'

type CaseDrawerProps = {
  record?: CaseRecord
  onClose: () => void
  sources: SourceRecord[]
}

function statusTone(status: CaseRecord['status']): 'risk' | 'success' | 'neutral' | 'amber' {
  if (status === 'investigating' || status === 'ongoing') return 'risk'
  if (status === 'commitment_monitoring') return 'success'
  if (status === 'enforcement_possible') return 'amber'
  return 'neutral'
}

function reviewTone(priority: CaseRecord['review']['priority']): 'risk' | 'neutral' | 'amber' {
  if (priority === 'critical' || priority === 'high') return 'risk'
  if (priority === 'medium') return 'amber'
  return 'neutral'
}

export function CaseDrawer({ record, onClose, sources }: CaseDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!record) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !drawerRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !drawerRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [record, onClose])

  if (!record) return null

  const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]))
  const timeline = [...record.timeline].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside ref={drawerRef} className="case-drawer" role="dialog" aria-modal="true" aria-labelledby="case-drawer-title" tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}>
        <header className="case-drawer__header">
          <div>
            <p className="drawer-kicker">CASE REVIEW</p>
            <h2 id="case-drawer-title">{record.company}</h2>
            <div className="drawer-meta">
              <StatusBadge label={statusLabels[record.status]} tone={statusTone(record.status)} />
              <span>{record.jurisdictions.join(' · ')}</span>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="关闭案件详情">
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="case-drawer__body">
          <section className="drawer-section drawer-section--intro">
            <div className="drawer-stat"><span>首次行动</span><strong>{formatDate(record.dates.firstAction)}</strong></div>
            <div className="drawer-stat"><span>最近更新</span><strong>{formatDate(record.dates.lastUpdate)}</strong></div>
            <div className="drawer-stat"><span>牵头机构</span><strong>{record.leadAuthority ?? '未披露'}</strong></div>
          </section>

          <section className="drawer-section">
            <div className="section-heading section-heading--drawer">
              <div><span className="section-number">01</span><h3>运营复核</h3></div>
            </div>
            <div className="drawer-review-grid">
              <div><span>优先级</span><StatusBadge label={reviewPriorityLabels[record.review.priority]} tone={reviewTone(record.review.priority)} dot={false} /></div>
              <div><span>负责人</span><strong>{record.review.owner}</strong></div>
              <div><span>最近核对</span><strong>{formatDate(record.review.lastReviewedAt)}</strong></div>
              <div><span>下次复核</span><strong>{formatDate(record.review.nextReviewDate)}</strong></div>
              <div><span>数据状态</span><strong>{record.review.confidence === 'source_snapshot' ? '官方快照' : '需要人工复核'}</strong></div>
            </div>
          </section>

          <section className="drawer-section">
            <div className="section-heading section-heading--drawer">
              <div><span className="section-number">02</span><h3>风险主题</h3></div>
            </div>
            <div className="drawer-tags">
              {record.practiceTags.map((tag) => <span className="theme-tag theme-tag--large" key={tag}>{practiceLabels[tag]}</span>)}
            </div>
          </section>

          <section className="drawer-section">
            <div className="section-heading section-heading--drawer">
              <div><span className="section-number">03</span><h3>结果轨迹</h3></div>
              <span className="section-heading__hint">独立记录</span>
            </div>
            <div className="outcome-records">
              {record.coordinatedActions.length > 0 && (
                <div className="outcome-record outcome-record--action">
                  <div className="outcome-record__title"><span className="outcome-marker" />协调行动</div>
                  {record.coordinatedActions.map((action) => <p key={action.summary}>{action.summary}</p>)}
                </div>
              )}
              {record.commitments.length > 0 && (
                <div className="outcome-record outcome-record--commitment">
                  <div className="outcome-record__title"><span className="outcome-marker" />企业承诺</div>
                  {record.commitments.map((commitment) => (
                    <div key={commitment.summary}>
                      <p>{commitment.summary}</p>
                      {commitment.implementationDate && <small>实施期限：{formatDate(commitment.implementationDate)}</small>}
                      {commitment.monitoring && <small>监测：{commitment.monitoring}</small>}
                      {commitment.unresolved && <small className="unresolved-note">仍待解决：{commitment.unresolved}</small>}
                    </div>
                  ))}
                </div>
              )}
              <div className="outcome-record outcome-record--penalty">
                <div className="outcome-record__title"><span className="outcome-marker" />最终罚款</div>
                {record.finalPenalties.length === 0 ? (
                  <p className="muted-copy">暂无公开罚款记录</p>
                ) : record.finalPenalties.map((penalty, index) => (
                  <div key={`${record.id}-penalty-${index}`}>
                    <p>{penalty.disclosure === 'not_disclosed' ? '金额未披露' : formatAmount(penalty.amount, penalty.currency)}</p>
                    {penalty.decidedBy && <small>{penalty.decidedBy}</small>}
                    {penalty.decisionDate && <small>决定日期：{formatDate(penalty.decisionDate)}</small>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <div className="section-heading section-heading--drawer">
              <div><span className="section-number">04</span><h3>时间线</h3></div>
            </div>
            <div className="timeline">
              {timeline.length === 0 ? <p className="muted-copy">暂无时间线记录</p> : timeline.map((event, index) => (
                <div className="timeline-item" key={`${event.sourceId}-${event.type}-${index}`}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <div><span className="timeline-date">{formatDate(event.date)}</span><p>{event.summary}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section">
            <div className="section-heading section-heading--drawer">
              <div><span className="section-number">05</span><h3>来源证据</h3></div>
            </div>
            <div className="evidence-list">
              {record.evidence.map((item) => {
                const source = sourceById[item.sourceId]
                return (
                  <article className="evidence-item" key={`${item.sourceId}-${item.summary}`}>
                    <p>{item.summary}</p>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      {source?.title ?? '打开官方来源'} <Icon name="arrow-up-right" size={14} />
                    </a>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
