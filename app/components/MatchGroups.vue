<script setup lang="ts">
import { findLeague } from "~/data/leagues";
import type { Match } from "~/types/match";

const props = defineProps<{
  matches: Match[];
  perspectiveTeamId?: string;
}>();

// Competition blocks appear in the order their first match does, so the list
// reads chronologically even when a team switches between league and cup.
const groups = computed(() => {
  const byLeague = new Map<string, Match[]>();
  for (const match of props.matches) {
    const bucket = byLeague.get(match.leagueId);
    if (bucket) bucket.push(match);
    else byLeague.set(match.leagueId, [match]);
  }
  return [...byLeague].map(([leagueId, matches]) => {
    const league = findLeague(leagueId);
    return {
      leagueId,
      matches,
      name: league?.name ?? leagueId,
      country: league?.country ?? "Dunia",
      hasStandings: (league?.standings.length ?? 0) > 0,
    };
  });
});
</script>

<template>
  <div>
    <MatchList
      v-for="group in groups"
      :key="group.leagueId"
      :title="group.name"
      :subtitle="group.country"
      :league-id="group.leagueId"
      :link-label="group.hasStandings ? 'Klasemen' : 'Penarikan'"
      :perspective-team-id="perspectiveTeamId"
      :matches="group.matches"
    />
  </div>
</template>
