<script setup lang="ts">
import { Cross } from "@lucide/vue";
import type { PlayerProfile } from "~/types/match";

defineProps<{ injuries: PlayerProfile["injuries"] }>();
</script>

<template>
  <p v-if="!injuries.length" class="text-muted-foreground p-4 text-sm">
    Tidak ada catatan cedera.
  </p>
  <Table v-else class="text-sm">
    <TableHeader>
      <TableRow class="text-muted-foreground text-xs uppercase">
        <TableHead class="w-28 pl-4">Dari</TableHead>
        <TableHead class="w-28">Hingga</TableHead>
        <TableHead class="pr-4">Cedera</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="injury in injuries" :key="injury.from">
        <TableCell class="text-muted-foreground pl-4 tabular-nums">
          {{ injury.from }}
        </TableCell>
        <TableCell class="text-muted-foreground tabular-nums">
          {{ injury.to }}
        </TableCell>
        <TableCell class="pr-4">
          <span class="flex items-center gap-2 text-xs uppercase">
            <Cross class="text-destructive size-3.5 shrink-0" />
            {{ injury.issue }}
          </span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
