import { sourceById } from '../data/sources'
import { businessModelLabels, formatDate, practiceLabels, reviewPriorityLabels, statusLabels } from './format'
import type { CaseRecord } from '../types'

const headers = ['案件 ID', '企业 / 平台', '业务模式', '重点主题', '状态', '复核优先级', '负责人', '下次复核', '最近更新', '结果记录', '来源']

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function casesToCsv(records: CaseRecord[]): string {
  const rows = records.map((record) => {
    const outcomes = [
      record.coordinatedActions.length > 0 ? '协调行动' : '',
      record.commitments.length > 0 ? '企业承诺' : '',
      record.finalPenalties.length > 0 ? '最终罚款' : '',
    ].filter(Boolean).join(' / ') || '待更新'
    const sourceTitles = Array.from(new Set(record.evidence.map((item) => sourceById[item.sourceId]?.title ?? item.sourceId))).join(' / ')

    return [
      record.id,
      record.company,
      record.businessModels.map((model) => businessModelLabels[model]).join(' / '),
      record.practiceTags.map((tag) => practiceLabels[tag]).join(' / '),
      statusLabels[record.status],
      reviewPriorityLabels[record.review.priority],
      record.review.owner,
      formatDate(record.review.nextReviewDate),
      formatDate(record.dates.lastUpdate ?? record.dates.firstAction),
      outcomes,
      sourceTitles,
    ].map(csvCell).join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

export function downloadCasesCsv(records: CaseRecord[], filename = 'cpc-enforcement-cases.csv'): void {
  const blob = new Blob([casesToCsv(records)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
