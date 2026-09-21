<script setup lang="ts">
import type { MatchStat } from "~/types/match";

const props = defineProps<{ stats: MatchStat[] }>();

// Each half of the track fills from the middle outwards with that side's share.
const share = (stat: MatchStat, side: "home" | "away") => {
  const total = stat.home + stat.away;
  return total === 0 ? 50 : Math.round((stat[side] / total) * 100);
};

const value = (stat: MatchStat, side: "home" | "away") =>
  stat.percent ? `${stat[side]}%` : String(stat[side]);

const rows = computed(() =>
  props.stats.map((stat) => ({
    stat,
    home: share(stat, "home"),
    away: share(stat, "away"),
  })),
);
</script>

<template>
  <ul class="divide-y">
    <li
      v-for="{ stat, home, away } in rows"
      :key="stat.label"
      class="px-3 py-3"
    >
      <p class="flex items-center justify-between text-sm">
        <span class="w-12 font-semibold tabular-nums">{{
          value(stat, "home")
        }}</span>
        <span class="text-muted-foreground text-xs">{{ stat.label }}</span>
        <span class="w-12 text-right font-semibold tabular-nums">{{
          value(stat, "away")
        }}</span>
      </p>
      <p class="mt-1.5 flex h-1 gap-px">
        <span class="bg-muted flex flex-1 justify-end">
          <span class="bg-primary block" :style="{ width: `${home}%` }" />
        </span>
        <span class="bg-muted flex flex-1">
          <span class="block bg-slate-700" :style="{ width: `${away}%` }" />
        </span>
      </p>
    </li>
  </ul>
</template>
