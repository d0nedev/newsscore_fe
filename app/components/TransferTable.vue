<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import type { TeamTransfer } from "~/types/match";

defineProps<{ transfers: TeamTransfer[] }>();
</script>

<template>
  <Table class="text-sm">
    <TableHeader>
      <TableRow class="text-muted-foreground text-xs uppercase">
        <TableHead class="w-28 pl-4">Tanggal</TableHead>
        <TableHead>Pemain</TableHead>
        <TableHead>Dari / Ke</TableHead>
        <TableHead class="pr-4 text-right">Biaya</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="transfer in transfers" :key="transfer.date + transfer.player">
        <TableCell class="text-muted-foreground pl-4 tabular-nums">
          {{ transfer.date }}
        </TableCell>
        <TableCell>
          <span class="flex items-center gap-2 font-semibold">
            <ArrowRight
              class="size-3.5 shrink-0"
              :class="
                transfer.direction === 'in'
                  ? 'text-emerald-600'
                  : 'text-destructive rotate-180'
              "
              :aria-label="transfer.direction === 'in' ? 'Masuk' : 'Keluar'"
            />
            <span class="truncate">{{ transfer.player }}</span>
          </span>
        </TableCell>
        <TableCell>
          <span class="flex items-center gap-2">
            <ArrowRight class="text-muted-foreground size-3.5 shrink-0" />
            <TeamBadge :badge="transfer.club.slice(0, 2).toUpperCase()" />
            <span class="truncate">{{ transfer.club }}</span>
          </span>
        </TableCell>
        <TableCell class="text-muted-foreground pr-4 text-right">
          {{ transfer.fee }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
