<script setup lang="ts">
import { Star, Tv } from "@lucide/vue";
import { slugify } from "~/utils/slug";

const route = useRoute();
const matchQuery = useMatch(() => String(route.params.match));
const match = computed(() => matchQuery.data.value);
const { findLeague } = useCompetitions();
const { data: news } = useNews(() => ({ matchId: String(route.params.match) }));
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
  ...(match.value?.headToHead.length ? ["H2H"] : []),
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

const crumbs = computed(() => [
  { label: "Sepak Bola", to: "/" },
  ...(league.value
    ? [
        {
          label: league.value.country,
          country: league.value.country,
          to: `/negara/${slugify(league.value.country)}`,
        },
        {
          label: `${league.value.name} - ${match.value?.round ?? ""}`,
          to: `/sepak-bola/${league.value.id}`,
        },
      ]
    : []),
]);

const starred = ref({ home: false, away: false });

const headerCardId = useCardId("papan-skor");
</script>

<template>
  <ErrorState
    v-if="matchQuery.error.value && !isNotFound(matchQuery.error.value)"
    :error="matchQuery.error.value"
    @retry="matchQuery.refetch()"
  />
  <NotFoundCard
    v-else-if="matchQuery.error.value"
    message="Pertandingan tidak ditemukan."
  />

  <div v-else-if="match" class="space-y-4">
    <Card :data-card="headerCardId" class="gap-0 overflow-hidden py-0">
      <AppBreadcrumb :items="crumbs" />

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
            <CrestBox :initials="match[side].badge" :logo="match[side].logo" />
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

      <div class="p-3">
        <PillTabs
          :items="subTabs"
          :model-value="mainTab === 'Pertandingan' ? subTab : ''"
          variant="tabs"
          id-prefix="detail"
          label="Detail pertandingan"
          @update:model-value="openDetail"
        />
      </div>
    </Card>

    <div
      v-if="mainTab === 'Pertandingan'"
      :id="tabPanelId('detail', subTab)"
      role="tabpanel"
      :aria-labelledby="tabId('detail', subTab)"
      tabindex="0"
      class="space-y-4"
    >
      <template v-if="subTab === 'Ringkasan'">
        <SectionCard title="Jalannya pertandingan">
          <MatchEvents :match="match" />
        </SectionCard>

        <SectionCard
          v-if="match.stats.length"
          card="ringkasan-statistik"
          title="Statistik"
        >
          <MatchStats :stats="match.stats.slice(0, 5)" />
        </SectionCard>

        <SectionCard v-if="match.broadcasters?.length" title="Chanel televisi">
          <p class="flex items-center gap-2 px-4 pb-3 text-sm">
            <Tv class="text-muted-foreground size-4" />
            {{ match.broadcasters.join(", ") }}
          </p>
        </SectionCard>

        <SectionCard title="Informasi pertandingan">
          <MatchInfo :match="match" />
        </SectionCard>
      </template>

      <SectionCard
        v-else-if="subTab === 'Statistik'"
        title="Statistik"
        :empty="match.stats.length ? undefined : 'Statistik belum tersedia.'"
      >
        <MatchStats :stats="match.stats" />
      </SectionCard>

      <SectionCard
        v-else-if="subTab === 'Susunan Pemain'"
        title="Susunan pemain"
        :empty="
          match.lineups.home.length
            ? undefined
            : 'Susunan pemain belum diumumkan.'
        "
      >
        <div class="grid sm:grid-cols-2 sm:divide-x">
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
      </SectionCard>

      <SectionCard
        v-else-if="subTab === 'Statistik Pemain'"
        title="Statistik pemain"
        scroll
      >
        <Table>
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
              <TableCell class="text-right">
                <RatingBadge :rating="row.rating" />
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
      </SectionCard>

      <SectionCard v-else title="Komentar langsung">
        <ul class="divide-y border-t text-sm">
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
      </SectionCard>
    </div>

    <SectionCard
      v-else-if="mainTab === 'H2H'"
      title="Pertemuan terakhir"
      :empty="
        match.headToHead.length ? undefined : 'Belum ada pertemuan sebelumnya.'
      "
    >
      <ul class="divide-y border-t text-sm">
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
    </SectionCard>

    <SectionCard v-else-if="mainTab === 'Peluang'" title="Peluang 1X2">
      <p class="text-muted-foreground px-4 pb-2 text-xs">
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
    </SectionCard>

    <NewsList v-if="mainTab === 'Berita'" :items="news ?? []" />
  </div>
</template>
