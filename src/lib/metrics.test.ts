import { describe, expect, it } from 'vitest'
import type { CaseRecord } from '../types'
import { cases } from '../data/cases'
import { formatAmount, formatDate } from './format'
import {
  computeOverview,
  filterCases,
  getCaseYear,
  getOutcomeCounts,
  getThemeCounts,
  isActiveCase,
} from './metrics'

const fixtureReview = {
  owner: 'Test owner',
  priority: 'medium' as const,
  lastReviewedAt: '2026-11-19',
  nextReviewDate: '2026-12-03',
  confidence: 'source_snapshot' as const,
}

const fixtureCases: CaseRecord[] = [
  {
    id: 'active-1',
    company: 'Example App',
    businessModels: ['app'],
    jurisdictions: ['EU'],
    practiceTags: ['dark_patterns'],
    status: 'ongoing',
    review: fixtureReview,
    dates: { firstAction: '2024-01-01', lastUpdate: '2025-01-01' },
    coordinatedActions: [{ summary: 'Action', status: 'ongoing' }],
    commitments: [],
    finalPenalties: [],
    evidence: [],
    timeline: [],
  },
  {
    id: 'commitment-1',
    company: 'Example Marketplace',
    businessModels: ['marketplace'],
    jurisdictions: ['EU'],
    practiceTags: ['reviews_ratings'],
    status: 'commitment_monitoring',
    review: fixtureReview,
    dates: { firstAction: '2023-01-01', lastUpdate: '2024-02-01' },
    coordinatedActions: [],
    commitments: [{ summary: 'Commitment' }],
    finalPenalties: [],
    evidence: [],
    timeline: [],
  },
  {
    id: 'mixed-1',
    company: 'Example Subscription',
    businessModels: ['subscription', 'app'],
    jurisdictions: ['EU'],
    practiceTags: ['dark_patterns', 'reviews_ratings'],
    status: 'investigating',
    review: fixtureReview,
    dates: { firstAction: '2022-04-01' },
    coordinatedActions: [{ summary: 'Action', status: 'investigating' }],
    commitments: [{ summary: 'Commitment' }],
    finalPenalties: [{ disclosure: 'disclosed', amount: 125000, currency: 'EUR' }],
    evidence: [],
    timeline: [],
  },
]

describe('case metrics', () => {
  it('filters records by business model and computes the filtered overview', () => {
    const filtered = filterCases(fixtureCases, {
      search: 'Example App',
      businessModel: 'app',
      status: 'all',
      theme: 'all',
      year: 'all',
    })

    expect(filtered).toHaveLength(1)
    expect(computeOverview(filtered)).toMatchObject({
      activeActions: 1,
      commitmentCases: 0,
      disclosedFineRecords: 0,
    })
  })

  it('counts the same case once per theme and separates outcomes', () => {
    expect(getThemeCounts(fixtureCases)).toEqual([
      { tag: 'dark_patterns', count: 2 },
      { tag: 'reviews_ratings', count: 2 },
    ])

    expect(getOutcomeCounts(fixtureCases)).toEqual([
      { type: 'coordinated_action', count: 2 },
      { type: 'commitment', count: 2 },
      { type: 'final_penalty', count: 1 },
    ])
  })

  it('treats investigating as active and falls back to firstAction for the year', () => {
    expect(isActiveCase(fixtureCases[2])).toBe(true)
    expect(isActiveCase(fixtureCases[1])).toBe(false)
    expect(getCaseYear(fixtureCases[2])).toBe(2022)
  })

  it('counts disclosed fines without turning missing fines into zero records', () => {
    expect(computeOverview(fixtureCases)).toMatchObject({
      activeActions: 2,
      commitmentCases: 2,
      disclosedFineRecords: 1,
      filteredCases: 3,
    })
  })

  it('filters by status, theme, and year together', () => {
    const filtered = filterCases(fixtureCases, {
      search: '',
      businessModel: 'all',
      status: 'ongoing',
      theme: 'dark_patterns',
      year: '2025',
    })

    expect(filtered.map((record) => record.id)).toEqual(['active-1'])
  })

  it('searches the registered source title', () => {
    const filtered = filterCases(cases, {
      search: 'Market places and digital services',
      businessModel: 'all',
      status: 'all',
      theme: 'all',
      year: 'all',
    })

    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.some((record) => record.company === 'SHEIN')).toBe(true)
  })

  it('keeps undisclosed penalties separate from disclosed fines and preserves month precision', () => {
    const undisclosedCase: CaseRecord = {
      ...fixtureCases[0],
      id: 'undisclosed-1',
      dates: { firstAction: '2025-05' },
      finalPenalties: [{ disclosure: 'not_disclosed' }],
    }

    expect(computeOverview([undisclosedCase]).disclosedFineRecords).toBe(0)
    expect(getOutcomeCounts([undisclosedCase])).toContainEqual({ type: 'final_penalty', count: 1 })
    expect(formatAmount()).toBe('金额未披露')
    expect(formatDate('2025-05')).toBe('2025年5月')
    expect(formatDate()).toBe('未披露')
  })
})
