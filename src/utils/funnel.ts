import type { Campaign, ComputedFunnel, ComputedStep } from '../types/types'

// Védett osztás: ha a nevező 0, ne NaN/Infinity legyen, hanem 0.
function safeRatio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0
}

// A "problémás lépés" = a legkisebb lépés-szintű konverziójú lépés.
// Döntetlennél a több embert vesztő lépés nyer (nagyobb hatás).
export function findProblemStepIndex(steps: ComputedStep[]): number {
  if (steps.length === 0) return -1
  let worst = 0
  for (let i = 1; i < steps.length; i++) {
    const s = steps[i]
    const w = steps[worst]
    if (
      s.stepConversion < w.stepConversion ||
      (s.stepConversion === w.stepConversion && s.droppedUsers > w.droppedUsers)
    ) {
      worst = i
    }
  }
  return worst
}

// A nyers kampányt dúsított, megjelenítésre kész funnellé alakítja.
export function computeFunnel(campaign: Campaign): ComputedFunnel {
  const steps = campaign.steps
  const firstViews = steps[0]?.views ?? 0
  const last = steps[steps.length - 1]

  const computedSteps: ComputedStep[] = steps.map((step) => {
    const stepConversion = safeRatio(step.proceeds, step.views)
    return {
      ...step,
      stepConversion,
      droppedUsers: step.views - step.proceeds,
      dropoffRate: 1 - stepConversion,
      reachedShare: safeRatio(step.views, firstViews),
      isProblem: false,
    }
  })

  const problemStepIndex = findProblemStepIndex(computedSteps)
  if (problemStepIndex >= 0) computedSteps[problemStepIndex].isProblem = true

  return {
    id: campaign.id,
    name: campaign.name,
    device: campaign.device,
    steps: computedSteps,
    overallConversion: safeRatio(last?.proceeds ?? 0, firstViews),
    entered: firstViews,
    completed: last?.proceeds ?? 0,
    problemStepIndex,
  }
}
