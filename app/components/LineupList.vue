<script setup lang="ts">
import { User } from "@lucide/vue";
import type { LineupPlayer } from "~/types/match";
import type { PlayerMarks } from "~/utils/lineup";

defineProps<{ players: LineupPlayer[]; marks?: Map<string, PlayerMarks> }>();
</script>

<template>
  <ul class="space-y-1 text-sm">
    <li
      v-for="player in players"
      :key="player.playerId ?? player.name"
      class="flex items-center gap-2"
    >
      <span class="text-muted-foreground w-6 text-right font-score">{{
        player.number || ""
      }}</span>
      <img
        v-if="player.photo"
        :src="player.photo"
        alt=""
        aria-hidden="true"
        loading="lazy"
        class="bg-muted size-6 shrink-0 rounded-full object-cover"
      />
      <User
        v-else
        class="text-muted-foreground bg-muted size-6 shrink-0 rounded-full p-1"
        aria-hidden="true"
      />
      <NuxtLink
        v-if="player.playerId"
        :to="`/pemain/${player.playerId}`"
        class="truncate hover:underline"
        >{{ player.name }}</NuxtLink
      >
      <span v-else class="truncate">{{ player.name }}</span>
      <PlayerMarkIcons :marks="marks?.get(player.name)" class="shrink-0" />
      <RatingBadge
        v-if="player.rating"
        :rating="player.rating"
        class="ml-auto shrink-0"
      />
    </li>
  </ul>
</template>
