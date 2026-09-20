<script setup lang="ts">
import type { MatchStat } from "~/types/match";

const props = defineProps<{ stats: MatchStat[] }>();

// Bar width is each side's share of the pair, so both bars always fill the row.
const share = (stat: MatchStat) => {
  const total = stat.home + stat.away;
  return total === 0 ? 50 : Math.round((stat.home / total) * 100);
};

const value = (stat: MatchStat, side: "home" | "away") =>
  stat.percent ? `${stat[side]}%` : String(stat[side]);

const rows = computed(() =>
  props.stats.map((stat) => ({ stat, homeShare: share(stat) })),
);
</script>

<template>
  <ul class="divide-y">
    <li v-for="{ stat, homeShare } in rows" :key="stat.label" class="px-3 py-2">
      <p class="flex items-center justify-between text-sm">
        <span class="font-medium tabular-nums">{{ value(stat, "home") }}</span>
        <span class="text-slate-500">{{ stat.label }}</span>
        <span class="font-medium tabular-nums">{{ value(stat, "away") }}</span>
      </p>
      <p class="mt-1 flex h-1.5 overflow-hidden rounded bg-slate-200">
        <span class="bg-emerald-500" :style="{ width: `${homeShare}%` }" />
        <span class="bg-slate-500" :style="{ width: `${100 - homeShare}%` }" />
      </p>
    </li>
  </ul>
</template>
