<script setup lang="ts">
import { Info, Pin, Trophy } from "@lucide/vue";
import { slugify } from "~/utils/slug";
import { seasonProgress } from "~/utils/standings";

const route = useRoute();
const leagueQuery = useLeague(() => String(route.params.league));
const league = computed(() => leagueQuery.data.value);
useHead(() => ({ title: league.value?.name ?? "Kompetisi tidak ditemukan" }));

// Cups have no table, so the standings tab disappears for them.
const hasStandings = computed(() => (league.value?.standings.length ?? 0) > 0);
const tab = ref("Ringkasan");

const crumbs = computed(() => [
  { label: "Sepak Bola", to: "/" },
  {
    label: league.value?.country ?? "",
    country: league.value?.country,
    to: league.value ? `/negara/${slugify(league.value.country)}` : undefined,
  },
]);

const week = useMatchWeek();
const all = computed(() =>
  week.value.data.filter((match) => match.leagueId === league.value?.id),
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

const tabs = computed(() => [
  "Ringkasan",
  ...(withOdds.value.length ? ["Peluang"] : []),
  "Hasil Pertandingan",
  "Jadwal Pertandingan",
  ...(hasStandings.value ? ["Klasemen"] : []),
  ...(league.value?.archive.length ? ["Arsip"] : []),
]);
// The summary tab previews each list; the dedicated tabs show everything.
const PREVIEW = 12;
const showAllFixtures = ref(false);
const showAllResults = ref(false);
const fixturePreview = computed(() =>
  showAllFixtures.value ? fixtures.value : fixtures.value.slice(0, PREVIEW),
);
const resultPreview = computed(() =>
  showAllResults.value ? results.value : results.value.slice(0, PREVIEW),
);

const progress = computed(() =>
  seasonProgress(league.value?.start, league.value?.end),
);

const { isPinned, toggle } = usePinnedLeagues();
const pinned = computed(() => isPinned(league.value?.id));
</script>

<template>
  <ErrorState
    v-if="leagueQuery.error.value && !isNotFound(leagueQuery.error.value)"
    :error="leagueQuery.error.value"
    @retry="leagueQuery.refetch()"
  />
  <NotFoundCard
    v-else-if="leagueQuery.error.value"
    message="Kompetisi tidak ditemukan."
  />

  <div v-else-if="league" class="space-y-4">
    <PageHeader :crumbs="crumbs" :title="league.name" icon="trophy">
      <template #actions>
        <Button
          variant="ghost"
          size="icon"
          class="size-6 shrink-0"
          :class="pinned ? 'text-sky-600' : 'text-muted-foreground'"
          :aria-pressed="pinned"
          :aria-label="
            pinned ? `Lepas sematan ${league.name}` : `Sematkan ${league.name}`
          "
          @click="toggle(league.id)"
        >
          <Pin :fill="pinned ? 'currentColor' : 'none'" />
        </Button>
      </template>

      <template #meta>
        <p class="text-muted-foreground text-sm">{{ league.season }}</p>

        <div v-if="progress !== null" class="mt-4 max-w-md">
          <div class="flex items-center gap-2">
            <div class="bg-muted h-1.5 flex-1 rounded-full">
              <div
                class="bg-foreground h-full rounded-full"
                :style="{ width: `${Math.round(progress * 100)}%` }"
              />
            </div>
            <Trophy class="text-muted-foreground size-3.5" />
            <Info class="text-muted-foreground size-3.5" />
          </div>
          <p
            class="text-muted-foreground mt-1 flex justify-between text-[11px] tabular-nums"
          >
            <span>{{ league.start }}</span>
            <span>{{ league.end }}</span>
          </p>
        </div>
      </template>

      <template #tabs>
        <TabNav v-model="tab" :tabs="tabs" />
      </template>
    </PageHeader>

    <template v-if="tab === 'Ringkasan'">
      <SectionCard
        card="ringkasan-jadwal"
        title="Jadwal"
        :empty="fixtures.length ? undefined : 'Belum ada jadwal.'"
        :more-label="
          !showAllFixtures && fixtures.length > PREVIEW
            ? 'Tampilkan pertandingan lainnya'
            : undefined
        "
        @more="showAllFixtures = true"
      >
        <MatchList
          :title="league.name"
          :subtitle="league.country"
          :league-id="league.id"
          :matches="fixturePreview"
        />
      </SectionCard>

      <SectionCard
        title="Skor terkini"
        :empty="results.length ? undefined : 'Belum ada hasil.'"
        :more-label="
          !showAllResults && results.length > PREVIEW
            ? 'Tampilkan pertandingan lainnya'
            : undefined
        "
        @more="showAllResults = true"
      >
        <MatchList
          :title="league.name"
          :subtitle="league.country"
          :league-id="league.id"
          :matches="resultPreview"
        />
      </SectionCard>

      <StandingsBlock v-if="hasStandings" :league="league" />
    </template>

    <SectionCard
      v-else-if="tab === 'Hasil Pertandingan'"
      title="Hasil"
      :empty="results.length ? undefined : 'Belum ada hasil.'"
    >
      <MatchList
        :title="league.name"
        :subtitle="league.country"
        :matches="results"
      />
    </SectionCard>

    <SectionCard
      v-else-if="tab === 'Jadwal Pertandingan'"
      title="Jadwal"
      :empty="fixtures.length ? undefined : 'Belum ada jadwal.'"
    >
      <MatchList
        :title="league.name"
        :subtitle="league.country"
        :matches="fixtures"
      />
    </SectionCard>

    <StandingsBlock
      v-else-if="tab === 'Klasemen' && hasStandings"
      :league="league"
    />

    <SectionCard
      v-else-if="tab === 'Peluang'"
      title="Peluang"
      :empty="withOdds.length ? undefined : 'Belum ada peluang.'"
    >
      <OddsList :matches="withOdds" />
    </SectionCard>

    <SectionCard
      v-else
      title="Arsip musim"
      scroll
      :empty="league.archive.length ? undefined : 'Belum ada arsip.'"
    >
      <Table class="text-sm">
        <TableHeader>
          <TableRow class="text-muted-foreground text-xs uppercase">
            <TableHead class="w-28 pl-4">Musim</TableHead>
            <TableHead>Juara</TableHead>
            <TableHead class="pr-4">Runner-up</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="season in league.archive" :key="season.season">
            <TableCell class="text-muted-foreground pl-4 tabular-nums">
              {{ season.season }}
            </TableCell>
            <TableCell class="font-semibold">{{ season.winner }}</TableCell>
            <TableCell class="text-muted-foreground pr-4">
              {{ season.runnerUp }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionCard>
  </div>
</template>
