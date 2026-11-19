import type {
  CaseRecord,
  FilterState,
  OutcomeCount,
  OverviewMetrics,
  PracticeTag,
  ThemeCount,
} from '../types'
import { sourceById } from '../data/sources'
import { practiceLabels } from './format'

const themeOrder: PracticeTag[] = [
  'dark_patterns',
  'subscription_renewal_cancellation',
  'misleading_discounts',
  'reviews_ratings',
  'advertising',
  'pressure_selling',
  'hidden_information',
  'geo_blocking',
  'personalised_pricing',
  'seller_transparency',
]

function searchableText(record: CaseRecord): string {
  return [
    record.company,
    ...(record.aliases ?? []),
    ...record.practiceTags.map((tag) => practiceLabels[tag]),
    ...record.evidence.map((item) => item.summary),
    ...record.evidence.flatMap((item) => {
      const source = sourceById[item.sourceId]
      return source ? [source.title, source.scope] : []
    }),
    ...record.commitments.map((item) => item.summary),
    ...record.coordinatedActions.map((item) => item.summary),
  ]
    .join(' ')
    .toLocaleLowerCase()
}

export function getCaseYear(record: CaseRecord): number | null {
  const value = record.dates.lastUpdate ?? record.dates.firstAction
  if (!value) return null
  const year = Number(value.slice(0, 4))
  return Number.isInteger(year) && year > 1900 ? year : null
}

export function isActiveCase(record: CaseRecord): boolean {
  return (
    record.status === 'investigating' ||
    record.status === 'ongoing' ||
    record.coordinatedActions.some((action) => action.status === 'investigating' || action.status === 'ongoing')
  )
}

export function filterCases(records: CaseRecord[], filters: FilterState): CaseRecord[] {
  const query = filters.search.trim().toLocaleLowerCase()

  return records.filter((record) => {
    const matchesSearch = !query || searchableText(record).includes(query)
    const matchesBusinessModel = filters.businessModel === 'all' || record.businessModels.includes(filters.businessModel)
    const matchesStatus = filters.status === 'all' || record.status === filters.status
    const matchesTheme = filters.theme === 'all' || record.practiceTags.includes(filters.theme)
    const matchesYear = filters.year === 'all' || String(getCaseYear(record)) === filters.year
    return matchesSearch && matchesBusinessModel && matchesStatus && matchesTheme && matchesYear
  })
}

export function computeOverview(records: CaseRecord[]): OverviewMetrics {
  return {
    activeActions: records.filter(isActiveCase).length,
    commitmentCases: records.filter((record) => record.commitments.length > 0).length,
    disclosedFineRecords: records.reduce(
      (count, record) => count + record.finalPenalties.filter((penalty) => penalty.disclosure === 'disclosed').length,
      0,
    ),
    filteredCases: records.length,
    sourceRecords: new Set(records.flatMap((record) => record.evidence.map((item) => item.sourceId))).size,
  }
}

export function getThemeCounts(records: CaseRecord[]): ThemeCount[] {
  return themeOrder
    .map((tag) => ({ tag, count: records.filter((record) => record.practiceTags.includes(tag)).length }))
    .filter((item) => item.count > 0)
}

export function getOutcomeCounts(records: CaseRecord[]): OutcomeCount[] {
  return [
    { type: 'coordinated_action', count: records.filter((record) => record.coordinatedActions.length > 0).length },
    { type: 'commitment', count: records.filter((record) => record.commitments.length > 0).length },
    { type: 'final_penalty', count: records.reduce((count, record) => count + record.finalPenalties.length, 0) },
  ]
}
