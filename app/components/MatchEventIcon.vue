<script setup lang="ts">
import { ArrowLeftRight, CircleX, Goal } from "@lucide/vue";
import type { MatchEvent } from "~/types/match";

defineProps<{ type: MatchEvent["type"] }>();

const labels: Record<MatchEvent["type"], string> = {
  goal: "Gol",
  missed: "Penalti gagal",
  sub: "Pergantian",
  yellow: "Kartu kuning",
  red: "Kartu merah",
};
</script>

<template>
  <Goal
    v-if="type === 'goal'"
    class="size-4 shrink-0"
    role="img"
    :aria-label="labels.goal"
  />
  <CircleX
    v-else-if="type === 'missed'"
    class="size-4 shrink-0 text-destructive"
    role="img"
    :aria-label="labels.missed"
  />
  <ArrowLeftRight
    v-else-if="type === 'sub'"
    class="size-4 shrink-0 text-win"
    role="img"
    :aria-label="labels.sub"
  />
  <span
    v-else
    class="h-4 w-3 shrink-0 rounded-[2px]"
    :class="type === 'yellow' ? 'bg-amber-400' : 'bg-destructive'"
    role="img"
    :aria-label="labels[type]"
  />
</template>
