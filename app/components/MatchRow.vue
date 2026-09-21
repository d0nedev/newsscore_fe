<script setup lang="ts">
import { Star } from "@lucide/vue";
import type { Match } from "~/types/match";

const props = defineProps<{
  match: Match;
  /** When set, the row gains a M/S/K badge for this team's result. */
  perspectiveTeamId?: string;
}>();

const starred = ref(false);

// "Selesai" / minute for live / kick-off time for fixtures.
const status = computed(() =>
  props.match.status === "finished" ? "Selesai" : props.match.time,
);

const winner = computed(() => {
  const score = props.match.score;
  if (!score || props.match.status !== "finished") return null;
  if (score[0] === score[1]) return null;
  return score[0] > score[1] ? "home" : "away";
});

// Menang / Seri / Kalah, from the perspective team's point of view.
const outcome = computed(() => {
  const id = props.perspectiveTeamId;
  const score = props.match.score;
  if (!id || !score || props.match.status !== "finished") return null;
  const side =
    props.match.home.id === id
      ? "home"
      : props.match.away.id === id
        ? "away"
        : null;
  if (!side) return null;
  const [homeGoals, awayGoals] = score;
  const scored = side === "home" ? homeGoals : awayGoals;
  const conceded = side === "home" ? awayGoals : homeGoals;
  if (scored > conceded) return "W";
  if (scored === conceded) return "D";
  return "L";
});
</script>

<template>
  <div class="hover:bg-muted/60 flex items-stretch text-sm">
    <Button
      variant="ghost"
      size="icon"
      class="my-auto ml-1 size-6 shrink-0"
      :class="starred ? 'text-primary' : 'text-muted-foreground/50'"
      :aria-pressed="starred"
      :aria-label="`Ikuti ${match.home.name} - ${match.away.name}`"
      @click="starred = !starred"
    >
      <Star :fill="starred ? 'currentColor' : 'none'" />
    </Button>

    <NuxtLink
      :to="`/pertandingan/${match.id}`"
      class="flex min-w-0 flex-1 items-center gap-3 py-2 pl-2"
    >
      <span
        class="w-14 shrink-0 text-xs"
        :class="
          match.status === 'live'
            ? 'text-primary font-semibold'
            : 'text-muted-foreground'
        "
      >
        {{ status }}
      </span>

      <span class="min-w-0 flex-1 space-y-1">
        <span
          v-for="side in ['home', 'away'] as const"
          :key="side"
          class="flex items-center gap-2"
          :class="winner === side || !winner ? 'font-semibold' : ''"
        >
          <TeamBadge :badge="match[side].badge" />
          <span class="truncate">{{ match[side].name }}</span>
        </span>
      </span>
    </NuxtLink>

    <!-- Score and odds sit in their own bordered columns, like a results grid. -->
    <p
      class="grid w-16 shrink-0 content-center gap-1 border-l px-3 py-2 text-left font-bold tabular-nums"
      :class="match.status === 'live' ? 'text-primary' : ''"
    >
      <template v-if="match.score">
        <span>{{ match.score[0] }}</span>
        <span>{{ match.score[1] }}</span>
      </template>
      <template v-else>
        <span class="text-muted-foreground">-</span>
        <span class="text-muted-foreground">-</span>
      </template>
    </p>
    <p
      v-if="outcome"
      class="grid w-10 shrink-0 place-items-center border-l px-2"
    >
      <ResultBadge :result="outcome" />
    </p>
    <p
      v-else
      class="text-muted-foreground hidden w-32 shrink-0 content-center border-l px-3 text-xs sm:grid"
    >
      <span v-if="match.odds?.[0]" class="flex justify-between tabular-nums">
        <span>{{ match.odds[0].home.toFixed(2) }}</span>
        <span>{{ match.odds[0].draw.toFixed(2) }}</span>
        <span>{{ match.odds[0].away.toFixed(2) }}</span>
      </span>
    </p>
  </div>
</template>
