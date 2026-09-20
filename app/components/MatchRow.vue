<script setup lang="ts">
import type { Match } from "~/types/match";

const props = defineProps<{ match: Match }>();

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
</script>

<template>
  <div class="flex items-center gap-2 pr-3 text-sm hover:bg-slate-50">
    <button
      type="button"
      class="pl-3 text-slate-300 hover:text-amber-500"
      :class="starred ? 'text-amber-500' : ''"
      :aria-pressed="starred"
      :aria-label="`Ikuti ${match.home.name} - ${match.away.name}`"
      @click="starred = !starred"
    >
      &#9733;
    </button>

    <NuxtLink
      :to="`/pertandingan/${match.id}`"
      class="flex min-w-0 flex-1 items-center gap-3 py-2"
    >
      <span
        class="w-14 shrink-0 text-xs"
        :class="match.status === 'live' ? 'text-red-600' : 'text-slate-500'"
      >
        {{ status }}
      </span>

      <span class="min-w-0 flex-1 space-y-0.5">
        <span
          v-for="side in ['home', 'away'] as const"
          :key="side"
          class="flex items-center gap-2"
          :class="
            winner === side ? 'font-semibold' : winner ? 'text-slate-500' : ''
          "
        >
          <TeamBadge :badge="match[side].badge" />
          <span class="truncate">{{ match[side].name }}</span>
        </span>
      </span>

      <span
        class="w-6 shrink-0 space-y-0.5 text-right font-semibold tabular-nums"
        :class="match.status === 'live' ? 'text-red-600' : ''"
      >
        <template v-if="match.score">
          <span class="block">{{ match.score[0] }}</span>
          <span class="block">{{ match.score[1] }}</span>
        </template>
        <template v-else>
          <span class="block text-slate-400">-</span>
          <span class="block text-slate-400">-</span>
        </template>
      </span>
    </NuxtLink>
  </div>
</template>
