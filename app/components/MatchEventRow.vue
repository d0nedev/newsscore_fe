<script setup lang="ts">
import type { MatchEvent } from "~/types/match";

const props = defineProps<{ event: MatchEvent; score?: string }>();

// Second line: the assist for a goal, "Keluar: …" for a substitution.
const detail = computed(() => {
  if (props.event.type === "sub") {
    return (
      props.event.note ??
      (props.event.assist ? `Keluar: ${props.event.assist}` : undefined)
    );
  }
  if (props.event.assist) return `Assist: ${props.event.assist}`;
  return props.event.note;
});
</script>

<template>
  <!-- Home events sit left of the minute, away events right of it. -->
  <li
    class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-1 text-sm"
  >
    <div
      v-for="side in ['home', 'away'] as const"
      :key="side"
      class="flex min-w-0 items-center gap-2"
      :class="
        side === 'home' ? 'order-1 flex-row-reverse text-right' : 'order-3'
      "
    >
      <template v-if="event.team === side">
        <MatchEventIcon :type="event.type" />
        <span
          v-if="score"
          class="bg-muted shrink-0 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums"
          >{{ score }}</span
        >
        <span class="min-w-0">
          <span class="block truncate font-semibold">{{ event.player }}</span>
          <span
            v-if="detail"
            class="text-muted-foreground block truncate text-xs"
            >{{ detail }}</span
          >
        </span>
      </template>
    </div>

    <span
      class="text-muted-foreground order-2 w-10 text-center text-xs tabular-nums"
    >
      {{ event.minuteLabel ?? `${event.minute}'` }}
    </span>
  </li>
</template>
