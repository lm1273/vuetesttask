<script setup lang="ts">
import { ref } from 'vue'
import { campaigns } from './data/campaigns'
import CampaignList from './components/CampaignList.vue'
import FunnelView from './components/FunnelView.vue'
import { computed } from 'vue'

const selectedId = ref(campaigns[0]?.id ?? '')
const selected = computed(() => campaigns.find((c) => c.id === selectedId.value) ?? campaigns[0])
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="mx-auto max-w-5xl p-6">
      <h1 class="mb-6 text-lg font-semibold">Popup Funnel Analytics</h1>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <aside>
          <CampaignList
            :campaigns="campaigns"
            :selected-id="selectedId"
            @select="selectedId = $event"
          />
        </aside>
        <main class="rounded-xl border border-gray-200 bg-white p-5">
          <FunnelView v-if="selected" :campaign="selected" />
        </main>
      </div>
    </div>
  </div>
</template>
