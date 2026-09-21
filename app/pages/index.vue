<script setup lang="ts">
import { Calendar, CalendarDays } from "@lucide/vue";
import { findLeague, leagues } from "~/data/leagues";
import { matches, today } from "~/data/matches";
import { news } from "~/data/news";
import type { MatchStatus } from "~/types/match";

useHead({ title: "Skor Langsung" });

const filters: { label: string; value: MatchStatus | "all" }[] = [
  { label: "SEMUA", value: "all" },
  { label: "LIVE", value: "live" },
  { label: "SELESAI", value: "finished" },
  { label: "JADWAL", value: "scheduled" },
];
const filter = ref<MatchStatus | "all">("all");
const date = ref(today);

const onDate = computed(() =>
  matches.filter((match) => match.date === date.value),
);
const shownMatches = computed(() =>
  onDate.value.filter(
    (match) => filter.value === "all" || match.status === filter.value,
  ),
);
// The hero picks the running match, falling back to the first of the day.
const featured = computed(
  () =>
    onDate.value.find((match) => match.status === "live") ?? onDate.value[0],
);
const leagueName = (id: string) => findLeague(id)?.name ?? "";
</script>

<template>
  <div class="space-y-4">
    <FeaturedMatch
      v-if="featured"
      :match="featured"
      :league="leagueName(featured.leagueId)"
    />

    <section class="bg-background rounded-lg border shadow-sm">
      <div class="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <Button
          v-for="item in filters"
          :key="item.value"
          size="sm"
          class="rounded-full text-xs font-bold"
          :variant="filter === item.value ? 'default' : 'secondary'"
          :aria-pressed="filter === item.value"
          @click="filter = item.value"
        >
          {{ item.label }}
        </Button>
        <DateNav v-model="date" class="ml-auto shrink-0">
          <Calendar class="text-muted-foreground size-4" />
        </DateNav>
      </div>

      <header class="flex items-center justify-between px-4 pt-3 text-sm">
        <h2 class="font-bold">Pertandingan Hari Ini</h2>
        <span class="text-muted-foreground"
          >{{ shownMatches.length }} pertandingan</span
        >
      </header>

      <p
        v-if="shownMatches.length === 0"
        class="text-muted-foreground p-6 text-center text-sm"
      >
        Tidak ada pertandingan pada filter ini.
      </p>
      <ul v-else aria-label="Pertandingan hari ini" class="divide-y p-1">
        <li v-for="match in shownMatches" :key="match.id">
          <MatchCardRow :match="match" :league="leagueName(match.leagueId)" />
        </li>
      </ul>

      <footer class="border-t p-2 text-center">
        <Button as-child variant="ghost" size="sm" class="gap-2">
          <NuxtLink :to="`/sepak-bola/${leagues[0]!.id}`">
            <CalendarDays /> Lihat Jadwal Lengkap
          </NuxtLink>
        </Button>
      </footer>
    </section>

    <StandingsOverview :leagues="leagues" />

    <NewsList :items="news" />
  </div>
</template>
