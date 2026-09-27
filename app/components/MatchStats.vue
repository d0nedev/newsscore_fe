<script setup lang="ts">
import type { MatchStat } from "~/types/match";

defineProps<{ stats: MatchStat[] }>();
</script>

<template>
  <ul class="divide-y">
    <MatchStatRow v-for="stat in stats" :key="stat.label" :stat="stat" />
  </ul>
</template>
