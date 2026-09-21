<script setup lang="ts">
import { ArrowLeftRight, Goal } from "@lucide/vue";
import type { Match, MatchEvent } from "~/types/match";

const props = defineProps<{ match: Match }>();

// Each goal carries the score as it stood right after it.
const withScore = computed(() => {
  let home = 0;
  let away = 0;
  return props.match.events.map((event) => {
    if (event.type === "goal") {
      if (event.team === "home") home += 1;
      else away += 1;
    }
    return { event, score: event.type === "goal" ? `${home} - ${away}` : null };
  });
});

const halves = computed(() => [
  {
    label: "Paruh pertama",
    score: props.match.halfTime
      ? `${props.match.halfTime[0]} - ${props.match.halfTime[1]}`
      : null,
    rows: withScore.value.filter((row) => row.event.minute <= 45),
  },
  {
    label: "Paruh kedua",
    score: props.match.score
      ? `${props.match.score[0]} - ${props.match.score[1]}`
      : null,
    rows: withScore.value.filter((row) => row.event.minute > 45),
  },
]);

const cardColor = (type: MatchEvent["type"]) =>
  type === "yellow" ? "bg-amber-400" : "bg-destructive";
</script>

<template>
  <div>
    <template v-for="half in halves" :key="half.label">
      <SubHeading v-if="half.rows.length">
        {{ half.label }}
        <template #trailing>
          <span class="tabular-nums">{{ half.score }}</span>
        </template>
      </SubHeading>
      <ul v-if="half.rows.length" class="py-1 text-sm">
        <li
          v-for="{ event, score } in half.rows"
          :key="`${event.minute}-${event.player}`"
          class="flex items-center gap-2 px-3 py-1"
          :class="event.team === 'away' ? 'flex-row-reverse' : ''"
        >
          <span class="text-muted-foreground w-8 shrink-0 tabular-nums">
            {{ event.minute }}'
          </span>
          <Goal v-if="event.type === 'goal'" class="size-4 shrink-0" />
          <ArrowLeftRight
            v-else-if="event.type === 'sub'"
            class="size-4 shrink-0 text-emerald-600"
          />
          <span
            v-else
            class="h-4 w-3 shrink-0 rounded-[2px]"
            :class="cardColor(event.type)"
            :aria-label="
              event.type === 'yellow' ? 'Kartu kuning' : 'Kartu merah'
            "
          />
          <span v-if="score" class="shrink-0 font-bold tabular-nums">
            {{ score }}
          </span>
          <span class="min-w-0 truncate">
            <span class="font-semibold">{{ event.player }}</span>
            <span v-if="event.assist" class="text-muted-foreground">
              ({{
                event.type === "sub" ? `keluar ${event.assist}` : event.assist
              }})
            </span>
            <span v-else-if="event.note" class="text-muted-foreground">
              {{ event.note }}
            </span>
          </span>
        </li>
      </ul>
    </template>
    <p
      v-if="match.events.length === 0"
      class="text-muted-foreground p-4 text-sm"
    >
      Belum ada kejadian.
    </p>
  </div>
</template>
