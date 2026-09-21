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
  <Card v-if="!team">
    <CardContent class="text-center text-sm">
      Tim tidak ditemukan.
      <Button as-child variant="link" size="sm">
        <NuxtLink to="/">Kembali ke skor</NuxtLink>
      </Button>
    </CardContent>
  </Card>

  <div v-else class="space-y-4">
    <Card>
      <CardContent class="flex items-center gap-3">
        <Badge
          variant="secondary"
          class="size-12 shrink-0 justify-center rounded-full p-0 text-base font-bold"
          aria-hidden="true"
          >{{ team.badge }}</Badge
        >
        <div>
          <CardTitle as="h1" class="text-xl">{{ team.name }}</CardTitle>
          <CardDescription>
            <NuxtLink
              v-if="league"
              :to="`/sepak-bola/${league.id}`"
              class="hover:underline"
              >{{ league.country }}: {{ league.name }}</NuxtLink
            >
          </CardDescription>
          <CardDescription>
            Stadion: {{ team.venue }} · Kapasitas:
            {{ capacity.format(team.capacity) }} · Berdiri: {{ team.founded }}
          </CardDescription>
        </div>
      </CardContent>
    </Card>

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
