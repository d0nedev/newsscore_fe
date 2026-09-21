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
  <Card v-if="!league">
    <CardContent class="text-center text-sm">
      Kompetisi tidak ditemukan.
      <Button as-child variant="link" size="sm">
        <NuxtLink to="/">Kembali ke skor</NuxtLink>
      </Button>
    </CardContent>
  </Card>

  <div v-else class="space-y-4">
    <Card>
      <CardHeader>
        <CardDescription>{{ league.country }}</CardDescription>
        <CardTitle as="h1" class="text-xl">{{ league.name }}</CardTitle>
        <CardDescription>Musim {{ league.season }}</CardDescription>
      </CardHeader>
    </Card>

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
    <Card v-else class="gap-0 overflow-hidden py-0">
      <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
        <CardTitle as="h2" class="text-sm">Arsip musim</CardTitle>
      </CardHeader>
      <CardContent class="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Musim</TableHead>
              <TableHead>Juara</TableHead>
              <TableHead>Runner-up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="season in league.archive" :key="season.season">
              <TableCell class="tabular-nums">{{ season.season }}</TableCell>
              <TableCell class="font-medium">{{ season.winner }}</TableCell>
              <TableCell class="text-muted-foreground">{{
                season.runnerUp
              }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
