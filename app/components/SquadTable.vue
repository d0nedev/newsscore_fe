<script setup lang="ts">
import type { SquadPlayer } from "~/types/match";

const props = defineProps<{ players: SquadPlayer[] }>();

const positions = ["GK", "DF", "MF", "FW"] as const;
const groups = computed(() =>
  positions
    .map((position) => ({
      position,
      players: props.players.filter((player) => player.position === position),
    }))
    .filter((group) => group.players.length > 0),
);

const label = {
  GK: "Penjaga Gawang",
  DF: "Bek",
  MF: "Gelandang",
  FW: "Penyerang",
};
</script>

<template>
  <div class="space-y-3">
    <Card
      v-for="group in groups"
      :key="group.position"
      class="gap-0 overflow-hidden py-0"
    >
      <CardHeader class="border-b px-3 py-2 [.border-b]:pb-2">
        <CardTitle as="h3" class="text-sm">{{
          label[group.position]
        }}</CardTitle>
      </CardHeader>
      <CardContent class="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead class="text-center">Usia</TableHead>
              <TableHead class="text-center">Main</TableHead>
              <TableHead class="text-center">Gol</TableHead>
              <TableHead class="text-center">Assist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="player in group.players" :key="player.id">
              <TableCell>
                <NuxtLink :to="`/pemain/${player.id}`" class="hover:underline">
                  <span class="text-muted-foreground mr-2 tabular-nums">{{
                    player.number
                  }}</span>
                  {{ player.name }}
                </NuxtLink>
              </TableCell>
              <TableCell class="text-center tabular-nums">{{
                player.age
              }}</TableCell>
              <TableCell class="text-center tabular-nums">{{
                player.matches
              }}</TableCell>
              <TableCell class="text-center tabular-nums">{{
                player.goals
              }}</TableCell>
              <TableCell class="text-center tabular-nums">{{
                player.assists
              }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
