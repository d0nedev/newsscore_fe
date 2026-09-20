<script setup lang="ts">
import { findPlayer, findTeam, teams } from "~/data/teams";

const route = useRoute();
const id = computed(() => String(route.params.player));

// Full profiles exist for a few players; the rest fall back to their squad row.
const player = computed(() => findPlayer(id.value));
const squadEntry = computed(() =>
  teams
    .flatMap((team) => team.squad.map((entry) => ({ team, entry })))
    .find((row) => row.entry.id === id.value),
);
const name = computed(
  () => player.value?.name ?? squadEntry.value?.entry.name ?? "",
);
const team = computed(() =>
  player.value ? findTeam(player.value.teamId) : squadEntry.value?.team,
);
useHead(() => ({ title: name.value || "Pemain tidak ditemukan" }));

const season = computed(() =>
  player.value
    ? player.value.season
    : squadEntry.value && {
        matches: squadEntry.value.entry.matches,
        goals: squadEntry.value.entry.goals,
        assists: squadEntry.value.entry.assists,
        minutes: squadEntry.value.entry.matches * 90,
      },
);

// Only full profiles carry transfer and injury history.
const tabs = computed(() =>
  player.value ? ["Ringkasan", "Transfer", "Cedera"] : ["Ringkasan"],
);
const tab = ref("Ringkasan");
</script>

<template>
  <p v-if="!name" class="rounded bg-white p-6 text-center text-sm">
    Pemain tidak ditemukan.
    <NuxtLink to="/" class="underline">Kembali ke skor</NuxtLink>
  </p>

  <div v-else class="space-y-4">
    <header class="rounded bg-white p-4 shadow-sm">
      <h1 class="text-xl font-semibold">{{ name }}</h1>
      <p class="text-sm text-slate-500">
        <NuxtLink v-if="team" :to="`/tim/${team.id}`" class="hover:underline">{{
          team.name
        }}</NuxtLink>
        <template v-if="player">
          · {{ player.position }} · {{ player.country }}
        </template>
        <template v-else-if="squadEntry">
          · {{ squadEntry.entry.position }} · {{ squadEntry.entry.age }} tahun
        </template>
      </p>
      <p v-if="player" class="text-sm text-slate-500">
        Usia: {{ player.age }} · Tinggi: {{ player.height }} cm · Kaki:
        {{ player.foot }} · Nomor: {{ player.number }}
      </p>
    </header>

    <TabNav v-if="player" v-model="tab" :tabs="tabs" />

    <section
      v-if="season && tab === 'Ringkasan'"
      class="rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Statistik musim ini
      </h2>
      <dl class="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
        <div
          v-for="stat in [
            { label: 'Main', value: season.matches },
            { label: 'Gol', value: season.goals },
            { label: 'Assist', value: season.assists },
            { label: 'Menit', value: season.minutes },
          ]"
          :key="stat.label"
          class="bg-white p-3 text-center"
        >
          <dt class="text-xs text-slate-500">{{ stat.label }}</dt>
          <dd class="text-lg font-semibold tabular-nums">{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <section
      v-if="player?.transfers.length && tab === 'Transfer'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Transfer
      </h2>
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Musim</th>
            <th scope="col" class="px-3 py-1.5 text-left">Dari</th>
            <th scope="col" class="px-3 py-1.5 text-left">Ke</th>
            <th scope="col" class="px-3 py-1.5 text-right">Nilai</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="transfer in player.transfers" :key="transfer.season">
            <td class="px-3 py-1.5">{{ transfer.season }}</td>
            <td class="px-3 py-1.5">{{ transfer.from }}</td>
            <td class="px-3 py-1.5">{{ transfer.to }}</td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ transfer.fee }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section
      v-if="player && tab === 'Cedera'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Sejarah Cedera
      </h2>
      <p
        v-if="!player.injuries.length"
        class="px-3 py-3 text-sm text-slate-500"
      >
        Tidak ada catatan cedera.
      </p>
      <table v-else class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Musim</th>
            <th scope="col" class="px-3 py-1.5 text-left">Cedera</th>
            <th scope="col" class="px-3 py-1.5 text-right">Periode</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="injury in player.injuries" :key="injury.from">
            <td class="px-3 py-1.5">{{ injury.season }}</td>
            <td class="px-3 py-1.5">{{ injury.issue }}</td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ injury.from }} - {{ injury.to }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
