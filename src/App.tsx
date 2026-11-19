import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cases } from './data/cases'
import { sources } from './data/sources'
import { snapshotManifest } from './data/snapshot'
import { businessModelLabels, formatDate, practiceLabels, reviewPriorityLabels, statusLabels } from './lib/format'
import { getReviewQueue, sortCases, type CaseSort, type CaseSortKey } from './lib/caseWorkflow'
import { downloadCasesCsv } from './lib/export'
import { computeOverview, filterCases, getCaseYear, getOutcomeCounts, getThemeCounts } from './lib/metrics'
import type { AppView, CaseRecord, FilterState, PracticeTag } from './types'
import { CaseDrawer } from './components/CaseDrawer'
import { CaseTable } from './components/CaseTable'
import { Filters } from './components/Filters'
import { Icon, type IconName } from './components/Icon'
import { KpiCard } from './components/KpiCard'
import { OutcomeSplit } from './components/OutcomeSplit'
import { SourceHealth } from './components/SourceHealth'
import { StatusBadge } from './components/StatusBadge'
import { ThemeBars } from './components/ThemeBars'

const defaultFilters: FilterState = {
  search: '',
  businessModel: 'all',
  status: 'all',
  theme: 'all',
  year: 'all',
}

const navigation: Array<{ id: AppView; label: string; icon: IconName }> = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'cases', label: 'Cases', icon: 'list' },
  { id: 'themes', label: 'Themes', icon: 'layers' },
  { id: 'sources', label: 'Sources', icon: 'external' },
]

function SectionHeading({ eyebrow, title, helper, actions }: { eyebrow?: string; title: string; helper?: string; actions?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {(helper || actions) && (
        <div className="section-heading__right">
          {helper && <span className="section-heading__hint">{helper}</span>}
          {actions}
        </div>
      )}
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState<AppView>('overview')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [sort, setSort] = useState<CaseSort>({ key: 'priority', direction: 'desc' })

  const years = useMemo(() => Array.from(new Set(cases.map(getCaseYear).filter((year): year is number => year !== null)))
    .sort((a, b) => b - a)
    .map(String), [])
  const filteredCases = useMemo(() => filterCases(cases, filters), [filters])
  const sortedCases = useMemo(() => sortCases(filteredCases, sort), [filteredCases, sort])
  const overview = useMemo(() => computeOverview(filteredCases), [filteredCases])
  const themeCounts = useMemo(() => getThemeCounts(filteredCases), [filteredCases])
  const outcomeCounts = useMemo(() => getOutcomeCounts(filteredCases), [filteredCases])
  const selectedCase = selectedCaseId ? cases.find((record) => record.id === selectedCaseId) : undefined

  const handleSelect = (record: CaseRecord) => setSelectedCaseId(record.id)
  const handleClose = useCallback(() => setSelectedCaseId(null), [])
  const handleThemeSelect = (tag: PracticeTag) => {
    setFilters((current) => ({ ...current, theme: tag }))
    setActiveView('cases')
  }
  const clearFilters = () => setFilters(defaultFilters)

  const renderFilters = activeView !== 'sources'
  const reviewQueue = useMemo(() => getReviewQueue(filteredCases, 3), [filteredCases])
  const handleSort = (key: CaseSortKey) => {
    setSort((current) => current.key === key
      ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: key === 'priority' ? 'desc' : 'asc' })
  }
  const handleExport = () => downloadCasesCsv(sortedCases)

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">CPC</div>
          <div><strong>CPC</strong><span>ENFORCEMENT TRACKER</span></div>
        </div>
        <div className="rail-label">Workspace</div>
        <nav className="main-nav" aria-label="主导航">
          {navigation.map((item) => (
            <button
              type="button"
              className={`nav-button ${activeView === item.id ? 'nav-button--active' : ''}`}
              key={item.id}
              onClick={() => setActiveView(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.id === 'cases' && <span className="nav-count">{cases.length}</span>}
            </button>
          ))}
        </nav>
        <div className="rail-footer">
          <div className="rail-footnote"><span className="live-dot" />Public source snapshot</div>
          <p>Checked {formatDate(snapshotManifest.checkedAt)}</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>EU consumer protection</span><Icon name="chevron-right" size={13} /><strong>{activeView === 'overview' ? 'Overview' : activeView[0].toUpperCase() + activeView.slice(1)}</strong></div>
          <div className="topbar__actions">
            <span className="snapshot-status"><span className="live-dot" />Snapshot · {formatDate(snapshotManifest.checkedAt)}</span>
            <a className="topbar-link" href={sources[0].url} target="_blank" rel="noreferrer">European Commission <Icon name="arrow-up-right" size={14} /></a>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-intro">
            <div>
              <p className="page-kicker">CPC NETWORK / DIGITAL FAIRNESS</p>
              <h1>CPC Enforcement Tracker</h1>
              <p className="page-description">将公开协调行动、企业承诺与最终罚款拆开看，快速定位 App、电商与订阅业务的消费者保护风险。</p>
            </div>
            <div className="intro-note"><Icon name="alert" size={16} /><span>公开来源快照<br />不替代法律审查</span></div>
          </div>

          {renderFilters && <Filters filters={filters} onChange={setFilters} onClear={clearFilters} resultCount={filteredCases.length} years={years} />}

          {activeView === 'overview' && (
            <>
              <section className="kpi-grid" aria-label="顶层指标">
                <KpiCard label="活跃协调行动" value={overview.activeActions} helper="按案件计数 · 调查中 / 推进中" tone="accent" />
                <KpiCard label="已记录企业承诺" value={overview.commitmentCases} helper="按案件计数 · 包含监测中" tone="success" />
                <KpiCard label="最终罚款记录" value={overview.disclosedFineRecords} helper="仅计入公开披露金额的记录" tone="muted" />
                <KpiCard label="当前案件" value={overview.filteredCases} helper={`${overview.sourceRecords} 个来源入口覆盖`} tone="default" />
              </section>

              <section className="review-section">
                <SectionHeading eyebrow="REVIEW QUEUE" title="优先复核" helper="仍在推进的公开轨迹" />
                <div className="queue-list">
                  {reviewQueue.length === 0 ? <p className="empty-copy">当前筛选没有仍在推进的案件。</p> : reviewQueue.map((record) => (
                    <button type="button" className="queue-item" key={record.id} onClick={() => handleSelect(record)}>
                      <div className="queue-item__identity"><span className="queue-item__indicator" /><div><strong>{record.company}</strong><span>{record.leadAuthority ?? 'CPC Network'}</span></div></div>
                      <div className="queue-item__themes">{record.practiceTags.slice(0, 2).map((tag) => <span key={tag}>{practiceLabels[tag]}</span>)}</div>
                      <StatusBadge label={statusLabels[record.status]} tone="risk" />
                      <div className="queue-item__review"><span>{reviewPriorityLabels[record.review.priority]}</span><span>下次 {formatDate(record.review.nextReviewDate)}</span></div>
                      <Icon name="arrow-up-right" size={17} />
                    </button>
                  ))}
                </div>
              </section>

              <div className="dashboard-grid">
                <section className="panel panel--themes">
                  <SectionHeading eyebrow="THEMES" title="重点风险主题" helper="案件可多标签" />
                  <ThemeBars items={themeCounts} onSelect={handleThemeSelect} />
                </section>
                <section className="panel panel--outcomes">
                  <SectionHeading eyebrow="OUTCOMES" title="结果轨迹" helper="分母各自独立" />
                  <OutcomeSplit items={outcomeCounts} />
                </section>
              </div>

              <section className="panel source-panel"><SourceHealth sources={sources} recordCount={overview.filteredCases} snapshot={snapshotManifest} /></section>

              <section className="panel cases-panel">
                <SectionHeading eyebrow="ALL CASES" title="案件工作列表" helper={`${filteredCases.length} / ${cases.length} 条`} actions={<button type="button" className="secondary-button" onClick={handleExport}>导出当前案件</button>} />
                <CaseTable cases={sortedCases} onSelect={handleSelect} sort={sort} onSort={handleSort} />
              </section>
            </>
          )}

          {activeView === 'cases' && (
            <section className="panel cases-panel cases-view-panel">
              <SectionHeading eyebrow="CASE REGISTER" title="案件登记" helper="点击一行打开详情" actions={<button type="button" className="secondary-button" onClick={handleExport}>导出当前案件</button>} />
              <CaseTable cases={sortedCases} onSelect={handleSelect} sort={sort} onSort={handleSort} />
            </section>
          )}

          {activeView === 'themes' && (
            <>
              <section className="panel themes-view-panel">
                <SectionHeading eyebrow="THEME LENS" title="主题审阅" helper="重点主题按案件去重" />
                <ThemeBars items={themeCounts} onSelect={handleThemeSelect} />
              </section>
              <section className="panel cases-panel">
                <SectionHeading eyebrow="THEME CASES" title={filters.theme === 'all' ? '全部主题案件' : practiceLabels[filters.theme as PracticeTag]} helper={`${filteredCases.length} 条`}/>
                <CaseTable cases={sortedCases} onSelect={handleSelect} sort={sort} onSort={handleSort} />
              </section>
            </>
          )}

          {activeView === 'sources' && (
            <section className="sources-view">
              <SectionHeading eyebrow="PUBLIC SOURCES" title="来源入口" helper={`${sources.length} 个官方入口`} />
              <div className="source-grid">
                {sources.map((source) => (
                  <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                    <div className="source-card__top"><span className="source-card__type">{source.type === 'official_page' ? 'OFFICIAL PAGE' : 'OFFICIAL PDF'}</span><Icon name="arrow-up-right" size={17} /></div>
                    <h3>{source.title}</h3>
                    <p>{source.scope}</p>
                    <span className="source-card__date">核对于 {formatDate(source.checkedAt)}</span>
                  </a>
                ))}
              </div>
              <section className="panel source-panel"><SourceHealth sources={sources} recordCount={cases.length} snapshot={snapshotManifest} /></section>
            </section>
          )}
        </div>
      </main>

      <CaseDrawer record={selectedCase} onClose={handleClose} sources={sources} />
    </div>
  )
}

export { App }
