<script setup lang="ts">
import type { Match } from "~/types/match";

// Shows the first bookmaker per match; the detail page lists all of them.
const props = defineProps<{ title?: string; matches: Match[] }>();

const rows = computed(() =>
  props.matches.flatMap((match) => {
    const odds = match.odds?.[0];
    return odds ? [{ match, odds }] : [];
  }),
);
</script>

<template>
  <Card class="gap-0 overflow-hidden py-0">
    <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
      <CardTitle as="h2" class="text-sm">{{
        title ?? "Peluang 1X2"
      }}</CardTitle>
      <CardDescription class="text-xs">
        Angka dummy untuk tampilan, bukan peluang sungguhan.
      </CardDescription>
    </CardHeader>
    <CardContent class="px-0">
      <p v-if="rows.length === 0" class="text-muted-foreground p-4 text-sm">
        Belum ada peluang.
      </p>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Pertandingan</TableHead>
            <TableHead class="text-right">1</TableHead>
            <TableHead class="text-right">X</TableHead>
            <TableHead class="text-right">2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="{ match, odds } in rows" :key="match.id">
            <TableCell>
              <NuxtLink
                :to="`/pertandingan/${match.id}`"
                class="hover:underline"
              >
                {{ match.home.name }} - {{ match.away.name }}
              </NuxtLink>
              <span class="text-muted-foreground block text-xs"
                >{{ match.date }} · {{ match.time }}</span
              >
            </TableCell>
            <TableCell class="text-right tabular-nums">{{
              odds.home.toFixed(2)
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              odds.draw.toFixed(2)
            }}</TableCell>
            <TableCell class="text-right tabular-nums">{{
              odds.away.toFixed(2)
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
