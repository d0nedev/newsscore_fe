<script setup lang="ts">
import type { StandingRow } from "~/types/match";

const props = withDefaults(
  defineProps<{ rows: StandingRow[]; legend?: boolean; total?: number }>(),
  { legend: true, total: undefined },
);

// Qualification zones are keyed off the full table size, so a sliced preview
// still colours its rows the same way the complete standings would.
const size = computed(() => props.total ?? props.rows.length);

const zone = (position: number) => {
  if (position <= 4) return "champions";
  if (position === 5) return "europa";
  if (position > size.value - 3) return "relegation";
  return null;
};

const zoneColor: Record<string, string> = {
  champions: "bg-sky-700 text-white",
  europa: "bg-rose-800 text-white",
  relegation: "bg-destructive text-white",
};

const legendItems = [
  { color: "bg-sky-700", text: "Promosi - Liga Champions (Fase Liga)" },
  { color: "bg-rose-800", text: "Promosi - Europa League (Fase Liga)" },
  { color: "bg-destructive", text: "Degradasi - Championship" },
];
</script>

<template>
  <Card class="overflow-hidden py-0">
    <CardContent class="px-0">
      <Table class="text-sm">
        <TableHeader>
          <TableRow class="text-muted-foreground text-xs uppercase">
            <TableHead class="w-10 pl-3">#</TableHead>
            <TableHead>Tim</TableHead>
            <TableHead class="w-9 text-center">MP</TableHead>
            <TableHead class="w-9 text-center">M</TableHead>
            <TableHead class="w-9 text-center">S</TableHead>
            <TableHead class="w-9 text-center">K</TableHead>
            <TableHead class="w-14 text-center">G</TableHead>
            <TableHead class="w-10 text-center">SG</TableHead>
            <TableHead class="w-10 text-center">PTS</TableHead>
            <TableHead class="w-28">Pola</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.teamId">
            <TableCell class="pl-3">
              <span
                class="grid size-5 place-items-center rounded text-[11px] font-bold tabular-nums"
                :class="
                  zone(row.position)
                    ? zoneColor[zone(row.position)!]
                    : 'text-muted-foreground'
                "
                >{{ row.position }}</span
              >
            </TableCell>
            <TableCell>
              <NuxtLink
                :to="`/tim/${row.teamId}`"
                class="hover:text-primary flex min-w-0 items-center gap-2"
              >
                <TeamBadge :badge="row.team.slice(0, 2).toUpperCase()" />
                <span class="truncate">{{ row.team }}</span>
              </NuxtLink>
            </TableCell>
            <TableCell class="text-center tabular-nums">{{
              row.played
            }}</TableCell>
            <TableCell class="text-center tabular-nums">{{
              row.won
            }}</TableCell>
            <TableCell class="text-center tabular-nums">{{
              row.drawn
            }}</TableCell>
            <TableCell class="text-center tabular-nums">{{
              row.lost
            }}</TableCell>
            <TableCell class="text-center tabular-nums">
              {{ row.goalsFor }}:{{ row.goalsAgainst }}
            </TableCell>
            <TableCell class="text-center tabular-nums">
              {{ row.goalsFor - row.goalsAgainst }}
            </TableCell>
            <TableCell class="text-center font-bold tabular-nums">
              {{ row.points }}
            </TableCell>
            <TableCell>
              <span class="flex gap-0.5">
                <ResultBadge
                  v-for="(result, i) in row.form"
                  :key="i"
                  :result="result"
                />
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-if="legend" class="text-muted-foreground space-y-1 p-3 text-xs">
        <p
          v-for="item in legendItems"
          :key="item.text"
          class="flex items-center gap-2"
        >
          <span class="size-2 rounded-full" :class="item.color" />
          {{ item.text }}
        </p>
        <p class="pt-2">
          Jika ada lebih dari satu tim yang menyelesaikan musim dengan poin yang
          sama, perbedaan jumlah gol yang akan jadi penentu peringkat yang lebih
          tinggi.
        </p>
      </div>
    </CardContent>
  </Card>
</template>
