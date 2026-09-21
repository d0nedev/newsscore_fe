<script setup lang="ts">
import { Newspaper } from "@lucide/vue";
import type { NewsItem } from "~/types/match";

defineProps<{ items: NewsItem[] }>();
</script>

<template>
  <section class="bg-background rounded-lg border shadow-sm">
    <header class="flex items-center justify-between border-b px-4 py-3">
      <h2 class="flex items-center gap-2 text-sm font-bold">
        <Newspaper class="size-4" /> Berita & Pembaruan
      </h2>
      <span class="text-muted-foreground text-xs">Konten dummy</span>
    </header>
    <ul class="divide-y">
      <li
        v-for="item in items"
        :key="item.id"
        class="hover:bg-muted/60 flex gap-3 p-4"
      >
        <!-- Placeholder thumbnail: the slice ships no images. -->
        <span
          class="bg-muted text-muted-foreground grid size-16 shrink-0 place-items-center rounded-md text-xs"
          aria-hidden="true"
          >{{ item.category.slice(0, 3).toUpperCase() }}</span
        >
        <span class="min-w-0">
          <Badge variant="secondary" class="mb-1 rounded-sm uppercase">
            {{ item.category }}
          </Badge>
          <h3 class="truncate text-sm font-semibold">{{ item.title }}</h3>
          <p class="text-muted-foreground line-clamp-2 text-sm">
            {{ item.summary }}
          </p>
          <p class="text-muted-foreground mt-1 text-xs">
            {{ item.published }}
          </p>
        </span>
      </li>
    </ul>
  </section>
</template>
