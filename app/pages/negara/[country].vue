<script setup lang="ts">
const route = useRoute();
const comps = useCompetitions();
const country = computed(() => comps.findCountry(String(route.params.country)));
useHead(() => ({ title: country.value ?? "Negara tidak ditemukan" }));

const crumbs = computed(() => [
  { label: "Sepak Bola", to: "/" },
  { label: country.value ?? "", country: country.value },
]);

const views = ["Skor terkini", "Jadwal"] as const;
const view = ref<string>(views[0]);

const matchesQuery = useMatches(matchWindow());

// One block per competition in this country, each keeping its own header bar.
const blocks = computed(() => {
  if (!country.value) return [];
  return comps
    .byCountry(country.value)
    .map((competition) => {
      const all = (matchesQuery.data.value ?? []).filter(
        (match) => match.leagueId === competition.id,
      );
      const matches =
        view.value === "Jadwal"
          ? all.filter((match) => match.status === "scheduled")
          : all.filter((match) => match.status !== "scheduled");
      return { competition, matches };
    })
    .filter((block) => block.matches.length > 0);
});

const empty = computed(() =>
  blocks.value.length
    ? undefined
    : view.value === "Jadwal"
      ? "Belum ada jadwal untuk negara ini."
      : "Belum ada hasil untuk negara ini.",
);

const cardId = useCardId("pertandingan");
</script>

<template>
  <ErrorState
    v-if="comps.error.value"
    :error="comps.error.value"
    @retry="comps.refetch()"
  />
  <NotFoundCard
    v-else-if="comps.isSuccess.value && !country"
    message="Negara tidak ditemukan."
  />

  <div v-else-if="country" class="space-y-4">
    <Card :data-card="cardId" class="gap-0 overflow-hidden py-0">
      <AppBreadcrumb :items="crumbs" />

      <div class="p-3">
        <PillTabs v-model="view" :items="views" aria-label="Tampilan skor" />
      </div>

      <p v-if="empty" class="text-muted-foreground p-4 text-sm">{{ empty }}</p>

      <MatchList
        v-for="block in blocks"
        :key="block.competition.id"
        :title="block.competition.name"
        :subtitle="block.competition.country"
        :league-id="block.competition.id"
        :link-label="
          block.competition.type === 'league' ? 'Klasemen' : 'Penarikan'
        "
        :matches="block.matches"
      />
    </Card>
  </div>
</template>
