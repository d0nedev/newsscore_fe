<script setup lang="ts">
import { Newspaper } from "@lucide/vue";
import type { NewsItem } from "~/types/match";

defineProps<{ items: NewsItem[] }>();
</script>

<template>
  <SectionCard title="Berita & Pembaruan">
    <template #action>
      <Newspaper class="text-muted-foreground size-4" />
    </template>
    <ul class="divide-y border-t">
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
  </SectionCard>
</template>
