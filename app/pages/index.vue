<script setup lang="ts">
import { Calendar, CalendarDays } from "@lucide/vue";
import type { MatchStatus } from "~/types/match";

useHead({ title: "Skor Langsung" });

const filters: Record<string, MatchStatus | "all"> = {
  SEMUA: "all",
  LIVE: "live",
  SELESAI: "finished",
  JADWAL: "scheduled",
};
const filterLabel = ref("SEMUA");
const filter = computed(() => filters[filterLabel.value]!);
const date = ref(useMatchDays().today);

const matchesQuery = useMatches(() => ({ date: date.value }));
const onDate = computed(() => matchesQuery.data.value ?? []);
const { leagues, findLeague } = useCompetitions();
const tables = useLeagueTables();
const { data: news } = useNews();
const shownMatches = computed(() =>
  onDate.value.filter(
    (match) => filter.value === "all" || match.status === filter.value,
  ),
);
const matchCount = computed(() => `${shownMatches.value.length} pertandingan`);
// The hero picks the running match, falling back to the first of the day.
const featured = computed(
  () =>
    onDate.value.find((match) => match.status === "live") ?? onDate.value[0],
);
const leagueName = (id: string) => findLeague(id)?.name ?? "";
</script>

<template>
  <div class="space-y-4">
    <h1 class="sr-only">Skor langsung sepak bola</h1>
    <FeaturedMatch
      v-if="featured"
      :match="featured"
      :league="leagueName(featured.leagueId)"
    />

    <SectionCard title="Pertandingan Hari Ini">
      <template #action>
        <span class="text-muted-foreground text-xs">{{ matchCount }}</span>
      </template>

      <div class="flex flex-wrap items-center gap-2 border-t px-4 py-3">
        <PillTabs
          v-model="filterLabel"
          :items="Object.keys(filters)"
          label="Saring pertandingan"
        />
        <DateNav v-model="date" class="ml-auto shrink-0">
          <Calendar class="text-muted-foreground size-4" />
        </DateNav>
      </div>

      <div v-if="matchesQuery.error.value" class="border-t p-3">
        <ErrorState
          :error="matchesQuery.error.value"
          @retry="matchesQuery.refetch()"
        />
      </div>

      <SkeletonRows v-if="matchesQuery.isPending.value" class="border-t" />
      <ul aria-label="Pertandingan hari ini" class="divide-y border-t">
        <li v-for="match in shownMatches" :key="match.id">
          <MatchCardRow :match="match" :league="leagueName(match.leagueId)" />
        </li>
      </ul>
      <!-- Below the filter and date bar, so an empty day can still be left. -->
      <p
        v-if="
          !shownMatches.length &&
          !matchesQuery.isPending.value &&
          !matchesQuery.error.value
        "
        class="text-muted-foreground p-4 text-sm"
      >
        {{
          onDate.length
            ? "Tidak ada pertandingan pada filter ini."
            : "Tidak ada pertandingan pada tanggal ini."
        }}
      </p>

      <div v-if="leagues[0]" class="border-t p-2 text-center">
        <Button
          as-child
          variant="ghost"
          size="sm"
          class="gap-2 text-xs font-semibold"
        >
          <NuxtLink :to="`/sepak-bola/${leagues[0].id}`">
            <CalendarDays /> Lihat Jadwal Lengkap
          </NuxtLink>
        </Button>
      </div>
    </SectionCard>

    <StandingsOverview :leagues="tables" />

    <NewsList :items="news ?? []" />
  </div>
</template>
