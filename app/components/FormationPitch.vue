<script setup lang="ts">
import type { LineupPlayer, Match } from "~/types/match";
import type { PlayerMarks } from "~/utils/lineup";
import { formationLines } from "~/utils/lineup";

const props = defineProps<{
  match: Match;
  marks: Map<string, PlayerMarks>;
}>();

// Home attacks downwards from the top half, away upwards from the bottom.
const halves = computed(() => {
  const home = formationLines(
    props.match.lineups.home,
    props.match.formations?.home,
  );
  const away = formationLines(
    props.match.lineups.away,
    props.match.formations?.away,
  );
  return home && away ? { home, away: away.toReversed() } : null;
});

const initials = (p: LineupPlayer) => p.number || "";
</script>

<template>
  <div v-if="halves" class="px-3 pb-3">
    <p class="mb-2 flex justify-between text-xs font-semibold uppercase">
      <span>{{ match.home.name }}</span>
      <span class="font-score">{{ match.formations?.home }}</span>
    </p>
    <div
      class="pitch relative overflow-hidden rounded-lg text-white"
      aria-label="Formasi di lapangan"
      role="img"
    >
      <!-- Markings: halfway line, centre circle, both boxes. -->
      <div class="absolute inset-x-0 top-1/2 border-t border-white/40" />
      <div
        class="absolute top-1/2 left-1/2 size-24 -translate-1/2 rounded-full border border-white/40"
      />
      <div
        class="absolute top-0 left-1/2 h-16 w-2/5 -translate-x-1/2 border border-t-0 border-white/40"
      />
      <div
        class="absolute bottom-0 left-1/2 h-16 w-2/5 -translate-x-1/2 border border-b-0 border-white/40"
      />

      <div
        v-for="side in ['home', 'away'] as const"
        :key="side"
        class="relative flex h-[340px] flex-col justify-around py-3 sm:h-[400px]"
      >
        <div
          v-for="(line, i) in halves[side]"
          :key="i"
          class="flex justify-around"
        >
          <div
            v-for="player in line"
            :key="player.playerId ?? player.name"
            class="flex w-16 flex-col items-center gap-0.5 text-center sm:w-20"
          >
            <div class="relative">
              <img
                v-if="player.photo"
                :src="player.photo"
                alt=""
                aria-hidden="true"
                loading="lazy"
                class="size-9 rounded-full border-2 bg-white object-cover"
                :class="side === 'home' ? 'border-sky-300' : 'border-rose-300'"
              />
              <span
                v-else
                class="grid size-9 place-items-center rounded-full border-2 text-sm font-bold font-score"
                :class="
                  side === 'home'
                    ? 'border-sky-300 bg-sky-700'
                    : 'border-rose-300 bg-rose-700'
                "
                >{{ initials(player) }}</span
              >
              <RatingBadge
                v-if="player.rating"
                :rating="player.rating"
                class="absolute -top-1.5 -right-4 h-4 px-0.5 text-[10px]"
              />
            </div>
            <NuxtLink
              v-if="player.playerId"
              :to="`/pemain/${player.playerId}`"
              class="w-full truncate text-[11px] leading-tight font-semibold hover:underline"
              >{{ player.number }} {{ player.name }}</NuxtLink
            >
            <span v-else class="w-full truncate text-[11px] font-semibold"
              >{{ player.number }} {{ player.name }}</span
            >
            <PlayerMarkIcons
              :marks="marks.get(player.name)"
              light
              class="rounded bg-black/40 px-0.5 empty:hidden"
            />
          </div>
        </div>
      </div>
    </div>
    <p class="mt-2 flex justify-between text-xs font-semibold uppercase">
      <span>{{ match.away.name }}</span>
      <span class="font-score">{{ match.formations?.away }}</span>
    </p>
  </div>
</template>

<style scoped>
/* Mown stripes; fixed green in both themes, like a real pitch. */
.pitch {
  background: repeating-linear-gradient(#2f7d3b 0 40px, #2a7236 40px 80px);
}
</style>
