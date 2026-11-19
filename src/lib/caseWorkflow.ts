import { isActiveCase } from './metrics'
import type { CaseRecord, ReviewPriority } from '../types'

export type CaseSortKey = 'priority' | 'nextReviewDate' | 'company' | 'lastUpdate'

export type CaseSort = {
  key: CaseSortKey
  direction: 'asc' | 'desc'
}

const priorityRank: Record<ReviewPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function comparePrimary(left: CaseRecord, right: CaseRecord, key: CaseSortKey): number {
  if (key === 'priority') return priorityRank[left.review.priority] - priorityRank[right.review.priority]
  if (key === 'nextReviewDate') return left.review.nextReviewDate.localeCompare(right.review.nextReviewDate)
  if (key === 'company') return left.company.localeCompare(right.company)
  return (left.dates.lastUpdate ?? left.dates.firstAction ?? '').localeCompare(right.dates.lastUpdate ?? right.dates.firstAction ?? '')
}

export function sortCases(records: CaseRecord[], sort: CaseSort): CaseRecord[] {
  return [...records].sort((left, right) => {
    const primary = comparePrimary(left, right, sort.key)
    if (primary !== 0) return sort.direction === 'asc' ? primary : -primary

    const nextReview = left.review.nextReviewDate.localeCompare(right.review.nextReviewDate)
    if (nextReview !== 0) return nextReview
    return left.company.localeCompare(right.company)
  })
}

export function getReviewQueue(records: CaseRecord[], limit = 3): CaseRecord[] {
  return sortCases(records.filter(isActiveCase), { key: 'priority', direction: 'desc' }).slice(0, limit)
}
