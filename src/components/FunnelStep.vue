<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedStep } from '../types/types'
import { formatPercent, formatNumber } from '../utils/format'

const props = defineProps<{ step: ComputedStep; isLast: boolean }>()

// A számot csak akkor írjuk a sávra (fehéren), ha elég széles hozzá.
// Keskeny sávnál a sávon KÍVÜL, sötét betűvel jelenítjük meg → mindig olvasható.
const labelInside = computed(() => props.step.reachedShare >= 0.2)
const barWidth = computed(() => Math.max(props.step.reachedShare * 100, 2) + '%')
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

    <div class="relative h-8 w-full overflow-hidden rounded-md bg-gray-100">
      <!-- Maga a színes sáv (csak vizuális, szöveg nélkül). -->
      <div
        class="h-full rounded-md"
        :class="step.isProblem ? 'bg-red-500' : 'bg-blue-500'"
        :style="{ width: barWidth }"
      ></div>

      <!-- A megtekintések száma: a sávon belül (fehér) ha fér, különben mellette (sötét). -->
      <span
        class="absolute inset-y-0 flex items-center px-2 text-xs font-semibold"
        :class="labelInside ? 'left-0 justify-end text-white' : 'text-gray-700'"
        :style="labelInside ? { width: barWidth } : { left: barWidth }"
      >
        {{ formatNumber(step.views) }}
      </span>
    </div>

    <!-- Az utolsó lépés alatt nincs drop: nincs hová tovább lépni. -->
    <p v-if="!isLast" class="mt-1 mb-3 text-xs text-red-600">
      ↓ {{ formatNumber(step.droppedUsers) }} ember elveszik ({{ formatPercent(step.dropoffRate) }})
    </p>
  </div>
</template>
