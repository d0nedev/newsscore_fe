<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import type { PlayerProfile } from "~/types/match";

defineProps<{ transfers: PlayerProfile["transfers"] }>();
</script>

<template>
  <Table class="text-sm">
    <TableHeader>
      <TableRow class="text-muted-foreground text-xs uppercase">
        <TableHead class="w-28 pl-4">Tanggal</TableHead>
        <TableHead>Dari</TableHead>
        <TableHead class="w-40">Tipe</TableHead>
        <TableHead>Ke</TableHead>
        <TableHead class="pr-4 text-right">Biaya</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="transfer in transfers" :key="transfer.season + transfer.to">
        <TableCell class="text-muted-foreground pl-4 tabular-nums">
          {{ transfer.date ?? transfer.season }}
        </TableCell>
        <TableCell>
          <span class="flex min-w-0 items-center gap-2">
            <TeamBadge :badge="transfer.from.slice(0, 2).toUpperCase()" />
            <span class="truncate">{{ transfer.from }}</span>
          </span>
        </TableCell>
        <TableCell>
          <span
            class="text-muted-foreground flex items-center gap-2 text-xs uppercase"
          >
            <ArrowRight class="size-3.5 shrink-0 text-emerald-600" />
            {{ transfer.type ?? "Transfer" }}
          </span>
        </TableCell>
        <TableCell>
          <span class="flex min-w-0 items-center gap-2 font-semibold">
            <TeamBadge :badge="transfer.to.slice(0, 2).toUpperCase()" />
            <span class="truncate">{{ transfer.to }}</span>
          </span>
        </TableCell>
        <TableCell class="text-muted-foreground pr-4 text-right tabular-nums">
          {{ transfer.fee }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
