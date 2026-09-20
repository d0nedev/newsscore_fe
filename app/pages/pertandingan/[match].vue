<script setup lang="ts">
import { findLeague } from "~/data/leagues";
import { findMatch } from "~/data/matches";

const route = useRoute();
const match = computed(() => findMatch(String(route.params.match)));
useHead(() => ({
  title: match.value
    ? `${match.value.home.name} - ${match.value.away.name}`
    : "Pertandingan tidak ditemukan",
}));

const league = computed(() =>
  match.value ? findLeague(match.value.leagueId) : undefined,
);
// Tabs that need their own dummy record only show up when it exists.
const tabs = computed(() => [
  "Ringkasan",
  "Statistik",
  ...(match.value?.playerStats?.length ? ["Statistik Pemain"] : []),
  "Susunan Pemain",
  ...(match.value?.commentary?.length ? ["Komentar"] : []),
  "H2H",
  ...(match.value?.odds?.length ? ["Peluang"] : []),
]);
const tab = ref("Ringkasan");

const eventLabel = {
  goal: "Gol",
  yellow: "Kartu kuning",
  red: "Kartu merah",
  sub: "Pergantian",
};
</script>

<template>
  <p v-if="!match" class="rounded bg-white p-6 text-center text-sm">
    Pertandingan tidak ditemukan.
    <NuxtLink to="/" class="underline">Kembali ke skor</NuxtLink>
  </p>

  <div v-else class="space-y-4">
    <p class="text-sm text-slate-500">
      <NuxtLink
        v-if="league"
        :to="`/sepak-bola/${league.id}`"
        class="hover:underline"
        >{{ league.country }}: {{ league.name }}</NuxtLink
      >
      · {{ match.round }}
    </p>

    <section class="rounded bg-white p-6 shadow-sm">
      <div class="flex items-center justify-center gap-6">
        <NuxtLink
          :to="`/tim/${match.home.id}`"
          class="flex flex-1 items-center justify-end gap-2 text-right font-medium hover:underline"
        >
          {{ match.home.name }}
          <TeamBadge :badge="match.home.badge" />
        </NuxtLink>
        <p
          class="text-3xl font-bold tabular-nums"
          :class="match.status === 'live' ? 'text-red-600' : ''"
        >
          <template v-if="match.score">
            {{ match.score[0] }} - {{ match.score[1] }}
          </template>
          <template v-else>vs</template>
        </p>
        <NuxtLink
          :to="`/tim/${match.away.id}`"
          class="flex flex-1 items-center gap-2 font-medium hover:underline"
        >
          <TeamBadge :badge="match.away.badge" />
          {{ match.away.name }}
        </NuxtLink>
      </div>
      <p
        class="mt-2 text-center text-sm"
        :class="match.status === 'live' ? 'text-red-600' : 'text-slate-500'"
      >
        {{ match.time }}
        <span v-if="match.halfTime"
          >· Babak pertama {{ match.halfTime[0] }} -
          {{ match.halfTime[1] }}</span
        >
      </p>
      <p class="mt-1 text-center text-xs text-slate-500">
        {{ match.date }} · {{ match.venue }}
      </p>
    </section>

    <TabNav v-model="tab" :tabs="tabs" />

    <section
      v-if="tab === 'Ringkasan'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Jalannya pertandingan
      </h2>
      <p v-if="match.events.length === 0" class="p-4 text-sm text-slate-500">
        Belum ada kejadian.
      </p>
      <ul v-else class="divide-y text-sm">
        <li
          v-for="(event, i) in match.events"
          :key="i"
          class="flex items-center gap-3 px-3 py-2"
          :class="event.team === 'away' ? 'flex-row-reverse text-right' : ''"
        >
          <span class="w-10 shrink-0 text-slate-500 tabular-nums"
            >{{ event.minute }}'</span
          >
          <span class="flex-1">
            <span class="font-medium">{{ event.player }}</span>
            <span class="text-slate-500">
              · {{ eventLabel[event.type]
              }}<template v-if="event.note"> {{ event.note }}</template>
            </span>
          </span>
        </li>
      </ul>
    </section>

    <section
      v-else-if="tab === 'Statistik'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Statistik
      </h2>
      <p v-if="match.stats.length === 0" class="p-4 text-sm text-slate-500">
        Statistik belum tersedia.
      </p>
      <MatchStats v-else :stats="match.stats" />
    </section>

    <section
      v-else-if="tab === 'Susunan Pemain'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Susunan pemain
      </h2>
      <p
        v-if="match.lineups.home.length === 0"
        class="p-4 text-sm text-slate-500"
      >
        Susunan pemain belum diumumkan.
      </p>
      <div v-else class="grid gap-px bg-slate-100 sm:grid-cols-2">
        <div
          v-for="side in ['home', 'away'] as const"
          :key="side"
          class="bg-white p-3"
        >
          <h3 class="mb-2 text-sm font-semibold">
            {{ side === "home" ? match.home.name : match.away.name }}
          </h3>
          <ul class="space-y-1 text-sm">
            <li
              v-for="player in match.lineups[side]"
              :key="player.number"
              class="flex gap-2"
            >
              <span class="w-6 text-right text-slate-400 tabular-nums">{{
                player.number
              }}</span>
              <NuxtLink
                v-if="player.playerId"
                :to="`/pemain/${player.playerId}`"
                class="hover:underline"
                >{{ player.name }}</NuxtLink
              >
              <span v-else>{{ player.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section
      v-else-if="tab === 'Statistik Pemain'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Statistik pemain
      </h2>
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Pemain</th>
            <th scope="col" class="px-3 py-1.5 text-left">Tim</th>
            <th scope="col" class="px-3 py-1.5 text-right">Nilai</th>
            <th scope="col" class="px-3 py-1.5 text-right">Gol</th>
            <th scope="col" class="px-3 py-1.5 text-right">Assist</th>
            <th scope="col" class="px-3 py-1.5 text-right">Tembakan</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="row in match.playerStats" :key="row.name">
            <td class="px-3 py-1.5">
              <NuxtLink
                v-if="row.playerId"
                :to="`/pemain/${row.playerId}`"
                class="hover:underline"
                >{{ row.name }}</NuxtLink
              >
              <span v-else>{{ row.name }}</span>
            </td>
            <td class="px-3 py-1.5 text-slate-500">
              {{ row.team === "home" ? match.home.name : match.away.name }}
            </td>
            <td class="px-3 py-1.5 text-right font-semibold tabular-nums">
              {{ row.rating.toFixed(1) }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums">{{ row.goals }}</td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ row.assists }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums">{{ row.shots }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section
      v-else-if="tab === 'Komentar'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Komentar langsung
      </h2>
      <ul class="divide-y text-sm">
        <li
          v-for="line in match.commentary"
          :key="line.minute + line.text"
          class="flex gap-3 px-3 py-2"
          :class="line.highlight ? 'bg-emerald-50 font-medium' : ''"
        >
          <span class="w-10 shrink-0 text-slate-500 tabular-nums">{{
            line.minute
          }}</span>
          <span class="flex-1">{{ line.text }}</span>
        </li>
      </ul>
    </section>

    <section
      v-else-if="tab === 'Peluang'"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Peluang 1X2
      </h2>
      <p class="px-3 pt-2 text-xs text-slate-500">
        Angka dummy untuk tampilan, bukan peluang sungguhan.
      </p>
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Bandar</th>
            <th scope="col" class="px-3 py-1.5 text-right">1</th>
            <th scope="col" class="px-3 py-1.5 text-right">X</th>
            <th scope="col" class="px-3 py-1.5 text-right">2</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="row in match.odds" :key="row.bookmaker">
            <td class="px-3 py-1.5">{{ row.bookmaker }}</td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ row.home.toFixed(2) }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ row.draw.toFixed(2) }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              {{ row.away.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-else class="overflow-hidden rounded bg-white shadow-sm">
      <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        Pertemuan terakhir
      </h2>
      <p
        v-if="match.headToHead.length === 0"
        class="p-4 text-sm text-slate-500"
      >
        Belum ada pertemuan sebelumnya.
      </p>
      <ul v-else class="divide-y text-sm">
        <li
          v-for="game in match.headToHead"
          :key="game.date"
          class="flex items-center gap-3 px-3 py-2"
        >
          <span class="w-24 shrink-0 text-slate-500 tabular-nums">{{
            game.date
          }}</span>
          <span class="flex-1">{{ game.label }}</span>
          <span class="font-semibold tabular-nums">{{ game.score }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
