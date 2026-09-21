<script setup lang="ts">
import { Star } from "@lucide/vue";
import type { Match } from "~/types/match";

const props = defineProps<{ match: Match; league?: string }>();

const starred = ref(false);

const label = computed(() => {
  if (props.match.status === "live") return props.match.time;
  if (props.match.status === "finished") return "SELESAI";
  return props.match.time;
});
</script>

<template>
  <div class="hover:bg-muted/60 flex items-center gap-3 px-3 py-3">
    <span class="w-16 shrink-0 text-xs">
      <span
        class="block font-bold"
        :class="match.status === 'live' ? 'text-primary' : 'text-foreground'"
      >
        {{ label }}
      </span>
      <span class="text-muted-foreground block truncate">{{ league }}</span>
    </span>

    <NuxtLink
      :to="`/pertandingan/${match.id}`"
      class="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-3"
    >
      <span class="flex min-w-0 items-center justify-end gap-2 text-right">
        <span class="truncate font-semibold">{{ match.home.name }}</span>
        <TeamBadge :badge="match.home.badge" />
      </span>

      <span
        class="w-16 text-center font-bold tabular-nums"
        :class="match.status === 'live' ? 'text-primary' : ''"
      >
        <template v-if="match.score">
          {{ match.score[0] }} - {{ match.score[1] }}
        </template>
        <template v-else>VS</template>
      </span>

      <span class="flex min-w-0 items-center gap-2">
        <TeamBadge :badge="match.away.badge" />
        <span class="truncate font-semibold">{{ match.away.name }}</span>
      </span>
    </NuxtLink>

    <Button
      variant="ghost"
      size="icon"
      class="size-7 shrink-0"
      :class="starred ? 'text-primary' : 'text-muted-foreground/50'"
      :aria-pressed="starred"
      :aria-label="`Ikuti ${match.home.name} - ${match.away.name}`"
      @click="starred = !starred"
    >
      <Star :fill="starred ? 'currentColor' : 'none'" />
    </Button>
  </div>
</template>
