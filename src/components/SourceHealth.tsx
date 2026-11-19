import { formatDate } from '../lib/format'
import type { SnapshotManifest, SourceRecord } from '../types'

type SourceHealthProps = {
  sources: SourceRecord[]
  recordCount: number
  snapshot: SnapshotManifest
}

export function SourceHealth({ sources, recordCount, snapshot }: SourceHealthProps) {
  const checkedDates = sources.map((source) => source.checkedAt).sort()
  const latest = checkedDates[checkedDates.length - 1]

  return (
    <section className="source-health" aria-label="来源健康度">
      <div className="source-health__status">
        <span className="source-health__signal" aria-hidden="true" />
        <div>
          <p className="source-health__title">公开来源快照，需人工复核</p>
          <p className="source-health__copy">{snapshot.notes}</p>
        </div>
      </div>
      <div className="source-health__stats">
        <div><span>来源入口</span><strong>{sources.length}</strong></div>
        <div><span>案件记录</span><strong>{recordCount}</strong></div>
        <div><span>最近核对</span><strong>{formatDate(latest)}</strong></div>
        <div><span>下次复核</span><strong>{formatDate(snapshot.nextReviewDate)}</strong></div>
      </div>
    </section>
  )
}
