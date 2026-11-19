import { sources } from './sources'
import type { SnapshotManifest } from '../types'

export const snapshotManifest: SnapshotManifest = {
  id: 'ec-cpc-snapshot-2026-11-19',
  checkedAt: '2026-11-19',
  nextReviewDate: '2026-12-03',
  mode: 'manual_snapshot',
  sourceIds: sources.map((source) => source.id),
  notes: '首版仅整理欧委会公开页面；更新前需重新核对来源页面并保留差异记录。',
}
