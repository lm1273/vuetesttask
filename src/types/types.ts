
export interface Step {
    id: string
    name: string
    type: string
    views: number
    proceeds: number
    description: string
}

export interface ComputedStep extends Step {
    stepConversion: number // proceeds / views (0..1) az ide érkezőkből hányan léptek tovább
    droppedUsers: number   // views - proceeds abszolút vesztett emberek
    dropoffRate: number    // 1 - stepConversion
    reachedShare: number   // views / steps[0].views a sáv szélessége a nézetben
    isProblem: boolean      // ez-e a kijelölt problémás lépés
}

  export interface ComputedFunnel {
    id: string
    name: string
    device: string
    steps: ComputedStep[]
    overallConversion: number // utolsó.proceeds / első.views
    entered: number           // első.views
    completed: number         // utolsó.proceeds
    problemStepIndex: number
  }

  export interface Campaign {
    id: string
    name: string
    device: string
    steps: Step[]
  }
  