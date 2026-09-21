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
  <div>
    <section v-for="group in groups" :key="group.position">
      <SubHeading>{{ label[group.position] }}</SubHeading>
      <Table class="text-sm">
        <TableHeader>
          <TableRow class="text-muted-foreground text-xs uppercase">
            <TableHead class="pl-4">Nama</TableHead>
            <TableHead class="w-14 text-center">Usia</TableHead>
            <TableHead class="w-14 text-center">Main</TableHead>
            <TableHead class="w-14 text-center">Gol</TableHead>
            <TableHead class="w-16 pr-4 text-center">Assist</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="player in group.players" :key="player.id">
            <TableCell class="pl-4">
              <NuxtLink
                :to="`/pemain/${player.id}`"
                class="hover:text-primary flex items-center gap-2"
              >
                <span class="text-muted-foreground w-5 tabular-nums">{{
                  player.number
                }}</span>
                <span class="truncate font-semibold">{{ player.name }}</span>
              </NuxtLink>
            </TableCell>
            <TableCell class="text-center tabular-nums">{{
              player.age
            }}</TableCell>
            <TableCell class="text-center tabular-nums">{{
              player.matches
            }}</TableCell>
            <TableCell class="text-center font-semibold tabular-nums">{{
              player.goals
            }}</TableCell>
            <TableCell class="pr-4 text-center tabular-nums">{{
              player.assists
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>
</template>
