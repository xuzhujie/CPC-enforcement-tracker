import { describe, expect, it } from 'vitest'
import { cases } from '../data/cases'
import { snapshotManifest } from '../data/snapshot'
import { sources } from '../data/sources'
import { validateSnapshot } from './dataQuality'

describe('snapshot data quality', () => {
  it('accepts the reviewed snapshot', () => {
    expect(validateSnapshot(cases, sources, snapshotManifest)).toEqual([])
  })

  it('flags missing review metadata and unknown source references', () => {
    const invalidCase = {
      ...cases[0],
      id: 'invalid-case',
      review: undefined,
      evidence: [{ ...cases[0].evidence[0], sourceId: 'missing-source' }],
    }

    const issues = validateSnapshot([invalidCase], sources, snapshotManifest)

    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['missing_review', 'unknown_source']))
  })

  it('flags duplicate IDs and incomplete penalty disclosures', () => {
    const duplicate = { ...cases[0], finalPenalties: [{ disclosure: 'disclosed' as const }] }
    const issues = validateSnapshot([duplicate, duplicate], sources, snapshotManifest)

    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['duplicate_id', 'missing_penalty_amount']))
  })
})
