import type { CaseRecord } from '../types'
import { sourceById } from './sources'
import { snapshotManifest } from './snapshot'
import type { ReviewPriority } from '../types'

const marketSource = sourceById['ec-marketplaces-digital-services']
const socialSource = sourceById['ec-social-media-games-search']
const trapsSource = sourceById['ec-consumer-traps-scams']

const reviewMetadata = (priority: ReviewPriority): CaseRecord['review'] => ({
  owner: '待分配',
  priority,
  lastReviewedAt: snapshotManifest.checkedAt,
  nextReviewDate: priority === 'high' ? '2026-11-26' : snapshotManifest.nextReviewDate,
  confidence: 'source_snapshot',
})

const evidence = (
  source: typeof marketSource,
  summary: string,
): CaseRecord['evidence'][number] => ({
  summary,
  sourceId: source.id,
  sourceUrl: source.url,
  sourceType: source.type,
  checkedAt: source.checkedAt,
})

export const cases: CaseRecord[] = [
  {
    id: 'shein-cpc-2025',
    company: 'SHEIN',
    aliases: ['SHEIN marketplace'],
    businessModels: ['ecommerce', 'marketplace'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['misleading_discounts', 'dark_patterns', 'pressure_selling', 'hidden_information', 'reviews_ratings'],
    status: 'investigating',
    review: reviewMetadata('high'),
    dates: { firstAction: '2025-05', lastUpdate: '2025-05' },
    coordinatedActions: [
      {
        summary: 'CPC Network notified SHEIN of practices covering discounts, pressure selling, consumer information, labels, sustainability and contact details.',
        status: 'ongoing',
        coordinator: 'European Commission / CPC Network',
      },
    ],
    commitments: [],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面称行动仍在调查中，并要求 SHEIN 提供更多信息；重点包括 fake discounts、压力销售和可能误导的评价/排名。'),
    ],
    timeline: [
      { date: '2025-05', type: 'notification', summary: 'CPC Network 向 SHEIN 发出通知并要求其整改相关做法。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'apple-geo-blocking-2024',
    company: 'Apple',
    aliases: ['Apple Media Services', 'App Store'],
    businessModels: ['app', 'subscription'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['geo_blocking', 'hidden_information'],
    status: 'ongoing',
    review: reviewMetadata('high'),
    dates: { firstAction: '2024-11', lastUpdate: '2024-11' },
    coordinatedActions: [
      {
        summary: 'CPC Network notified Apple of geo-blocking practices affecting access, payment means and downloads across Apple Media Services.',
        status: 'ongoing',
        coordinator: 'European Commission / CPC Network',
      },
    ],
    commitments: [],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面称行动仍在推进，涉及消费者因居住地而受到的接口、支付方式和应用下载限制。'),
    ],
    timeline: [
      { date: '2024-11', type: 'notification', summary: 'CPC Network 向 Apple 发出关于 geo-blocking 的通知。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'temu-cpc-2024',
    company: 'Temu',
    aliases: ['Temu marketplace'],
    businessModels: ['ecommerce', 'marketplace'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['misleading_discounts', 'dark_patterns', 'pressure_selling', 'reviews_ratings', 'hidden_information'],
    status: 'investigating',
    review: reviewMetadata('high'),
    dates: { firstAction: '2024-11', lastUpdate: '2024-11' },
    coordinatedActions: [
      {
        summary: 'CPC Network notified Temu of practices covering fake discounts, pressure selling, forced gamification, consumer information, reviews and contact details.',
        status: 'ongoing',
        coordinator: 'European Commission / CPC Network',
      },
    ],
    commitments: [],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面称行动仍在进行，除调查 fake discounts、pressure selling 和 fake reviews 外，还要求 Temu 提供更多信息。'),
    ],
    timeline: [
      { date: '2024-11', type: 'notification', summary: 'CPC Network 向 Temu 发出通知并提出多项消费者保护疑点。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'vinted-cpc-2021',
    company: 'Vinted',
    aliases: ['Vinted marketplace'],
    businessModels: ['marketplace', 'ecommerce'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'Lithuanian State Consumer Rights Protection Authority',
    practiceTags: ['reviews_ratings', 'hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: { firstAction: '2021-12' },
    coordinatedActions: [],
    commitments: [
      {
        summary: '已修改网站和 App，更清楚展示总价、退款/仿冒品处理及评价政策。',
        monitoring: 'CPC Network continues to monitor; one delivery-fee concern remained unresolved.',
        unresolved: '页面称 Vinted 未同意在购买早期披露配送费或最低配送费的请求。',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面记录 Vinted 对 total price、buyer protection fee、退款和评价政策的修改，并保留未解决的配送费披露问题。'),
    ],
    timeline: [
      { date: '2021-12', type: 'dialogue', summary: 'CPC Network 与 Vinted 开始对话。', sourceId: marketSource.id },
      { type: 'monitoring', summary: 'Vinted 完成多项网站和 App 信息披露调整，仍需监测配送费问题。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'viagogo-cpc-2024',
    company: 'viagogo',
    businessModels: ['marketplace', 'ecommerce'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['pressure_selling', 'hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: { commitment: '2024-05-16', lastUpdate: '2024-05-16' },
    coordinatedActions: [],
    commitments: [
      {
        summary: '承诺更清楚说明转售条件、税费和配送费，并减少过度倒计时压力。',
        monitoring: 'CPC Network will actively monitor implementation.',
        unresolved: '页面称仍有配送费早期披露及活动取消/延期时消费者权利等问题待处理。',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面记录 viagogo 关于票务转售、费用透明度、倒计时消息和退款/条款的承诺。'),
    ],
    timeline: [
      { date: '2024-05-16', type: 'commitment', summary: 'viagogo factsheet 记录企业承诺与仍待解决事项。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'paypal-cpc-2024',
    company: 'PayPal',
    businessModels: ['payments'],
    jurisdictions: ['EU'],
    leadAuthority: 'Umweltbundesamt (Germany)',
    practiceTags: ['hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: { commitment: '2024-02-21', lastUpdate: '2024-05-28' },
    coordinatedActions: [],
    commitments: [
      {
        summary: '承诺修改消费者协议，使条款更透明、更易理解，并移除要求消费者自行核查法律合规性的表述。',
        implementationDate: '2024-05-28',
        monitoring: 'CPC will actively monitor implementation.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面记录 PayPal 对消费者协议条款的多项澄清和删除，并列出政策更新与生效日期。'),
    ],
    timeline: [
      { date: '2024-02-21', type: 'commitment', summary: 'PayPal 通过 Policy Update 通知用户相关条款变化。', sourceId: marketSource.id },
      { date: '2024-05-28', type: 'monitoring', summary: '承诺条款正式生效，CPC 进入监测。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'shopify-cpc',
    company: 'Shopify',
    businessModels: ['ecommerce', 'marketplace'],
    jurisdictions: ['EU'],
    leadAuthority: 'Belgian Directorate General for Economic Inspection',
    practiceTags: ['hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: {},
    coordinatedActions: [],
    commitments: [
      {
        summary: '同意建立供消费者机构使用的 notice-and-action 流程，并修改模板推动商家更透明。',
        monitoring: 'CPC Network monitors compliance-by-design changes.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面将 Shopify 的改变描述为面向消费者机构的快速 notice-and-action 流程和 compliance by design。'),
    ],
    timeline: [
      { type: 'commitment', summary: 'Shopify 在 CPC 对话后同意改进通知和行动流程。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'amazon-prime-cpc',
    company: 'Amazon Prime',
    aliases: ['Amazon'],
    businessModels: ['subscription', 'app'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'European Commission / national consumer authorities',
    practiceTags: ['subscription_renewal_cancellation', 'dark_patterns', 'hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: {},
    coordinatedActions: [],
    commitments: [
      {
        summary: '承诺让 EU/EEA 消费者通过醒目的取消按钮，两步取消 Amazon Prime。',
        monitoring: 'Implementation is monitored by the Commission and national authorities.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面记录 Amazon Prime 将取消路径改为 prominent and clear cancel button，并与订阅取消规则相关。'),
    ],
    timeline: [
      { type: 'commitment', summary: 'Amazon 承诺把 Prime 取消流程与 EU 消费者规则对齐。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'tinder-cpc-2022',
    company: 'Tinder',
    aliases: ['Tinder premium services'],
    businessModels: ['app', 'subscription'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'Swedish Consumer Agency / Netherlands Authority for Consumers and Markets',
    practiceTags: ['misleading_discounts', 'personalised_pricing', 'hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: { firstAction: '2022-07', lastUpdate: '2024-04', commitment: '2024-04' },
    coordinatedActions: [],
    commitments: [
      {
        summary: '承诺清楚说明高级服务折扣通过自动化方式个性化，并解释影响折扣的标准。',
        implementationDate: '2024-04-15',
        monitoring: 'CPC Network will actively monitor implementation.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(marketSource, '页面记录 Tinder 关于个性化定价、基于年龄的价格差异和个性化折扣告知的承诺。'),
    ],
    timeline: [
      { date: '2022-07', type: 'dialogue', summary: 'CPC Network 与 Tinder 开始对话。', sourceId: marketSource.id },
      { date: '2024-04', type: 'commitment', summary: 'Tinder 承诺在期限前说明个性化折扣和标准。', sourceId: marketSource.id },
    ],
  },
  {
    id: 'recurring-payments-cpc',
    company: 'Mastercard · Visa · American Express',
    aliases: ['Recurring subscription payments'],
    businessModels: ['payments', 'subscription'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'Danish Consumer Ombudsman',
    practiceTags: ['subscription_renewal_cancellation', 'hidden_information', 'dark_patterns'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: {},
    coordinatedActions: [],
    commitments: [
      {
        summary: 'CPC Network 要求支付卡组织调整规则，确保消费者在订阅前清楚得知 recurring payments。',
        monitoring: 'CPC Network will actively monitor implementation.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(trapsSource, '页面称支付卡组织被要求确保商家在订阅前清楚说明 recurring payments；该问题涉及 PSD 与 UCPD。'),
    ],
    timeline: [
      { type: 'commitment', summary: '支付卡组织被要求调整 recurring payment 规则。', sourceId: trapsSource.id },
    ],
  },
  {
    id: 'meta-consumer-practices-2024',
    company: 'Meta',
    aliases: ['Facebook', 'Instagram'],
    businessModels: ['advertising', 'app'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['advertising', 'hidden_information', 'dark_patterns'],
    status: 'investigating',
    review: reviewMetadata('high'),
    dates: { firstAction: '2024-07-22', lastUpdate: '2024-07-22' },
    coordinatedActions: [
      {
        summary: 'CPC Network launched a coordinated action focused on Meta practices under EU consumer law.',
        status: 'ongoing',
        coordinator: 'European Commission / CPC Network',
      },
    ],
    commitments: [],
    finalPenalties: [],
    evidence: [
      evidence(socialSource, '页面将 Meta 的消费者法行动与 DSA、DMA 和 GDPR 轨迹区分，并说明行动关注相关消费者做法。'),
    ],
    timeline: [
      { date: '2024-07-22', type: 'action', summary: 'CPC Network 针对 Meta 的消费者法实践发起协调行动。', sourceId: socialSource.id },
    ],
  },
  {
    id: 'tiktok-advertising-cpc',
    company: 'TikTok',
    businessModels: ['advertising', 'app'],
    jurisdictions: ['EU/EEA'],
    leadAuthority: 'CPC Network',
    practiceTags: ['advertising', 'hidden_information'],
    status: 'commitment_monitoring',
    review: reviewMetadata('medium'),
    dates: {},
    coordinatedActions: [],
    commitments: [
      {
        summary: '承诺使其广告和消费者保护实践与 EU 规则保持一致。',
        monitoring: 'CPC Network monitors alignment with EU rules.',
      },
    ],
    finalPenalties: [],
    evidence: [
      evidence(socialSource, '页面称 TikTok 在与欧委会和国家消费者机构对话后，承诺调整广告和消费者保护实践。'),
    ],
    timeline: [
      { type: 'commitment', summary: 'TikTok 承诺对齐 EU 广告和消费者保护规则。', sourceId: socialSource.id },
    ],
  },
]
