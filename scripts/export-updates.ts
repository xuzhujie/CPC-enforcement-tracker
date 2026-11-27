// 导出最近更新的执法案件为 public/data/updates.json，
// 供九号舆情工作台（妙搭应用）通过 raw.githubusercontent.com 机读消费。
import { mkdirSync, writeFileSync } from 'node:fs'
import { cases } from '../src/data/cases'
import { snapshotManifest } from '../src/data/snapshot'

const ITEM_LIMIT = 8
const SUMMARY_LIMIT = 200

const items = cases
  .slice()
  .sort((left, right) => (right.dates.lastUpdate ?? '').localeCompare(left.dates.lastUpdate ?? ''))
  .slice(0, ITEM_LIMIT)
  .map((item) => ({
    title: `${item.company} · CPC 协同执法`,
    link: item.evidence[0]?.sourceUrl ?? '',
    date: item.dates.lastUpdate ?? item.dates.firstAction,
    summary: (item.coordinatedActions[0]?.summary ?? item.evidence[0]?.summary ?? '').slice(0, SUMMARY_LIMIT),
  }))

const payload = {
  updated_at: (snapshotManifest.checkedAt ?? '').slice(0, 10),
  source: 'cpc-enforcement-tracker src/data/cases.ts',
  items,
}

mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/updates.json', JSON.stringify(payload, null, 2) + '\n')
console.log(`exported ${items.length} items to public/data/updates.json`)
