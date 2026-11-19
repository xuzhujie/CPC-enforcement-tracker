import { describe, expect, it } from 'vitest'
import { cases } from '../data/cases'
import { getReviewQueue, sortCases } from './caseWorkflow'

const workflowCases = [
  {
    ...cases[0],
    id: 'medium-case',
    company: 'Medium case',
    review: { ...cases[0].review, priority: 'medium' as const, nextReviewDate: '2026-11-20' },
  },
  {
    ...cases[1],
    id: 'high-later',
    company: 'High later',
    review: { ...cases[1].review, priority: 'high' as const, nextReviewDate: '2026-12-01' },
  },
  {
    ...cases[2],
    id: 'high-sooner',
    company: 'High sooner',
    review: { ...cases[2].review, priority: 'high' as const, nextReviewDate: '2026-11-21' },
  },
]

describe('case workflow', () => {
  it('sorts by priority, then next review date, without mutating input', () => {
    const input = [...workflowCases]
    const sorted = sortCases(input, { key: 'priority', direction: 'desc' })

    expect(sorted.map((record) => record.id)).toEqual(['high-sooner', 'high-later', 'medium-case'])
    expect(input.map((record) => record.id)).toEqual(['medium-case', 'high-later', 'high-sooner'])
  })

  it('sorts company names in the requested direction', () => {
    expect(sortCases(workflowCases, { key: 'company', direction: 'asc' }).map((record) => record.company)).toEqual([
      'High later',
      'High sooner',
      'Medium case',
    ])
  })

  it('builds a queue from active cases and respects the limit', () => {
    const queue = getReviewQueue([...workflowCases, cases[3]], 2)

    expect(queue.map((record) => record.id)).toEqual(['high-sooner', 'high-later'])
    expect(queue.every((record) => record.status === 'investigating' || record.status === 'ongoing')).toBe(true)
  })
})
