<script setup lang="ts">
import type { Match } from "~/types/match";

// Shows the first bookmaker per match; the detail page lists all of them.
const props = defineProps<{ matches: Match[] }>();

const rows = computed(() =>
  props.matches.flatMap((match) => {
    const odds = match.odds?.[0];
    return odds ? [{ match, odds }] : [];
  }),
);
</script>

<template>
  <p class="text-muted-foreground px-4 pb-3 text-xs">
    Peluang bersifat indikatif dan dapat berubah sewaktu-waktu.
  </p>
  <Table class="text-sm">
    <TableHeader>
      <TableRow class="text-muted-foreground text-xs uppercase">
        <TableHead class="pl-4">Pertandingan</TableHead>
        <TableHead class="w-16 text-right">1</TableHead>
        <TableHead class="w-16 text-right">X</TableHead>
        <TableHead class="w-16 pr-4 text-right">2</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="{ match, odds } in rows" :key="match.id">
        <TableCell class="pl-4">
          <NuxtLink
            :to="`/pertandingan/${match.id}`"
            class="hover:text-primary"
          >
            {{ match.home.name }} - {{ match.away.name }}
          </NuxtLink>
          <span class="text-muted-foreground block text-xs"
            >{{ match.date }} &middot; {{ match.time }}</span
          >
        </TableCell>
        <TableCell class="text-right font-score">{{
          odds.home.toFixed(2)
        }}</TableCell>
        <TableCell class="text-right font-score">{{
          odds.draw.toFixed(2)
        }}</TableCell>
        <TableCell class="pr-4 text-right font-score">{{
          odds.away.toFixed(2)
        }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
