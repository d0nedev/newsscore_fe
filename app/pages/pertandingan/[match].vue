<script setup lang="ts">
import { ChevronRight, ExternalLink, Star, Tv } from "@lucide/vue";
import { findLeague } from "~/data/leagues";
import { findMatch } from "~/data/matches";
import { news } from "~/data/news";

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

// Top row picks the area of the match; the pill row picks the detail below it.
const mainTabs = computed(() => [
  "Pertandingan",
  "H2H",
  ...(match.value?.odds?.length ? ["Peluang"] : []),
  "Berita",
]);
const mainTab = ref("Pertandingan");

const subTabs = computed(() => [
  "Ringkasan",
  "Statistik",
  "Susunan Pemain",
  ...(match.value?.playerStats?.length ? ["Statistik Pemain"] : []),
  ...(match.value?.commentary?.length ? ["Komentar"] : []),
]);
const subTab = ref("Ringkasan");
// Picking a detail always returns to the match area it belongs to.
function openDetail(tab: string) {
  subTab.value = tab;
  mainTab.value = "Pertandingan";
}

const starred = ref({ home: false, away: false });
</script>

<template>
  <Card v-if="!match">
    <CardContent class="text-center text-sm">
      Pertandingan tidak ditemukan.
      <Button as-child variant="link" size="sm">
        <NuxtLink to="/">Kembali ke skor</NuxtLink>
      </Button>
    </CardContent>
  </Card>

  <div v-else class="bg-background rounded-lg border shadow-sm">
    <nav
      aria-label="Remah"
      class="text-muted-foreground flex items-center gap-1 border-b px-3 py-2 text-xs"
    >
      <NuxtLink to="/" class="hover:text-primary">Sepak Bola</NuxtLink>
      <template v-if="league">
        <ChevronRight class="size-3" />
        <CountryChip :country="league.country" />
        <span class="uppercase">{{ league.country }}</span>
        <ChevronRight class="size-3" />
        <NuxtLink
          :to="`/sepak-bola/${league.id}`"
          class="hover:text-primary uppercase"
          >{{ league.name }} - {{ match.round }}</NuxtLink
        >
        <NuxtLink
          :to="`/sepak-bola/${league.id}`"
          target="_blank"
          class="hover:text-primary ml-auto flex items-center gap-1 underline"
        >
          <ExternalLink class="size-3" /> Jendela baru
        </NuxtLink>
      </template>
    </nav>

    <section
      aria-label="Papan skor"
      class="grid grid-cols-[1fr_auto_1fr] items-center gap-8 px-4 py-8"
    >
      <div
        v-for="side in ['home', 'away'] as const"
        :key="side"
        class="flex items-center gap-3"
        :class="side === 'home' ? 'order-1 justify-end' : 'order-3'"
      >
        <Button
          variant="ghost"
          size="icon"
          class="size-7"
          :class="[
            starred[side] ? 'text-primary' : 'text-muted-foreground/50',
            side === 'home' ? 'order-1' : 'order-2',
          ]"
          :aria-pressed="starred[side]"
          :aria-label="`Ikuti ${match[side].name}`"
          @click="starred[side] = !starred[side]"
        >
          <Star :fill="starred[side] ? 'currentColor' : 'none'" />
        </Button>
        <NuxtLink
          :to="`/tim/${match[side].id}`"
          class="flex flex-col items-center gap-2 text-center hover:underline"
          :class="side === 'home' ? 'order-2' : 'order-1'"
        >
          <span
            class="bg-muted grid size-14 place-items-center rounded-full text-base font-bold"
            aria-hidden="true"
            >{{ match[side].badge }}</span
          >
          <span class="font-bold">{{ match[side].name }}</span>
        </NuxtLink>
      </div>

      <div class="order-2 w-32 space-y-1 text-center">
        <p class="text-muted-foreground text-xs">
          {{ match.date }}
          <span v-if="match.status === 'scheduled'">{{ match.time }}</span>
        </p>
        <p
          class="text-4xl font-extrabold tabular-nums"
          :class="match.status === 'live' ? 'text-primary' : ''"
        >
          <template v-if="match.score">
            {{ match.score[0] }} - {{ match.score[1] }}
          </template>
          <template v-else>vs</template>
        </p>
        <p
          class="text-xs font-semibold uppercase"
          :class="
            match.status === 'live' ? 'text-primary' : 'text-muted-foreground'
          "
        >
          {{ match.status === "finished" ? "Selesai" : match.time }}
        </p>
      </div>
    </section>

    <div class="border-b px-2">
      <Tabs v-model="mainTab">
        <TabsList variant="line" class="w-full justify-start overflow-x-auto">
          <TabsTrigger
            v-for="tab in mainTabs"
            :key="tab"
            :value="tab"
            class="flex-none text-xs font-bold uppercase"
          >
            {{ tab }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div role="tablist" class="flex flex-wrap gap-2 px-3 py-3">
      <Button
        v-for="tab in subTabs"
        :key="tab"
        size="sm"
        role="tab"
        class="rounded-full text-xs font-bold"
        :variant="
          mainTab === 'Pertandingan' && subTab === tab ? 'default' : 'secondary'
        "
        :aria-selected="mainTab === 'Pertandingan' && subTab === tab"
        @click="openDetail(tab)"
      >
        {{ tab }}
      </Button>
    </div>

    <template v-if="mainTab === 'Pertandingan'">
      <template v-if="subTab === 'Ringkasan'">
        <MatchEvents :match="match" />

        <template v-if="match.stats.length">
          <h3
            class="bg-muted text-muted-foreground mt-2 px-3 py-1.5 text-xs font-semibold uppercase"
          >
            Statistik
          </h3>
          <MatchStats :stats="match.stats.slice(0, 5)" />
        </template>

        <template v-if="match.broadcasters?.length">
          <h3
            class="bg-muted text-muted-foreground mt-2 px-3 py-1.5 text-xs font-semibold uppercase"
          >
            Chanel televisi
          </h3>
          <p class="flex items-center gap-2 px-3 py-2 text-sm">
            <Tv class="text-muted-foreground size-4" />
            {{ match.broadcasters.join(", ") }}
          </p>
        </template>

        <h3
          class="bg-muted text-muted-foreground mt-2 px-3 py-1.5 text-xs font-semibold uppercase"
        >
          Informasi pertandingan
        </h3>
        <MatchInfo :match="match" />
      </template>

      <template v-else-if="subTab === 'Statistik'">
        <p
          v-if="match.stats.length === 0"
          class="text-muted-foreground p-4 text-sm"
        >
          Statistik belum tersedia.
        </p>
        <MatchStats v-else :stats="match.stats" />
      </template>

      <template v-else-if="subTab === 'Susunan Pemain'">
        <p
          v-if="match.lineups.home.length === 0"
          class="text-muted-foreground p-4 text-sm"
        >
          Susunan pemain belum diumumkan.
        </p>
        <div v-else class="grid sm:grid-cols-2 sm:divide-x">
          <div
            v-for="side in ['home', 'away'] as const"
            :key="side"
            class="p-3"
          >
            <h3
              class="text-muted-foreground mb-2 text-xs font-semibold uppercase"
            >
              {{ side === "home" ? match.home.name : match.away.name }}
            </h3>
            <ul class="space-y-1 text-sm">
              <li
                v-for="player in match.lineups[side]"
                :key="player.number"
                class="flex gap-2"
              >
                <span
                  class="text-muted-foreground w-6 text-right tabular-nums"
                  >{{ player.number }}</span
                >
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
      </template>

      <Table v-else-if="subTab === 'Statistik Pemain'">
        <TableHeader>
          <TableRow>
            <TableHead>Pemain</TableHead>
            <TableHead>Tim</TableHead>
            <TableHead class="text-right">Nilai</TableHead>
            <TableHead class="text-right">Gol</TableHead>
            <TableHead class="text-right">Assist</TableHead>
            <TableHead class="text-right">Tembakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in match.playerStats" :key="row.name">
            <TableCell>
              <NuxtLink
                v-if="row.playerId"
                :to="`/pemain/${row.playerId}`"
                class="hover:underline"
                >{{ row.name }}</NuxtLink
              >
              <span v-else>{{ row.name }}</span>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ row.team === "home" ? match.home.name : match.away.name }}
            </TableCell>
            <TableCell class="text-right font-semibold tabular-nums">
              {{ row.rating.toFixed(1) }}
            </TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.goals
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.assists
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.shots
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <template v-else>
        <h3
          class="bg-muted text-muted-foreground px-3 py-1.5 text-xs font-semibold uppercase"
        >
          Komentar langsung
        </h3>
        <ul class="divide-y text-sm">
          <li
            v-for="line in match.commentary"
            :key="line.minute + line.text"
            class="flex gap-3 px-3 py-2"
            :class="line.highlight ? 'bg-accent font-medium' : ''"
          >
            <span class="text-muted-foreground w-10 shrink-0 tabular-nums">{{
              line.minute
            }}</span>
            <span class="flex-1">{{ line.text }}</span>
          </li>
        </ul>
      </template>
    </template>

    <template v-else-if="mainTab === 'H2H'">
      <h3
        class="bg-muted text-muted-foreground px-3 py-1.5 text-xs font-semibold uppercase"
      >
        Pertemuan terakhir
      </h3>
      <p
        v-if="match.headToHead.length === 0"
        class="text-muted-foreground p-4 text-sm"
      >
        Belum ada pertemuan sebelumnya.
      </p>
      <ul v-else class="divide-y text-sm">
        <li
          v-for="game in match.headToHead"
          :key="game.date"
          class="flex items-center gap-3 px-3 py-2"
        >
          <span class="text-muted-foreground w-24 shrink-0 tabular-nums">{{
            game.date
          }}</span>
          <span class="flex-1">{{ game.label }}</span>
          <span class="font-semibold tabular-nums">{{ game.score }}</span>
        </li>
      </ul>
    </template>

    <template v-else-if="mainTab === 'Peluang'">
      <h3
        class="bg-muted text-muted-foreground px-3 py-1.5 text-xs font-semibold uppercase"
      >
        Peluang 1X2
      </h3>
      <p class="text-muted-foreground px-3 pt-2 text-xs">
        Angka dummy untuk tampilan, bukan peluang sungguhan.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bandar</TableHead>
            <TableHead class="text-right">1</TableHead>
            <TableHead class="text-right">X</TableHead>
            <TableHead class="text-right">2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in match.odds" :key="row.bookmaker">
            <TableCell>{{ row.bookmaker }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.home.toFixed(2)
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.draw.toFixed(2)
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              row.away.toFixed(2)
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>

    <NewsList v-else :items="news" />
  </div>
</template>
