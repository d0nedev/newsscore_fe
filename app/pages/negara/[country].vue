<script setup lang="ts">
import { competitionsByCountry, findCountry } from "~/data/leagues";
import { matchesByLeague } from "~/data/matches";

const route = useRoute();
const country = computed(() => findCountry(String(route.params.country)));
useHead(() => ({ title: country.value ?? "Negara tidak ditemukan" }));

const crumbs = computed(() => [
  { label: "Sepak Bola", to: "/" },
  { label: country.value ?? "", country: country.value },
]);

const views = ["Skor terkini", "Jadwal"] as const;
const view = ref<string>(views[0]);

// One block per competition in this country, each keeping its own header bar.
const blocks = computed(() => {
  if (!country.value) return [];
  return competitionsByCountry(country.value)
    .map((competition) => {
      const all = matchesByLeague(competition.id);
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
</script>

<template>
  <NotFoundCard v-if="!country" message="Negara tidak ditemukan." />

  <div v-else class="space-y-4">
    <Card class="gap-0 overflow-hidden py-0">
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
          block.competition.standings.length ? 'Klasemen' : 'Penarikan'
        "
        :matches="block.matches"
      />
    </Card>
  </div>
</template>
