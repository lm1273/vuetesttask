import type { ComputedFunnel, ComputedStep } from '../types/types'
import { formatPercent, formatNumber } from './format'

export interface Insight {
  id: string
  severity: 'high' | 'medium' | 'info'
  title: string
  detail: string
}

// Küszöbök egy helyen, könnyen hangolható / később konfigurálható.
const EMAIL_THRESHOLD = 0.3
const TEASER_THRESHOLD = 0.25
const SUCCESS_THRESHOLD = 0.9
const SEVERITY_ORDER: Record<Insight['severity'], number> = { high: 0, medium: 1, info: 2 }

// A legtöbb embert (abszolút) vesztő lépés indexe.
function maxDropIndex(steps: ComputedStep[]): number {
  let idx = 0
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].droppedUsers > steps[idx].droppedUsers) idx = i
  }
  return idx
}

export function generateInsights(funnel: ComputedFunnel): Insight[] {
  const insights: Insight[] = []
  const { steps, problemStepIndex } = funnel
  const problem = steps[problemStepIndex]

  // 1) Problémás lépés – mindig van.
  if (problem) {
    insights.push({
      id: 'problem-step',
      severity: 'high',
      title: `Legnagyobb lemorzsolódás: ${problem.name}`,
      detail: `Az ide érkezőknek csak ${formatPercent(problem.stepConversion)}-a lép tovább (${formatNumber(problem.droppedUsers)} ember elveszik). Érdemes itt A/B-tesztelni az ajánlatot és a szöveget.`,
    })
  }

  // 2) Volumen vs. arány – ha a legtöbb embert vesztő lépés MÁS, mint a legrosszabb arányú.
  const volIdx = maxDropIndex(steps)
  if (problem && volIdx !== problemStepIndex) {
    const vol = steps[volIdx]
    insights.push({
      id: 'volume-vs-rate',
      severity: 'medium',
      title: 'Volumen vs. arány: hol javíts először?',
      detail: `A legrosszabb arány a(z) "${problem.name}" lépésnél van, de abszolút értékben a(z) "${vol.name}" veszti a legtöbb embert (${formatNumber(vol.droppedUsers)}). Priorizálj aszerint, melyik mozdítja jobban az összképet.`,
    })
  }

  // 3) Email-súrlódás – gyenge email lépés, DE csak ha nem az a problémás lépés (különben duplikálná az 1-est).
  const emailIdx = steps.findIndex(
    (s, i) => s.type === 'email' && i !== problemStepIndex && s.stepConversion < EMAIL_THRESHOLD,
  )
  if (emailIdx !== -1) {
    const email = steps[emailIdx]
    insights.push({
      id: 'email-friction',
      severity: 'high',
      title: 'Az email lépés súrlódást okoz',
      detail: `"${email.name}": ${formatPercent(email.stepConversion)} konverzió. Csökkentsd a mezők számát, kínálj Google-/social-belépést, és kerüld a nem kötelező mezőket (pl. preferenciák).`,
    })
  }

  // 4) Gyenge teaser – első/teaser lépés gyenge, és nem az a problémás lépés.
  const teaserIdx = steps.findIndex(
    (s, i) => (s.type === 'teaser' || i === 0) && i !== problemStepIndex && s.stepConversion < TEASER_THRESHOLD,
  )
  if (teaserIdx !== -1) {
    const teaser = steps[teaserIdx]
    insights.push({
      id: 'weak-teaser',
      severity: 'medium',
      title: 'A belépő ajánlat gyengén teljesít',
      detail: `"${teaser.name}": csak ${formatPercent(teaser.stepConversion)} kattint tovább. Teszteld az ajánlat erősségét (nagyobb kedvezmény?) és a targetálást/időzítést.`,
    })
  }

  // 5) Záró lépés erős – pozitív megerősítés, hogy ne ott optimalizáljon.
  const last = steps[steps.length - 1]
  if (last && last.type === 'success' && last.stepConversion > SUCCESS_THRESHOLD) {
    insights.push({
      id: 'strong-closing',
      severity: 'info',
      title: 'A záró lépés jól működik',
      detail: `"${last.name}": ${formatPercent(last.stepConversion)}. A probléma feljebb van a funnelben — ne itt optimalizálj.`,
    })
  }

  // Prioritás szerint rendezünk, és a 3 legfontosabbat adjuk vissza.
  return insights
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
    .slice(0, 3)
}
