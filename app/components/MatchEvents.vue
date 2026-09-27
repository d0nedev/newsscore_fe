<script setup lang="ts">
import type { Match, MatchEvent } from "~/types/match";

const props = defineProps<{ match: Match }>();

interface Row {
  event: MatchEvent;
  /** Score right after a goal, e.g. "1 - 0". */
  score?: string;
}

// Walk the events once, tracking the score, and split them at half-time.
// The half-time score is counted from the goals, since the API sends none.
const halves = computed(() => {
  let home = 0;
  let away = 0;
  const first: Row[] = [];
  const second: Row[] = [];
  let halfTime = "0 - 0";

  for (const event of props.match.events) {
    if (event.minute > 45 && second.length === 0) {
      halfTime = `${home} - ${away}`;
    }
    let score: string | undefined;
    if (event.type === "goal") {
      if (event.team === "home") home += 1;
      else away += 1;
      score = `${home} - ${away}`;
    }
    (event.minute <= 45 ? first : second).push({ event, score });
  }
  if (second.length === 0) halfTime = `${home} - ${away}`;

  return [
    { label: "Babak pertama", score: halfTime, rows: first },
    { label: "Babak kedua", score: `${home} - ${away}`, rows: second },
  ].filter((half) => half.rows.length > 0);
});
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
        <span class="text-foreground tabular-nums">{{ half.score }}</span>
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
