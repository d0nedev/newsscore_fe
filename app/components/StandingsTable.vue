<script setup lang="ts">
import type { StandingRow } from "~/types/match";

defineProps<{ rows: StandingRow[] }>();

const formColor = {
  W: "bg-emerald-500 text-white",
  D: "bg-muted-foreground text-white",
  L: "bg-destructive text-white",
};
</script>

<template>
  <Card class="overflow-hidden py-0">
    <CardContent class="px-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tim</TableHead>
            <TableHead class="text-center">M</TableHead>
            <TableHead class="text-center">M-S-K</TableHead>
            <TableHead class="text-center">Gol</TableHead>
            <TableHead class="text-center">Poin</TableHead>
            <TableHead>Performa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.teamId">
            <TableCell class="text-muted-foreground tabular-nums">
              {{ row.position }}
            </TableCell>
            <TableCell>
              <NuxtLink :to="`/tim/${row.teamId}`" class="hover:underline">
                {{ row.team }}
              </NuxtLink>
            </TableCell>
            <TableCell class="text-center tabular-nums">{{
              row.played
            }}</TableCell>
            <TableCell class="text-center tabular-nums">
              {{ row.won }}-{{ row.drawn }}-{{ row.lost }}
            </TableCell>
            <TableCell class="text-center tabular-nums">
              {{ row.goalsFor }}:{{ row.goalsAgainst }}
            </TableCell>
            <TableCell class="text-center font-semibold tabular-nums">
              {{ row.points }}
            </TableCell>
            <TableCell>
              <span class="flex gap-0.5">
                <Badge
                  v-for="(result, i) in row.form"
                  :key="i"
                  class="size-4 justify-center rounded-sm p-0 text-[10px] font-bold"
                  :class="formColor[result]"
                  :title="result"
                  >{{ result }}</Badge
                >
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
