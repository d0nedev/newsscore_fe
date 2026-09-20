<script setup lang="ts">
import { findLeague } from "~/data/leagues";
import { matchesByTeam } from "~/data/matches";
import { findTeam } from "~/data/teams";

const route = useRoute();
const team = computed(() => findTeam(String(route.params.team)));
useHead(() => ({ title: team.value?.name ?? "Tim tidak ditemukan" }));

const league = computed(() =>
  team.value ? findLeague(team.value.leagueId) : undefined,
);
const tabs = [
  "Ringkasan",
  "Skuad",
  "Hasil Pertandingan",
  "Jadwal Pertandingan",
  "Peluang",
] as const;
const tab = ref<string>(tabs[0]);

const all = computed(() => (team.value ? matchesByTeam(team.value.id) : []));
const results = computed(() =>
  all.value.filter((match) => match.status !== "scheduled"),
);
const fixtures = computed(() =>
  all.value.filter((match) => match.status === "scheduled"),
);
const withOdds = computed(() =>
  all.value.filter((match) => match.odds?.length),
);
const capacity = new Intl.NumberFormat("id-ID");
</script>

<template>
  <p v-if="!team" class="rounded bg-white p-6 text-center text-sm">
    Tim tidak ditemukan.
    <NuxtLink to="/" class="underline">Kembali ke skor</NuxtLink>
  </p>

  <div v-else class="space-y-4">
    <header class="flex items-center gap-3 rounded bg-white p-4 shadow-sm">
      <span
        class="grid size-12 shrink-0 place-items-center rounded-full bg-slate-200 font-bold"
        aria-hidden="true"
        >{{ team.badge }}</span
      >
      <div>
        <h1 class="text-xl font-semibold">{{ team.name }}</h1>
        <p class="text-sm text-slate-500">
          <NuxtLink
            v-if="league"
            :to="`/sepak-bola/${league.id}`"
            class="hover:underline"
            >{{ league.country }}: {{ league.name }}</NuxtLink
          >
        </p>
        <p class="text-sm text-slate-500">
          Stadion: {{ team.venue }} · Kapasitas:
          {{ capacity.format(team.capacity) }} · Berdiri: {{ team.founded }}
        </p>
      </div>
    </header>

    <TabNav v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'Ringkasan'">
      <MatchList title="Pertandingan terakhir" :matches="all.slice(0, 5)" />
      <StandingsTable v-if="league" :rows="league.standings" />
    </template>
    <SquadTable v-else-if="tab === 'Skuad'" :players="team.squad" />
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
    <OddsList v-else :matches="withOdds" />
  </div>
</template>
