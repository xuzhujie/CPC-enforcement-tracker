import type { SourceRecord } from '../types'

export const sources: SourceRecord[] = [
  {
    id: 'ec-marketplaces-digital-services',
    title: 'Market places and digital services',
    url: 'https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/market-places-and-digital-services_en',
    type: 'official_page',
    checkedAt: '2026-11-19',
    scope: '公开的市场平台、电商、数字服务 CPC 协调行动与企业承诺。',
  },
  {
    id: 'ec-social-media-games-search',
    title: 'Social media, online games and search engines',
    url: 'https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en',
    type: 'official_page',
    checkedAt: '2026-11-19',
    scope: '公开的社交媒体、在线游戏、搜索和广告相关 CPC 行动。',
  },
  {
    id: 'ec-consumer-traps-scams',
    title: 'Consumer frequent traps and scams',
    url: 'https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/consumer-frequent-traps-and-scams_en',
    type: 'official_page',
    checkedAt: '2026-11-19',
    scope: '公开的 recurring payment、订阅陷阱与消费者诈骗相关行动。',
  },
  {
    id: 'ec-sweeps',
    title: 'Sweeps',
    url: 'https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/sweeps_en',
    type: 'official_page',
    checkedAt: '2026-11-19',
    scope: '欧委会与国家执法机构同步检查项目，作为主题背景与来源边界。',
  },
]

export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source])) as Record<string, SourceRecord>
