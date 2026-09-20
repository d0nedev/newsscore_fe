<script setup lang="ts">
import { findLeague } from "~/data/leagues";
import { matchesByLeague } from "~/data/matches";

const route = useRoute();
const league = computed(() => findLeague(String(route.params.league)));
useHead(() => ({ title: league.value?.name ?? "Kompetisi tidak ditemukan" }));

const tabs = [
  "Ringkasan",
  "Hasil Pertandingan",
  "Jadwal Pertandingan",
  "Klasemen",
  "Peluang",
  "Arsip",
] as const;
const tab = ref<string>(tabs[0]);

const all = computed(() =>
  league.value ? matchesByLeague(league.value.id) : [],
);
const results = computed(() =>
  all.value.filter((match) => match.status !== "scheduled"),
);
const fixtures = computed(() =>
  all.value.filter((match) => match.status === "scheduled"),
);
const withOdds = computed(() =>
  all.value.filter((match) => match.odds?.length),
);
</script>

<template>
  <p v-if="!league" class="rounded bg-white p-6 text-center text-sm">
    Kompetisi tidak ditemukan.
    <NuxtLink to="/" class="underline">Kembali ke skor</NuxtLink>
  </p>

  <div v-else class="space-y-4">
    <header class="rounded bg-white p-4 shadow-sm">
      <p class="text-sm text-slate-500">{{ league.country }}</p>
      <h1 class="text-xl font-semibold">{{ league.name }}</h1>
      <p class="text-sm text-slate-500">Musim {{ league.season }}</p>
    </header>

    <TabNav v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'Ringkasan'">
      <MatchList title="Pertandingan hari ini" :matches="all" />
      <StandingsTable :rows="league.standings.slice(0, 5)" />
    </template>
    <MatchList
      v-else-if="tab === 'Hasil Pertandingan'"
      title="Hasil"
      :matches="results"
    />
    <MatchList
      v-else-if="tab === 'Jadwal Pertandingan'"
      title="Jadwal"
      :matches="fixtures"
    />
    <StandingsTable v-else-if="tab === 'Klasemen'" :rows="league.standings" />
    <OddsList v-else-if="tab === 'Peluang'" :matches="withOdds" />
    <section v-else class="overflow-hidden rounded bg-white shadow-sm">
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Arsip musim
      </h2>
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Musim</th>
            <th scope="col" class="px-3 py-1.5 text-left">Juara</th>
            <th scope="col" class="px-3 py-1.5 text-left">Runner-up</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="season in league.archive" :key="season.season">
            <td class="px-3 py-1.5 tabular-nums">{{ season.season }}</td>
            <td class="px-3 py-1.5 font-medium">{{ season.winner }}</td>
            <td class="px-3 py-1.5 text-slate-500">{{ season.runnerUp }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
