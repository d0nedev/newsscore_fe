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
  <Card v-if="!name">
    <CardContent class="text-center text-sm">
      Pemain tidak ditemukan.
      <Button as-child variant="link" size="sm">
        <NuxtLink to="/">Kembali ke skor</NuxtLink>
      </Button>
    </CardContent>
  </Card>

  <div v-else class="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle as="h1" class="text-xl">{{ name }}</CardTitle>
        <CardDescription>
          <NuxtLink
            v-if="team"
            :to="`/tim/${team.id}`"
            class="hover:underline"
            >{{ team.name }}</NuxtLink
          >
          <template v-if="player">
            · {{ player.position }} · {{ player.country }}
          </template>
          <template v-else-if="squadEntry">
            · {{ squadEntry.entry.position }} · {{ squadEntry.entry.age }} tahun
          </template>
        </CardDescription>
        <CardDescription v-if="player">
          Usia: {{ player.age }} · Tinggi: {{ player.height }} cm · Kaki:
          {{ player.foot }} · Nomor: {{ player.number }}
        </CardDescription>
      </CardHeader>
    </Card>

    <TabNav v-if="player" v-model="tab" :tabs="tabs" />

    <Card v-if="season && tab === 'Ringkasan'" class="gap-0 py-0">
      <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
        <CardTitle as="h2" class="text-sm">Statistik musim ini</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-3 p-3 sm:grid-cols-4">
        <div
          v-for="stat in [
            { label: 'Main', value: season.matches },
            { label: 'Gol', value: season.goals },
            { label: 'Assist', value: season.assists },
            { label: 'Menit', value: season.minutes },
          ]"
          :key="stat.label"
          class="bg-muted/50 rounded-md p-3 text-center"
        >
          <p class="text-muted-foreground text-xs">{{ stat.label }}</p>
          <p class="text-lg font-semibold tabular-nums">{{ stat.value }}</p>
        </div>
      </CardContent>
    </Card>

    <Card
      v-if="player?.transfers.length && tab === 'Transfer'"
      class="gap-0 overflow-hidden py-0"
    >
      <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
        <CardTitle as="h2" class="text-sm">Transfer</CardTitle>
      </CardHeader>
      <CardContent class="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Musim</TableHead>
              <TableHead>Dari</TableHead>
              <TableHead>Ke</TableHead>
              <TableHead class="text-right">Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="transfer in player.transfers"
              :key="transfer.season"
            >
              <TableCell>{{ transfer.season }}</TableCell>
              <TableCell>{{ transfer.from }}</TableCell>
              <TableCell>{{ transfer.to }}</TableCell>
              <TableCell class="text-right tabular-nums">{{
                transfer.fee
              }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card v-if="player && tab === 'Cedera'" class="gap-0 overflow-hidden py-0">
      <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
        <CardTitle as="h2" class="text-sm">Sejarah Cedera</CardTitle>
      </CardHeader>
      <CardContent class="px-0">
        <p
          v-if="!player.injuries.length"
          class="text-muted-foreground px-3 py-3 text-sm"
        >
          Tidak ada catatan cedera.
        </p>
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Musim</TableHead>
              <TableHead>Cedera</TableHead>
              <TableHead class="text-right">Periode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="injury in player.injuries" :key="injury.from">
              <TableCell>{{ injury.season }}</TableCell>
              <TableCell>{{ injury.issue }}</TableCell>
              <TableCell class="text-right tabular-nums">
                {{ injury.from }} - {{ injury.to }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
