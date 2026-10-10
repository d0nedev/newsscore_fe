<script setup lang="ts">
import { User } from "@lucide/vue";
import type { TopPlayer } from "~/composables/useApi";

const props = defineProps<{ category: string; players: TopPlayer[] }>();

// SofaScore's keys; anything unlisted shows its key split into words.
const LABELS: Record<string, string> = {
  goals: "Top skor",
  assists: "Assist terbanyak",
  goalsAssistsSum: "Gol + assist",
  rating: "Rating terbaik",
  yellowCards: "Kartu kuning",
  redCards: "Kartu merah",
  cleanSheet: "Clean sheet",
  saves: "Penyelamatan",
  totalShots: "Tembakan",
  shotsOnTarget: "Tembakan tepat sasaran",
  bigChancesCreated: "Peluang emas tercipta",
  keyPasses: "Umpan kunci",
  successfulDribbles: "Dribel sukses",
  tackles: "Tekel",
  interceptions: "Intersepsi",
};
const title = computed(
  () =>
    LABELS[props.category] ??
    props.category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase()),
);

const PREVIEW = 10;
const showAll = ref(false);
const shown = computed(() =>
  showAll.value ? props.players : props.players.slice(0, PREVIEW),
);
const format = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
</script>

<template>
  <SectionCard
    :card="`pemain-terbaik-${category}`"
    :title="title"
    :empty="players.length ? undefined : 'Belum ada data.'"
    :more-label="
      !showAll && players.length > PREVIEW
        ? 'Tampilkan pemain lainnya'
        : undefined
    "
    @more="showAll = true"
  >
    <ol class="divide-y border-t text-sm">
      <li
        v-for="player in shown"
        :key="player.playerId"
        class="flex items-center gap-3 px-4 py-2"
      >
        <span class="text-muted-foreground w-5 text-right font-score">{{
          player.rank
        }}</span>
        <img
          v-if="player.photo"
          :src="player.photo"
          alt=""
          aria-hidden="true"
          loading="lazy"
          class="bg-muted size-7 shrink-0 rounded-full object-cover"
        />
        <User
          v-else
          class="text-muted-foreground bg-muted size-7 shrink-0 rounded-full p-1.5"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <NuxtLink
            :to="`/pemain/${player.playerId}`"
            class="hover:text-primary block truncate font-semibold"
            >{{ player.name }}</NuxtLink
          >
          <NuxtLink
            v-if="player.teamId"
            :to="`/tim/${player.teamId}`"
            class="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs"
          >
            <TeamBadge :badge="player.badge ?? ''" :logo="player.logo" />
            <span class="truncate">{{ player.team }}</span>
          </NuxtLink>
        </div>
        <span class="font-score text-base font-bold">{{
          format(player.value)
        }}</span>
      </li>
    </ol>
  </SectionCard>
</template>
