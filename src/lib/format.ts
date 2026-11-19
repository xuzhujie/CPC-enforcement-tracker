import type { BusinessModel, CaseStatus, OutcomeType, PracticeTag, ReviewPriority } from '../types'

export const practiceLabels: Record<PracticeTag, string> = {
  dark_patterns: '暗黑模式',
  subscription_renewal_cancellation: '续订与取消',
  misleading_discounts: '误导折扣',
  reviews_ratings: '评价与评分',
  advertising: '广告',
  pressure_selling: '压力销售',
  hidden_information: '隐藏信息',
  geo_blocking: '地域限制',
  personalised_pricing: '个性化定价',
  seller_transparency: '卖家透明度',
}

export const businessModelLabels: Record<BusinessModel, string> = {
  app: 'App / 数字服务',
  ecommerce: '电商',
  marketplace: '平台 / 市场',
  subscription: '订阅',
  payments: '支付',
  advertising: '广告',
}

export const statusLabels: Record<CaseStatus, string> = {
  investigating: '调查中',
  ongoing: '推进中',
  commitment_monitoring: '承诺监测',
  closed: '已结束',
  enforcement_possible: '可能执法',
  unknown: '状态未披露',
}

export const reviewPriorityLabels: Record<ReviewPriority, string> = {
  critical: '紧急',
  high: '高优先级',
  medium: '常规',
  low: '低优先级',
}

export const outcomeLabels: Record<OutcomeType, string> = {
  coordinated_action: '协调行动',
  commitment: '企业承诺',
  final_penalty: '最终罚款',
}

export const outcomeDescriptions: Record<OutcomeType, string> = {
  coordinated_action: '公开来源中的协调调查/行动轨迹',
  commitment: '企业承诺或整改措施记录',
  final_penalty: '公开来源中的最终罚款记录',
}

export function formatDate(value?: string): string {
  if (!value) return '未披露'
  const monthOnly = /^(\d{4})-(\d{2})$/.exec(value)
  if (monthOnly) return `${monthOnly[1]}年${Number(monthOnly[2])}月`
  if (/^\d{4}$/.test(value)) return `${value}年`
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '未披露'
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export function formatAmount(amount?: number, currency = 'EUR'): string {
  if (typeof amount !== 'number') return '金额未披露'
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatDateRange(value?: string): string {
  return value ? formatDate(value) : '未披露'
}
