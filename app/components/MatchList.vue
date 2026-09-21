<script setup lang="ts">
import { ChevronDown, ChevronUp, Pin, Star } from "@lucide/vue";
import type { Match } from "~/types/match";

const props = defineProps<{
  title?: string;
  subtitle?: string;
  leagueId?: string;
  /** Link label on the right of the header bar: standings, or a cup bracket. */
  linkLabel?: string;
  perspectiveTeamId?: string;
  matches: Match[];
}>();

const open = ref(true);
const starred = ref(false);

// A section header only offers a pin when it stands for a real competition.
const { isPinned, toggle } = usePinnedLeagues();
const pinned = computed(() => isPinned(props.leagueId));
</script>

<template>
  <section class="mb-2">
    <div
      v-if="title"
      class="bg-league-header flex items-center gap-2 px-2 py-1.5 text-sm"
    >
      <Button
        variant="ghost"
        size="icon"
        class="size-6"
        :class="starred ? 'text-primary' : 'text-muted-foreground'"
        :aria-pressed="starred"
        :aria-label="`Ikuti ${title}`"
        @click="starred = !starred"
      >
        <Star :fill="starred ? 'currentColor' : 'none'" />
      </Button>
      <CountryChip v-if="subtitle" :country="subtitle" />
      <h2 class="min-w-0 truncate font-bold">
        <span v-if="subtitle" class="uppercase">{{ subtitle }}:</span>
        {{ title }}
      </h2>
      <Button
        v-if="leagueId"
        variant="ghost"
        size="icon"
        class="size-6 shrink-0"
        :class="pinned ? 'text-sky-600' : 'text-muted-foreground'"
        :aria-pressed="pinned"
        :aria-label="
          pinned ? `Lepas sematan ${title}` : `Sematkan ${title}`
        "
        @click="toggle(leagueId)"
      >
        <Pin :fill="pinned ? 'currentColor' : 'none'" />
      </Button>
      <NuxtLink
        v-if="leagueId"
        :to="`/sepak-bola/${leagueId}`"
        class="hover:text-primary ml-auto text-xs underline"
        >{{ linkLabel ?? "Klasemen" }}</NuxtLink
      >
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground size-6"
        :class="leagueId ? '' : 'ml-auto'"
        :aria-expanded="open"
        :aria-label="open ? 'Sembunyikan' : 'Tampilkan'"
        @click="open = !open"
      >
        <ChevronUp v-if="open" />
        <ChevronDown v-else />
      </Button>
    </div>
    <p v-if="matches.length === 0" class="text-muted-foreground p-4 text-sm">
      Belum ada pertandingan.
    </p>
    <ul v-else-if="open" class="divide-y border-b">
      <li v-for="match in matches" :key="match.id">
        <MatchRow :match="match" :perspective-team-id="perspectiveTeamId" />
      </li>
    </ul>
  </section>
</template>
