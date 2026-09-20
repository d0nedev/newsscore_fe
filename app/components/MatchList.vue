<script setup lang="ts">
import type { Match } from "~/types/match";

defineProps<{
  title?: string;
  subtitle?: string;
  leagueId?: string;
  matches: Match[];
}>();

const open = ref(true);
const starred = ref(false);
</script>

<template>
  <section class="overflow-hidden rounded bg-white shadow-sm">
    <div
      v-if="title"
      class="flex items-center gap-2 border-b bg-sky-50 px-3 py-2 text-sm"
    >
      <button
        type="button"
        class="text-slate-400 hover:text-amber-500"
        :class="starred ? 'text-amber-500' : ''"
        :aria-pressed="starred"
        :aria-label="`Ikuti ${title}`"
        @click="starred = !starred"
      >
        &#9733;
      </button>
      <p class="min-w-0 flex-1 truncate font-semibold">
        <span v-if="subtitle" class="text-slate-500 uppercase"
          >{{ subtitle }}:</span
        >
        {{ title }}
      </p>
      <NuxtLink
        v-if="leagueId"
        :to="`/sepak-bola/${leagueId}`"
        class="text-xs text-slate-500 underline hover:text-slate-900"
        >Klasemen</NuxtLink
      >
      <button
        type="button"
        class="px-1 text-slate-400"
        :aria-expanded="open"
        :aria-label="open ? 'Sembunyikan' : 'Tampilkan'"
        @click="open = !open"
      >
        {{ open ? "▴" : "▾" }}
      </button>
    </div>
    <p v-if="matches.length === 0" class="p-4 text-sm text-slate-500">
      Belum ada pertandingan.
    </p>
    <ul v-else-if="open" class="divide-y">
      <li v-for="match in matches" :key="match.id">
        <MatchRow :match="match" />
      </li>
    </ul>
  </section>
</template>
