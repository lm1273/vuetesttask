<script setup lang="ts">
// Statikus jelmagyarázat – nincs prop, csak a fogalmakat magyarázza el köznyelven.
</script>

<template>
  <details class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm" open>
    <summary class="cursor-pointer font-medium text-gray-700">Mit jelentenek ezek a számok?</summary>
    <ul class="mt-3 space-y-2 text-gray-600">
      <li class="flex items-start gap-2">
        <span class="mt-1 inline-block h-3 w-5 shrink-0 rounded bg-blue-500"></span>
        <span><strong>Sáv</strong> = egy lépés. A szélessége azt mutatja, a kezdő látogatók hány %-a jutott el idáig; a benne lévő szám a lépést megtekintők száma.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="mt-1 inline-block h-3 w-5 shrink-0 rounded bg-red-500"></span>
        <span><strong>Piros sáv</strong> = a leggyengébb lépés: itt a legkisebb arányban lépnek tovább az emberek. Általában ide érdemes először nyúlni.</span>
      </li>
      <li><strong>„X% lép tovább”</strong> – az adott lépést látók közül ennyien mentek a következő lépésre.</li>
      <li><strong>„↓ N ember elveszik”</strong> – ennyien álltak meg ennél a lépésnél, és nem mentek tovább.</li>
      <li><strong>Össz. konverzió</strong> – a teljes folyamatot végigvivők aránya: a belépőkből hányan jutottak el a végéig.</li>
    </ul>
  </details>
</template>
