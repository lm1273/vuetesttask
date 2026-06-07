import { describe, it, expect } from 'vitest'
import { computeFunnel, findProblemStepIndex } from './funnel'
import type { Campaign, ComputedStep } from '../types/types'

const campA: Campaign = {
  id: 'camp_001', name: 'Welcome', device: 'desktop',
  steps: [
    { id: 's1', name: 'Teaser', type: 'teaser', views: 10000, proceeds: 3200, description: '' },
    { id: 's2', name: 'Email', type: 'email', views: 3200, proceeds: 850, description: '' },
    { id: 's3', name: 'Success', type: 'success', views: 850, proceeds: 820, description: '' },
  ],
}

describe('computeFunnel', () => {
  it('számolja a lépés-szintű mezőket', () => {
    const f = computeFunnel(campA)
    expect(f.steps[0].stepConversion).toBeCloseTo(0.32, 4)
    expect(f.steps[0].droppedUsers).toBe(6800)
    expect(f.steps[0].reachedShare).toBeCloseTo(1, 4)
    expect(f.steps[1].stepConversion).toBeCloseTo(0.265625, 4)
    expect(f.steps[1].droppedUsers).toBe(2350)
    expect(f.steps[1].reachedShare).toBeCloseTo(0.32, 4)
  })

  it('számolja a kampány-szintű mezőket', () => {
    const f = computeFunnel(campA)
    expect(f.overallConversion).toBeCloseTo(0.082, 4)
    expect(f.entered).toBe(10000)
    expect(f.completed).toBe(820)
  })

  it('a legrosszabb lépés-szintű konverziójú lépést jelöli problémásnak', () => {
    const f = computeFunnel(campA)
    expect(f.problemStepIndex).toBe(1)
    expect(f.steps[1].isProblem).toBe(true)
    expect(f.steps[0].isProblem).toBe(false)
  })

  it('nem oszt nullával, ha egy lépésnek 0 a views-a', () => {
    const f = computeFunnel({
      id: 'x', name: 'x', device: 'desktop',
      steps: [{ id: 's1', name: 'a', type: 'teaser', views: 0, proceeds: 0, description: '' }],
    })
    expect(f.steps[0].stepConversion).toBe(0)
    expect(f.overallConversion).toBe(0)
  })
})

describe('findProblemStepIndex', () => {
  const mk = (conv: number, dropped: number): ComputedStep => ({
    id: 'x', name: 'x', type: 't', views: 100, proceeds: 0, description: '',
    stepConversion: conv, droppedUsers: dropped, dropoffRate: 1 - conv, reachedShare: 1, isProblem: false,
  })

  it('döntetlennél a több vesztett embert választja', () => {
    expect(findProblemStepIndex([mk(0.3, 10), mk(0.3, 50), mk(0.9, 5)])).toBe(1)
  })
})
