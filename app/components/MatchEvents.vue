<script setup lang="ts">
import type { Match } from "~/types/match";
import { eventPeriods } from "~/utils/match-periods";

const props = defineProps<{ match: Match }>();

const halves = computed(() => eventPeriods(props.match.events));
</script>

<template>
  <div class="pb-2">
    <p
      v-if="match.events.length === 0"
      class="text-muted-foreground px-4 pb-4 text-sm"
    >
      Belum ada kejadian.
    </p>

    <section v-for="half in halves" :key="half.label" class="pb-2">
      <p
        class="bg-muted text-muted-foreground mb-1 flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase"
      >
        <span>{{ half.label }}</span>
        <span class="text-foreground font-score">{{ half.score }}</span>
      </p>
      <ul class="space-y-1">
        <MatchEventRow
          v-for="(row, i) in half.rows"
          :key="i"
          :event="row.event"
          :score="row.score"
        />
      </ul>
    </section>
  </div>
</template>
