<script setup lang="ts">
import { ArrowDown, ArrowUp } from "@lucide/vue";
import type { PlayerMarks } from "~/utils/lineup";

// `light` for the dark pitch, where the usual red and green are too dim.
defineProps<{ marks?: PlayerMarks; light?: boolean }>();
</script>

<template>
  <span v-if="marks" class="inline-flex items-center gap-0.5">
    <MatchEventIcon
      v-for="n in marks.goals"
      :key="`g${n}`"
      type="goal"
      class="size-3.5"
    />
    <MatchEventIcon v-if="marks.yellow" type="yellow" class="h-3.5 w-2.5" />
    <MatchEventIcon v-if="marks.red" type="red" class="h-3.5 w-2.5" />
    <span
      v-if="marks.subOff"
      class="inline-flex items-center text-[10px] font-score"
      :class="light ? 'text-red-300' : 'text-destructive'"
      :aria-label="`Keluar ${marks.subOff}`"
      ><ArrowDown class="size-3" />{{ marks.subOff }}</span
    >
    <span
      v-if="marks.subOn"
      class="inline-flex items-center text-[10px] font-score"
      :class="light ? 'text-green-300' : 'text-win'"
      :aria-label="`Masuk ${marks.subOn}`"
      ><ArrowUp class="size-3" />{{ marks.subOn }}</span
    >
  </span>
</template>
