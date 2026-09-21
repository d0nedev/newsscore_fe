<script setup lang="ts">
import { PlayCircle } from "@lucide/vue";
import type { Match } from "~/types/match";

const props = defineProps<{ match: Match; league?: string }>();

const goals = (side: "home" | "away") =>
  props.match.events.filter(
    (event) => event.type === "goal" && event.team === side,
  );
</script>

<template>
  <section
    class="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white"
  >
    <div class="mb-4 flex items-center justify-between text-xs">
      <Badge v-if="match.status === 'live'" class="rounded-sm font-bold">
        LIVE SEKARANG
      </Badge>
      <span v-else class="text-white/60">{{ match.date }}</span>
      <span class="text-white/60">
        {{ league }}<template v-if="match.round"> · {{ match.round }}</template>
      </span>
    </div>

    <div class="grid grid-cols-3 items-center gap-4">
      <div
        v-for="side in ['home', 'away'] as const"
        :key="side"
        class="text-center"
        :class="side === 'home' ? 'order-1' : 'order-3'"
      >
        <span
          class="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-white/10 text-base font-bold"
          aria-hidden="true"
          >{{ match[side].badge }}</span
        >
        <h2 class="text-xl font-bold sm:text-2xl">{{ match[side].name }}</h2>
        <ul class="mt-2 space-y-0.5 text-xs text-white/60">
          <li v-for="(goal, i) in goals(side)" :key="i">
            {{ goal.minute }}' {{ goal.player }}
          </li>
        </ul>
      </div>

      <div class="order-2 text-center">
        <p class="flex items-center justify-center gap-2">
          <span
            v-for="(value, i) in match.score ?? ['-', '-']"
            :key="i"
            class="grid size-12 place-items-center rounded-md bg-white/10 text-2xl font-bold tabular-nums"
            >{{ value }}</span
          >
        </p>
        <p class="mt-2 text-sm font-semibold">
          {{ match.status === "finished" ? "Selesai" : match.time }}
        </p>
        <p v-if="match.halfTime" class="text-xs text-white/60">
          Babak 1: {{ match.halfTime[0] }} - {{ match.halfTime[1] }}
        </p>
      </div>
    </div>

    <Button as-child class="mx-auto mt-5 flex w-fit gap-2 rounded-full">
      <NuxtLink :to="`/pertandingan/${match.id}`">
        <PlayCircle /> Pusat Pertandingan
      </NuxtLink>
    </Button>
  </section>
</template>
