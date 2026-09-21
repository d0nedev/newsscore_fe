<script setup lang="ts">
import type { PlayerMatchLogEntry } from "~/types/match";

defineProps<{ entries: PlayerMatchLogEntry[]; goalkeeper?: boolean }>();
</script>

<template>
  <Table class="text-sm">
    <TableHeader>
      <TableRow class="text-muted-foreground text-xs">
        <TableHead class="w-20 pl-4">Tanggal</TableHead>
        <TableHead class="w-16">Komp.</TableHead>
        <TableHead>Pertandingan</TableHead>
        <TableHead class="w-10 text-center">Skor</TableHead>
        <TableHead class="w-12 text-center">Nilai</TableHead>
        <TableHead class="w-12 text-center">Menit</TableHead>
        <TableHead class="w-24 text-center">
          {{ goalkeeper ? "Penyelamatan" : "Kontribusi" }}
        </TableHead>
        <TableHead class="w-8 text-center" title="Kartu kuning">KK</TableHead>
        <TableHead class="w-8 text-center" title="Kartu merah">KM</TableHead>
        <TableHead class="w-10 pr-4 text-center">Hasil</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="entry in entries" :key="entry.date + entry.home">
        <TableCell class="text-muted-foreground pl-4 tabular-nums">
          {{ entry.date }}
        </TableCell>
        <TableCell>
          <span class="flex items-center gap-1.5">
            <CountryChip :country="entry.country" />
            <span class="text-xs font-semibold">{{ entry.competition }}</span>
          </span>
        </TableCell>
        <TableCell>
          <component
            :is="entry.matchId ? 'NuxtLink' : 'span'"
            :to="entry.matchId ? `/pertandingan/${entry.matchId}` : undefined"
            class="block min-w-0 leading-tight"
            :class="entry.matchId ? 'hover:text-primary' : ''"
          >
            <span class="block truncate">{{ entry.home }}</span>
            <span class="block truncate">{{ entry.away }}</span>
          </component>
        </TableCell>
        <TableCell class="text-center leading-tight font-bold tabular-nums">
          <span class="block">{{ entry.score[0] }}</span>
          <span class="block">{{ entry.score[1] }}</span>
        </TableCell>

        <!-- A player who did not take the field replaces every stat column. -->
        <TableCell
          v-if="entry.note"
          colspan="5"
          class="text-muted-foreground text-center text-xs uppercase"
        >
          {{ entry.note }}
        </TableCell>
        <template v-else>
          <TableCell class="text-center">
            <RatingBadge :rating="entry.rating" />
          </TableCell>
          <TableCell class="text-muted-foreground text-center tabular-nums">
            <template v-if="entry.minutes">{{ entry.minutes }}'</template>
          </TableCell>
          <TableCell class="text-center tabular-nums">
            {{ entry.detail ?? "-" }}
          </TableCell>
          <TableCell class="text-center tabular-nums">
            {{ entry.yellow || 0 }}
          </TableCell>
          <TableCell class="text-center tabular-nums">
            {{ entry.red || 0 }}
          </TableCell>
        </template>

        <TableCell class="pr-4 text-center">
          <ResultBadge :result="entry.outcome" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
