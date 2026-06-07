<script setup lang="ts">
import type { Campaign } from '../types/types'
import { computeFunnel } from '../utils/funnel'
import { formatPercent } from '../utils/format'

defineProps<{ campaigns: Campaign[]; selectedId: string }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()

// Ugyanazt a funnel-matekot használjuk, mint mindenhol — egyetlen igazságforrás.
function overall(c: Campaign): number {
  return computeFunnel(c).overallConversion
}
</script>

<template>
  <nav class="space-y-2">
    <h2 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Kampányok</h2>
    <button
      v-for="c in campaigns"
      :key="c.id"
      @click="emit('select', c.id)"
      class="w-full rounded-lg border p-3 text-left transition"
      :class="c.id === selectedId
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 bg-white hover:border-gray-300'"
    >
      <div class="font-medium text-gray-900">{{ c.name }}</div>
      <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <span class="rounded bg-gray-100 px-1.5 py-0.5 capitalize">{{ c.device }}</span>
        <span>Össz. konverzió: {{ formatPercent(overall(c), 1) }}</span>
      </div>
    </button>
  </nav>
</template>
