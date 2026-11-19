import { describe, expect, it } from 'vitest'
import { cases } from '../data/cases'
import { casesToCsv } from './export'

describe('case CSV export', () => {
  it('exports a source-aware case header and row', () => {
    const csv = casesToCsv([cases[0]])

    expect(csv.split('\n')[0]).toBe('案件 ID,企业 / 平台,业务模式,重点主题,状态,复核优先级,负责人,下次复核,最近更新,结果记录,来源')
    expect(csv).toContain('shein-cpc-2025,SHEIN')
    expect(csv).toContain('Market places and digital services')
  })

  it('escapes commas, quotes, and line breaks in case fields', () => {
    const csv = casesToCsv([{ ...cases[0], company: 'Acme, "EU"\nMarketplace' }])

    expect(csv).toContain('"Acme, ""EU""\nMarketplace"')
  })
})
