<script setup lang="ts">
import { Star } from "@lucide/vue";
import { findLeague } from "~/data/leagues";
import { matchesByTeam } from "~/data/matches";
import { findTeam } from "~/data/teams";
import { slugify } from "~/utils/slug";

const route = useRoute();
const team = computed(() => findTeam(String(route.params.team)));
useHead(() => ({ title: team.value?.name ?? "Tim tidak ditemukan" }));

const league = computed(() =>
  team.value ? findLeague(team.value.leagueId) : undefined,
);
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
          label: league.value.name,
          to: `/sepak-bola/${league.value.id}`,
        },
      ]
    : []),
]);

const tabs = [
  "Ringkasan",
  "Peluang",
  "Hasil Pertandingan",
  "Jadwal Pertandingan",
  "Klasemen",
  "Transfer",
  "Skuad",
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
const transfers = computed(() => team.value?.transfers ?? []);

// The summary tab previews each list; the dedicated tabs show everything.
const PREVIEW = 10;
const TRANSFER_PREVIEW = 5;
const showAllFixtures = ref(false);
const showAllResults = ref(false);
const showAllTransfers = ref(false);
const fixturePreview = computed(() =>
  showAllFixtures.value ? fixtures.value : fixtures.value.slice(0, PREVIEW),
);
const resultPreview = computed(() =>
  showAllResults.value ? results.value : results.value.slice(0, PREVIEW),
);
const transferPreview = computed(() =>
  showAllTransfers.value
    ? transfers.value
    : transfers.value.slice(0, TRANSFER_PREVIEW),
);

const followed = ref(false);
const capacity = new Intl.NumberFormat("id-ID");
</script>

<template>
  <NotFoundCard v-if="!team" message="Tim tidak ditemukan." />

  <div v-else class="space-y-4">
    <PageHeader :crumbs="crumbs" :title="team.name" icon="shield">
      <template #actions>
        <Button
          variant="ghost"
          size="icon"
          class="size-6 shrink-0"
          :class="followed ? 'text-primary' : 'text-muted-foreground'"
          :aria-pressed="followed"
          :aria-label="`Ikuti ${team.name}`"
          @click="followed = !followed"
        >
          <Star :fill="followed ? 'currentColor' : 'none'" />
        </Button>
      </template>

      <template #meta>
        <MetaLine label="Stadion" class="mt-1">
          {{ team.venue }}<template v-if="team.city"> ({{ team.city }})</template>
        </MetaLine>
        <MetaLine label="Kapasitas">
          <span class="tabular-nums">{{ capacity.format(team.capacity) }}</span>
        </MetaLine>
        <MetaLine label="Berdiri">
          <span class="tabular-nums">{{ team.founded }}</span>
        </MetaLine>
      </template>
    </PageHeader>

    <TabNav v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'Ringkasan'">
      <SectionCard
        title="Jadwal"
        :empty="fixtures.length ? undefined : 'Belum ada jadwal.'"
        :more-label="
          !showAllFixtures && fixtures.length > PREVIEW
            ? 'Tampilkan pertandingan lainnya'
            : undefined
        "
        @more="showAllFixtures = true"
      >
        <MatchGroups :matches="fixturePreview" :perspective-team-id="team.id" />
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
        <MatchGroups :matches="resultPreview" :perspective-team-id="team.id" />
      </SectionCard>

      <SectionCard
        v-if="transfers.length"
        title="Transfer"
        scroll
        :more-label="
          !showAllTransfers && transfers.length > TRANSFER_PREVIEW
            ? 'Tampilkan lainnya'
            : undefined
        "
        @more="showAllTransfers = true"
      >
        <TransferTable :transfers="transferPreview" />
      </SectionCard>
    </template>

    <SectionCard
      v-else-if="tab === 'Peluang'"
      title="Peluang"
      :empty="withOdds.length ? undefined : 'Belum ada peluang.'"
    >
      <OddsList :matches="withOdds" />
    </SectionCard>

    <SectionCard
      v-else-if="tab === 'Hasil Pertandingan'"
      title="Hasil"
      :empty="results.length ? undefined : 'Belum ada hasil.'"
    >
      <MatchGroups :matches="results" :perspective-team-id="team.id" />
    </SectionCard>

    <SectionCard
      v-else-if="tab === 'Jadwal Pertandingan'"
      title="Jadwal"
      :empty="fixtures.length ? undefined : 'Belum ada jadwal.'"
    >
      <MatchGroups :matches="fixtures" :perspective-team-id="team.id" />
    </SectionCard>

    <StandingsBlock
      v-else-if="tab === 'Klasemen' && league"
      :league="league"
      :matches="all"
    />

    <SectionCard
      v-else-if="tab === 'Transfer'"
      title="Transfer"
      scroll
      :empty="transfers.length ? undefined : 'Belum ada transfer.'"
    >
      <TransferTable :transfers="transfers" />
    </SectionCard>

    <SectionCard v-else-if="tab === 'Skuad'" title="Skuad" scroll>
      <SquadTable :players="team.squad" />
    </SectionCard>
  </div>
</template>
