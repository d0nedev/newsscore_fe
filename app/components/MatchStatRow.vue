<script setup lang="ts">
import type { MatchStat } from "~/types/match";

const props = defineProps<{ stat: MatchStat }>();

const value = (side: "home" | "away") =>
  props.stat.percent ? `${props.stat[side]}%` : String(props.stat[side]);
</script>

<template>
  <li class="px-3 py-3">
    <p class="flex items-center justify-between text-sm">
      <span class="w-12 font-semibold tabular-nums">{{ value("home") }}</span>
      <span class="text-sm font-bold">{{ stat.label }}</span>
      <span class="w-12 text-right font-semibold tabular-nums">{{
        value("away")
      }}</span>
    </p>
    <StatShareBar :home="stat.home" :away="stat.away" class="mt-1" />
  </li>
</template>
