export type BusinessModel =
  | 'app'
  | 'ecommerce'
  | 'marketplace'
  | 'subscription'
  | 'payments'
  | 'advertising'

export type PracticeTag =
  | 'dark_patterns'
  | 'subscription_renewal_cancellation'
  | 'misleading_discounts'
  | 'reviews_ratings'
  | 'advertising'
  | 'pressure_selling'
  | 'hidden_information'
  | 'geo_blocking'
  | 'personalised_pricing'
  | 'seller_transparency'

export type CaseStatus =
  | 'investigating'
  | 'ongoing'
  | 'commitment_monitoring'
  | 'closed'
  | 'enforcement_possible'
  | 'unknown'

export type ActionStatus = 'investigating' | 'ongoing' | 'closed' | 'unknown'

export type SourceType = 'official_page' | 'official_pdf'

export type ReviewPriority = 'critical' | 'high' | 'medium' | 'low'

export type ReviewConfidence = 'source_snapshot' | 'needs_manual_review'

export type CaseReview = {
  owner: string
  priority: ReviewPriority
  lastReviewedAt: string
  nextReviewDate: string
  confidence: ReviewConfidence
}

export type SnapshotManifest = {
  id: string
  checkedAt: string
  nextReviewDate: string
  mode: 'manual_snapshot'
  sourceIds: string[]
  notes: string
}

export type SourceRecord = {
  id: string
  title: string
  url: string
  type: SourceType
  checkedAt: string
  scope: string
}

export type CaseRecord = {
  id: string
  company: string
  aliases?: string[]
  businessModels: BusinessModel[]
  jurisdictions: string[]
  leadAuthority?: string
  practiceTags: PracticeTag[]
  status: CaseStatus
  review: CaseReview
  dates: {
    firstAction?: string
    lastUpdate?: string
    commitment?: string
    finalDecision?: string
  }
  coordinatedActions: Array<{
    summary: string
    status: ActionStatus
    coordinator?: string
  }>
  commitments: Array<{
    summary: string
    implementationDate?: string
    monitoring?: string
    unresolved?: string
  }>
  finalPenalties: Array<{
    disclosure: 'disclosed' | 'not_disclosed'
    amount?: number
    currency?: string
    decidedBy?: string
    decisionDate?: string
  }>
  evidence: Array<{
    summary: string
    sourceId: string
    sourceUrl: string
    sourceType: SourceType
    checkedAt: string
  }>
  timeline: Array<{
    date?: string
    type: 'action' | 'notification' | 'dialogue' | 'commitment' | 'monitoring' | 'closure' | 'penalty'
    summary: string
    sourceId: string
  }>
}

export type FilterState = {
  search: string
  businessModel: BusinessModel | 'all'
  status: CaseStatus | 'all'
  theme: PracticeTag | 'all'
  year: string | 'all'
}

export type OverviewMetrics = {
  activeActions: number
  commitmentCases: number
  disclosedFineRecords: number
  filteredCases: number
  sourceRecords: number
}

export type ThemeCount = {
  tag: PracticeTag
  count: number
}

export type OutcomeType = 'coordinated_action' | 'commitment' | 'final_penalty'

export type OutcomeCount = {
  type: OutcomeType
  count: number
}

export type AppView = 'overview' | 'cases' | 'themes' | 'sources'
