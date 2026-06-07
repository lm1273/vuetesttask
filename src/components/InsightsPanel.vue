<script setup lang="ts">
import type { Insight } from '../utils/insights'

defineProps<{ insights: Insight[] }>()

// Súlyosság szerint Tailwind-osztályok. Egy helyen bővíthető.
const styles: Record<Insight['severity'], string> = {
  high: 'border-red-200 bg-red-50',
  medium: 'border-amber-200 bg-amber-50',
  info: 'border-gray-200 bg-gray-50',
}
</script>

<template>
  <section>
    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Javaslatok</h2>
    <ul class="space-y-2">
      <li
        v-for="insight in insights"
        :key="insight.id"
        class="rounded-lg border p-3"
        :class="styles[insight.severity]"
      >
        <div class="font-medium text-gray-900">{{ insight.title }}</div>
        <p class="mt-0.5 text-sm text-gray-600">{{ insight.detail }}</p>
      </li>
    </ul>
  </section>
</template>
