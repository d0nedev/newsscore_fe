<script setup lang="ts">
import type { League } from "~/types/match";

defineProps<{ leagues: League[]; top?: number }>();
</script>

<template>
  <section class="bg-background rounded-lg border shadow-sm">
    <header class="flex items-center justify-between border-b px-4 py-3">
      <h2 class="text-sm font-bold">Ringkasan Klasemen</h2>
    </header>
    <div class="grid gap-4 p-4 sm:grid-cols-2">
      <div v-for="league in leagues" :key="league.id">
        <NuxtLink
          :to="`/sepak-bola/${league.id}`"
          class="hover:text-primary mb-2 flex items-center gap-2 text-xs font-bold uppercase"
        >
          <CountryChip :country="league.country" />
          {{ league.name }}
        </NuxtLink>
        <table class="w-full text-sm">
          <thead class="text-muted-foreground text-xs">
            <tr>
              <th scope="col" class="text-left font-medium">Tim</th>
              <th scope="col" class="w-8 text-center font-medium">M</th>
              <th scope="col" class="w-8 text-center font-medium">Poin</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in league.standings.slice(0, top ?? 4)"
              :key="row.teamId"
            >
              <td class="py-0.5">
                <NuxtLink
                  :to="`/tim/${row.teamId}`"
                  class="hover:text-primary flex items-center gap-2"
                >
                  <span class="text-muted-foreground w-3 tabular-nums">{{
                    row.position
                  }}</span>
                  <span class="truncate">{{ row.team }}</span>
                </NuxtLink>
              </td>
              <td class="text-center tabular-nums">{{ row.played }}</td>
              <td class="text-center font-semibold tabular-nums">
                {{ row.points }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
