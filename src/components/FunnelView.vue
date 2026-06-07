<script setup lang="ts">
import { computed } from 'vue'
import type { Campaign } from '../types/types'
import { computeFunnel } from '../utils/funnel'
import { generateInsights } from '../utils/insights'
import { formatPercent, formatNumber } from '../utils/format'
import FunnelStep from './FunnelStep.vue'
import InsightsPanel from './InsightsPanel.vue'
import FunnelLegend from './FunnelLegend.vue'

const props = defineProps<{ campaign: Campaign }>()

const funnel = computed(() => computeFunnel(props.campaign))
const insights = computed(() => generateInsights(funnel.value))
const problem = computed(() => funnel.value.steps[funnel.value.problemStepIndex])
</script>

<template>
  <section>
    <header class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ funnel.name }}</h1>
      <span class="text-sm capitalize text-gray-500">{{ funnel.device }}</span>
    </header>

    <!-- A kötelező "emeld ki a legnagyobb drop-offot" rész, egy szem-megakasztó sávban -->
    <div v-if="problem" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      ⚠ <strong>Legnagyobb drop-off:</strong> {{ problem.name }} —
      csak {{ formatPercent(problem.stepConversion) }} lép tovább,
      {{ formatNumber(problem.droppedUsers) }} ember elveszik.
    </div>

    <div class="mb-6 grid grid-cols-3 gap-4">
      <div class="rounded-lg border border-gray-200 p-3">
        <div class="text-xs text-gray-500">Össz. konverzió</div>
        <div class="text-xl font-bold text-gray-900">{{ formatPercent(funnel.overallConversion, 1) }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 p-3">
        <div class="text-xs text-gray-500">Belépők</div>
        <div class="text-xl font-bold text-gray-900">{{ formatNumber(funnel.entered) }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 p-3">
        <div class="text-xs text-gray-500">Befejezők</div>
        <div class="text-xl font-bold text-gray-900">{{ formatNumber(funnel.completed) }}</div>
      </div>
    </div>
    <FunnelLegend />

    <div class="mb-6">
      <FunnelStep
        v-for="(step, i) in funnel.steps"
        :key="step.id"
        :step="step"
        :is-last="i === funnel.steps.length - 1"
      />
    </div>

    <InsightsPanel :insights="insights" />
  </section>
</template>
