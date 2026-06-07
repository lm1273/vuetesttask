<script setup lang="ts">
import { ref } from 'vue'
import { campaigns } from './data/campaigns'
import CampaignList from './components/CampaignList.vue'

const selectedId = ref(campaigns[0]?.id ?? '')
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="mx-auto max-w-5xl p-6">
      <h1 class="mb-6 text-lg font-semibold">Popup Funnel Analytics</h1>
      <CampaignList
        :campaigns="campaigns"
        :selected-id="selectedId"
        @select="selectedId = $event"
      />
    </div>
  </div>
</template>
