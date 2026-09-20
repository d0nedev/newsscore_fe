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
    <section
      v-for="group in groups"
      :key="group.position"
      class="overflow-hidden rounded bg-white shadow-sm"
    >
      <h3 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
        {{ label[group.position] }}
      </h3>
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500">
          <tr>
            <th scope="col" class="px-3 py-1.5 text-left">Nama</th>
            <th scope="col" class="px-2 py-1.5">Usia</th>
            <th scope="col" class="px-2 py-1.5">Main</th>
            <th scope="col" class="px-2 py-1.5">Gol</th>
            <th scope="col" class="px-2 py-1.5">Assist</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="player in group.players"
            :key="player.id"
            class="hover:bg-slate-50"
          >
            <td class="px-3 py-1.5">
              <NuxtLink :to="`/pemain/${player.id}`" class="hover:underline">
                <span class="mr-2 text-slate-400 tabular-nums">{{
                  player.number
                }}</span>
                {{ player.name }}
              </NuxtLink>
            </td>
            <td class="px-2 py-1.5 text-center tabular-nums">
              {{ player.age }}
            </td>
            <td class="px-2 py-1.5 text-center tabular-nums">
              {{ player.matches }}
            </td>
            <td class="px-2 py-1.5 text-center tabular-nums">
              {{ player.goals }}
            </td>
            <td class="px-2 py-1.5 text-center tabular-nums">
              {{ player.assists }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
