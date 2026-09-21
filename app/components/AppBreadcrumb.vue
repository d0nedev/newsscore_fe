<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";

export interface Crumb {
  label: string;
  to?: string;
  /** Renders a flag chip before the label. */
  country?: string;
}

defineProps<{ items: Crumb[] }>();
</script>

<template>
  <nav
    aria-label="Remah roti"
    class="text-muted-foreground flex items-center gap-1 border-b px-4 py-2 text-xs font-semibold uppercase"
  >
    <template v-for="(item, i) in items" :key="item.label">
      <ChevronRight v-if="i > 0" class="size-3 shrink-0" />
      <CountryChip v-if="item.country" :country="item.country" />
      <NuxtLink v-if="item.to" :to="item.to" class="hover:text-primary">
        {{ item.label }}
      </NuxtLink>
      <span v-else>{{ item.label }}</span>
    </template>
  </nav>
</template>
