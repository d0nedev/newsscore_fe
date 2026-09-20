<script setup lang="ts">
import type { Match } from "~/types/match";

// Shows the first bookmaker per match; the detail page lists all of them.
const props = defineProps<{ title?: string; matches: Match[] }>();

const rows = computed(() =>
  props.matches.flatMap((match) => {
    const odds = match.odds?.[0];
    return odds ? [{ match, odds }] : [];
  }),
);
</script>

<template>
  <section class="overflow-hidden rounded bg-white shadow-sm">
    <h2 class="border-b bg-slate-50 px-3 py-2 text-sm font-semibold">
      {{ title ?? "Peluang 1X2" }}
    </h2>
    <p class="px-3 pt-2 text-xs text-slate-500">
      Angka dummy untuk tampilan, bukan peluang sungguhan.
    </p>
    <p v-if="rows.length === 0" class="p-4 text-sm text-slate-500">
      Belum ada peluang.
    </p>
    <table v-else class="w-full text-sm">
      <thead class="text-xs text-slate-500">
        <tr>
          <th scope="col" class="px-3 py-1.5 text-left">Pertandingan</th>
          <th scope="col" class="px-3 py-1.5 text-right">1</th>
          <th scope="col" class="px-3 py-1.5 text-right">X</th>
          <th scope="col" class="px-3 py-1.5 text-right">2</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="{ match, odds } in rows" :key="match.id">
          <td class="px-3 py-1.5">
            <NuxtLink :to="`/pertandingan/${match.id}`" class="hover:underline">
              {{ match.home.name }} - {{ match.away.name }}
            </NuxtLink>
            <span class="block text-xs text-slate-500"
              >{{ match.date }} · {{ match.time }}</span
            >
          </td>
          <td class="px-3 py-1.5 text-right tabular-nums">
            {{ odds.home.toFixed(2) }}
          </td>
          <td class="px-3 py-1.5 text-right tabular-nums">
            {{ odds.draw.toFixed(2) }}
          </td>
          <td class="px-3 py-1.5 text-right tabular-nums">
            {{ odds.away.toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
