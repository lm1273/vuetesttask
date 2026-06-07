import { describe, it, expect } from 'vitest'
import { computeFunnel } from './funnel'
import { generateInsights } from './insights'
import type { Campaign } from '../types/types'

const camp001: Campaign = {
  id: 'camp_001', name: 'Welcome', device: 'desktop',
  steps: [
    { id: 's1', name: 'Teaser', type: 'teaser', views: 10000, proceeds: 3200, description: '' },
    { id: 's2', name: 'Email', type: 'email', views: 3200, proceeds: 850, description: '' },
    { id: 's3', name: 'Success', type: 'success', views: 850, proceeds: 820, description: '' },
  ],
}

const camp003: Campaign = {
  id: 'camp_003', name: 'Mobile', device: 'mobile',
  steps: [
    { id: 's1', name: 'Teaser', type: 'teaser', views: 12000, proceeds: 1800, description: '' },
    { id: 's2', name: 'Email+pref', type: 'email', views: 1800, proceeds: 300, description: '' },
    { id: 's3', name: 'Confirm', type: 'success', views: 300, proceeds: 260, description: '' },
  ],
}

describe('generateInsights', () => {
  it('mindig ad egy problem-step javaslatot, és legfeljebb hármat', () => {
    const list = generateInsights(computeFunnel(camp001))
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list.length).toBeLessThanOrEqual(3)
    expect(list.some((i) => i.id === 'problem-step')).toBe(true)
  })

  it('camp_001-nél jelzi a volumen vs. arány feszültséget (a step1 veszti a legtöbb embert)', () => {
    const list = generateInsights(computeFunnel(camp001))
    expect(list.some((i) => i.id === 'volume-vs-rate')).toBe(true)
  })

  it('camp_003-nál jelzi az email-súrlódást (17% < küszöb), mert ott nem az email a problémás lépés', () => {
    const list = generateInsights(computeFunnel(camp003))
    expect(list.some((i) => i.id === 'email-friction')).toBe(true)
  })

  it('a magas súlyosságú javaslat előrébb van, mint az info', () => {
    const list = generateInsights(computeFunnel(camp001))
    const high = list.findIndex((i) => i.severity === 'high')
    const info = list.findIndex((i) => i.severity === 'info')
    if (high !== -1 && info !== -1) expect(high).toBeLessThan(info)
  })
})
