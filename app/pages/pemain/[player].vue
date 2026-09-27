<script setup lang="ts">
import { Star } from "@lucide/vue";
import { slugify } from "~/utils/slug";

const route = useRoute();
const playerQuery = usePlayer(() => String(route.params.player));
const player = computed(() => playerQuery.data.value);
const team = computed(() => player.value?.team);
const name = computed(() => player.value?.name ?? "");
const { countries } = useCompetitions();
useHead(() => ({ title: name.value || "Pemain" }));

const crumbs = computed(() => [
  { label: "Sepak Bola", to: "/" },
  ...(player.value?.country
    ? [
        {
          label: player.value.country ?? "",
          country: player.value.country,
          to: countries.value.includes(player.value.country ?? "")
            ? `/negara/${slugify(player.value.country)}`
            : undefined,
        },
      ]
    : []),
  ...(team.value
    ? [{ label: team.value.name, to: `/tim/${team.value.id}` }]
    : []),
]);

const position = computed(() => player.value?.position ?? "");
const age = computed(() => player.value?.age);
const season = computed(() => player.value?.season);

const matchLog = computed(() => player.value?.matchLog ?? []);
const career = computed(() => player.value?.career ?? []);
const transfers = computed(() => player.value?.transfers ?? []);
const injuries = computed(() => player.value?.injuries ?? []);

const tabs = computed(() => [
  "Ringkasan",
  ...(transfers.value.length ? ["Transfer"] : []),
  ...(injuries.value.length ? ["Sejarah Cedera"] : []),
]);
const tab = ref("Ringkasan");

const MATCH_PREVIEW = 5;
const TRANSFER_PREVIEW = 3;
const INJURY_PREVIEW = 3;
const showAllMatches = ref(false);
const showAllTransfers = ref(false);
const showAllInjuries = ref(false);
const matchPreview = computed(() =>
  showAllMatches.value
    ? matchLog.value
    : matchLog.value.slice(0, MATCH_PREVIEW),
);
const transferPreview = computed(() =>
  showAllTransfers.value
    ? transfers.value
    : transfers.value.slice(0, TRANSFER_PREVIEW),
);
const injuryPreview = computed(() =>
  showAllInjuries.value
    ? injuries.value
    : injuries.value.slice(0, INJURY_PREVIEW),
);

const followed = ref(false);
</script>

<template>
  <ErrorState
    v-if="playerQuery.error.value && !isNotFound(playerQuery.error.value)"
    :error="playerQuery.error.value"
    @retry="playerQuery.refetch()"
  />
  <NotFoundCard
    v-else-if="playerQuery.error.value"
    message="Pemain tidak ditemukan."
  />

  <div v-else-if="name" class="space-y-4">
    <PageHeader :crumbs="crumbs" :title="name" icon="user">
      <template #actions>
        <Button
          variant="ghost"
          size="icon"
          class="size-6 shrink-0"
          :class="followed ? 'text-primary' : 'text-muted-foreground'"
          :aria-pressed="followed"
          :aria-label="`Ikuti ${name}`"
          @click="followed = !followed"
        >
          <Star :fill="followed ? 'currentColor' : 'none'" />
        </Button>
      </template>

      <template #meta>
        <p class="text-muted-foreground mt-1 text-sm">
          {{ position }}
          <template v-if="team">
            (<NuxtLink :to="`/tim/${team.id}`" class="hover:text-primary">{{
              team.name
            }}</NuxtLink
            >)
          </template>
        </p>
        <MetaLine label="Usia">
          <span class="tabular-nums">{{ age }}</span>
          <template v-if="player?.birthDate">
            ({{ player.birthDate }})</template
          >
        </MetaLine>
        <MetaLine v-if="player?.marketValue" label="Nilai pasar">
          {{ player.marketValue }}
        </MetaLine>
        <MetaLine v-if="player?.contractUntil" label="Kontrak berakhir">
          {{ player.contractUntil }}
        </MetaLine>
      </template>

      <template #aside>
        <CrestBox
          v-if="team"
          :to="`/tim/${team.id}`"
          :label="team.name"
          icon="shield"
          class="hidden sm:grid"
        />
      </template>
    </PageHeader>

    <TabNav v-if="player" v-model="tab" :tabs="tabs" />

    <template v-if="tab === 'Ringkasan'">
      <SectionCard v-if="season" title="Statistik musim ini" :flush="false">
        <div class="grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
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
        </div>
      </SectionCard>

      <SectionCard
        v-if="matchLog.length"
        title="Pertandingan terakhir"
        scroll
        :more-label="
          !showAllMatches && matchLog.length > MATCH_PREVIEW
            ? 'Tampilkan pertandingan lainnya'
            : undefined
        "
        @more="showAllMatches = true"
      >
        <PlayerMatchLog
          :entries="matchPreview"
          :goalkeeper="player?.goalkeeper"
        />
      </SectionCard>

      <SectionCard v-if="career.length" title="Karir" scroll>
        <PlayerCareer :rows="career" :goalkeeper="player?.goalkeeper" />
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
        <PlayerTransfers :transfers="transferPreview" />
      </SectionCard>

      <SectionCard
        v-if="injuries.length"
        title="Sejarah cedera"
        :more-label="
          !showAllInjuries && injuries.length > INJURY_PREVIEW
            ? 'Tampilkan lainnya'
            : undefined
        "
        @more="showAllInjuries = true"
      >
        <PlayerInjuries :injuries="injuryPreview" />
      </SectionCard>

      <p v-if="player" class="text-muted-foreground px-4 text-center text-xs">
        Catatan: data sejarah yang ditampilkan dapat saja tidak lengkap.
      </p>
    </template>

    <SectionCard
      v-else-if="tab === 'Transfer'"
      title="Transfer"
      scroll
      :empty="transfers.length ? undefined : 'Belum ada transfer.'"
    >
      <PlayerTransfers :transfers="transfers" />
    </SectionCard>

    <SectionCard v-else title="Sejarah cedera">
      <PlayerInjuries :injuries="injuries" />
    </SectionCard>
  </div>
</template>
