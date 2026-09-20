<script setup lang="ts">
import { leagues } from "~/data/leagues";
import { matches, today } from "~/data/matches";
import type { MatchStatus } from "~/types/match";

useHead({ title: "Skor Langsung" });

const filters: { label: string; value: MatchStatus | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Langsung", value: "live" },
  { label: "Selesai", value: "finished" },
  { label: "Terjadwal", value: "scheduled" },
];
const filter = ref<MatchStatus | "all">("all");
const date = ref(today);

const blocks = computed(() =>
  leagues
    .map((league) => ({
      league,
      matches: matches.filter(
        (match) =>
          match.leagueId === league.id &&
          match.date === date.value &&
          (filter.value === "all" || match.status === filter.value),
      ),
    }))
    .filter((block) => block.matches.length > 0),
);

const shown = computed(() =>
  blocks.value.reduce((total, block) => total + block.matches.length, 0),
);
</script>

<template>
  <div class="space-y-3">
    <div
      class="flex items-center gap-2 overflow-x-auto rounded bg-white px-3 py-2 shadow-sm"
    >
      <button
        v-for="item in filters"
        :key="item.value"
        type="button"
        class="rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap uppercase"
        :class="
          filter === item.value
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        "
        :aria-pressed="filter === item.value"
        @click="filter = item.value"
      >
        {{ item.label }}
      </button>
      <span class="ml-auto hidden text-sm text-slate-500 sm:block"
        >{{ shown }} pertandingan</span
      >
      <DateNav v-model="date" class="ml-auto shrink-0 sm:ml-2" />
    </div>

    <p
      v-if="blocks.length === 0"
      class="rounded bg-white p-6 text-center text-sm text-slate-500"
    >
      Tidak ada pertandingan pada filter ini.
    </p>

    <MatchList
      v-for="block in blocks"
      :key="block.league.id"
      :title="block.league.name"
      :subtitle="block.league.country"
      :league-id="block.league.id"
      :matches="block.matches"
    />
  </div>
</template>
