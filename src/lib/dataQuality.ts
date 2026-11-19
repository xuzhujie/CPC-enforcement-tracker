import type { CaseRecord, SnapshotManifest, SourceRecord } from '../types'

export type DataQualityIssue = {
  code:
    | 'duplicate_id'
    | 'missing_review'
    | 'invalid_review_priority'
    | 'invalid_review_date'
    | 'review_after_snapshot'
    | 'unknown_source'
    | 'missing_penalty_amount'
    | 'invalid_penalty_disclosure'
  recordId: string
  field: string
  message: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const priorityValues = new Set(['critical', 'high', 'medium', 'low'])

export function validateSnapshot(
  records: CaseRecord[],
  sources: SourceRecord[],
  snapshot: SnapshotManifest,
): DataQualityIssue[] {
  const issues: DataQualityIssue[] = []
  const sourceIds = new Set(sources.map((source) => source.id))
  const seenIds = new Set<string>()

  records.forEach((record) => {
    if (seenIds.has(record.id)) {
      issues.push({ code: 'duplicate_id', recordId: record.id, field: 'id', message: '案件 ID 必须唯一。' })
    }
    seenIds.add(record.id)

    if (!record.review) {
      issues.push({ code: 'missing_review', recordId: record.id, field: 'review', message: '案件缺少运营复核元数据。' })
    } else {
      if (!priorityValues.has(record.review.priority)) {
        issues.push({ code: 'invalid_review_priority', recordId: record.id, field: 'review.priority', message: '复核优先级不在允许范围内。' })
      }
      if (!datePattern.test(record.review.lastReviewedAt) || !datePattern.test(record.review.nextReviewDate)) {
        issues.push({ code: 'invalid_review_date', recordId: record.id, field: 'review', message: '复核日期必须使用 YYYY-MM-DD。' })
      }
      if (record.review.lastReviewedAt > snapshot.checkedAt) {
        issues.push({ code: 'review_after_snapshot', recordId: record.id, field: 'review.lastReviewedAt', message: '复核日期不能晚于来源快照日期。' })
      }
    }

    record.evidence.forEach((item, index) => {
      if (!sourceIds.has(item.sourceId)) {
        issues.push({ code: 'unknown_source', recordId: record.id, field: `evidence[${index}].sourceId`, message: `来源 ${item.sourceId} 不在来源清单中。` })
      }
    })

    record.finalPenalties.forEach((penalty, index) => {
      if (penalty.disclosure === 'disclosed' && (typeof penalty.amount !== 'number' || !penalty.currency)) {
        issues.push({ code: 'missing_penalty_amount', recordId: record.id, field: `finalPenalties[${index}]`, message: '已披露罚款必须包含金额和币种。' })
      }
      if (penalty.disclosure === 'not_disclosed' && penalty.amount !== undefined) {
        issues.push({ code: 'invalid_penalty_disclosure', recordId: record.id, field: `finalPenalties[${index}]`, message: '金额未披露的罚款记录不能携带金额。' })
      }
    })
  })

  const missingManifestSources = snapshot.sourceIds.filter((sourceId) => !sourceIds.has(sourceId))
  missingManifestSources.forEach((sourceId) => {
    issues.push({ code: 'unknown_source', recordId: snapshot.id, field: 'sourceIds', message: `快照引用了不存在的来源 ${sourceId}。` })
  })

  return issues
}
