<script setup lang="ts">
import type { StandingRow } from "~/types/match";

defineProps<{ rows: StandingRow[] }>();

const formColor = {
  W: "bg-emerald-500",
  D: "bg-slate-400",
  L: "bg-red-500",
};
</script>

<template>
  <div class="overflow-x-auto rounded bg-white shadow-sm">
    <table class="w-full text-sm">
      <thead class="bg-slate-50 text-xs text-slate-500">
        <tr>
          <th scope="col" class="px-2 py-2 text-left">#</th>
          <th scope="col" class="px-2 py-2 text-left">Tim</th>
          <th scope="col" class="px-2 py-2">M</th>
          <th scope="col" class="px-2 py-2">M-S-K</th>
          <th scope="col" class="px-2 py-2">Gol</th>
          <th scope="col" class="px-2 py-2">Poin</th>
          <th scope="col" class="px-2 py-2 text-left">Performa</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="row in rows" :key="row.teamId" class="hover:bg-slate-50">
          <td class="px-2 py-2 text-slate-500 tabular-nums">
            {{ row.position }}
          </td>
          <td class="px-2 py-2">
            <NuxtLink :to="`/tim/${row.teamId}`" class="hover:underline">
              {{ row.team }}
            </NuxtLink>
          </td>
          <td class="px-2 py-2 text-center tabular-nums">{{ row.played }}</td>
          <td class="px-2 py-2 text-center tabular-nums">
            {{ row.won }}-{{ row.drawn }}-{{ row.lost }}
          </td>
          <td class="px-2 py-2 text-center tabular-nums">
            {{ row.goalsFor }}:{{ row.goalsAgainst }}
          </td>
          <td class="px-2 py-2 text-center font-semibold tabular-nums">
            {{ row.points }}
          </td>
          <td class="px-2 py-2">
            <span class="flex gap-0.5">
              <span
                v-for="(result, i) in row.form"
                :key="i"
                class="grid size-4 place-items-center rounded text-[10px] font-bold text-white"
                :class="formColor[result]"
                :title="result"
                >{{ result }}</span
              >
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
