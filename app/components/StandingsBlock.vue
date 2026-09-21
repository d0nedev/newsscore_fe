<script setup lang="ts">
import type { League, Match } from "~/types/match";
import { standingsByScope, type StandingsScope } from "~/utils/standings";

const props = defineProps<{ league: League; matches: Match[] }>();

const scopes: StandingsScope[] = ["Keseluruhan", "Kandang", "Tandang"];
const scope = ref<StandingsScope>("Keseluruhan");

const rows = computed(() =>
  standingsByScope(props.league.standings, props.matches, scope.value),
);
</script>

<template>
  <section class="space-y-2">
    <div class="flex flex-wrap gap-2">
      <Badge class="rounded-full px-3 py-1 text-xs uppercase">Klasemen</Badge>
      <Badge
        variant="outline"
        class="text-muted-foreground rounded-full px-3 py-1 text-xs uppercase"
        >Pola</Badge
      >
    </div>

    <PillTabs
      v-model="scope"
      :items="scopes"
      fill
      label="Cakupan klasemen"
    />

    <StandingsTable :rows="rows" :total="league.standings.length" />
  </section>
</template>
