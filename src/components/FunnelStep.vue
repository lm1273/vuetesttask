<script setup lang="ts">
import type { ComputedStep } from '../types/types'
import { formatPercent, formatNumber } from '../utils/format'

defineProps<{ step: ComputedStep; isLast: boolean }>()
</script>

<template>
  <div>
    <div class="mb-1 flex items-center justify-between text-sm">
      <span class="font-medium" :class="step.isProblem ? 'text-red-700' : 'text-gray-700'">
        {{ step.name }}
        <span v-if="step.isProblem" class="ml-1 text-xs font-semibold text-red-600">⚠ legrosszabb</span>
      </span>
      <span :class="step.isProblem ? 'font-semibold text-red-700' : 'text-gray-500'">
        {{ formatPercent(step.stepConversion) }} lép tovább
      </span>
    </div>

    <div class="h-8 w-full overflow-hidden rounded-md bg-gray-100">
      <div
        class="flex h-full items-center rounded-md px-2 text-xs font-semibold text-white"
        :class="step.isProblem ? 'bg-red-500' : 'bg-blue-500'"
        :style="{ width: Math.max(step.reachedShare * 100, 6) + '%' }"
      >
        {{ formatNumber(step.views) }}
      </div>
    </div>

    <p v-if="!isLast" class="mt-1 mb-3 text-xs text-red-600">
      ↓ {{ formatNumber(step.droppedUsers) }} ember elveszik ({{ formatPercent(step.dropoffRate) }})
    </p>
  </div>
</template>
