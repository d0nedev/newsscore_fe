<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), { rows: 6 });
</script>

<template>
  <!-- Placeholder shaped like MatchRow: time, two team lines, score column. -->
  <div role="status" class="divide-y">
    <span class="sr-only">Memuat…</span>
    <div
      v-for="i in rows"
      :key="i"
      aria-hidden="true"
      class="flex items-center gap-3 px-4 py-3 motion-safe:animate-pulse"
    >
      <span class="bg-muted h-3 w-10 rounded" />
      <span class="flex-1 space-y-2">
        <span class="bg-muted block h-3 w-2/5 rounded" />
        <span class="bg-muted block h-3 w-1/3 rounded" />
      </span>
      <span class="bg-muted h-8 w-6 rounded" />
    </div>
  </div>
</template>
