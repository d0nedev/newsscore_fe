<script setup lang="ts">
defineProps<{ badge: string }>();
</script>

<template>
  <span
    class="grid size-5 shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-bold"
    aria-hidden="true"
    >{{ badge }}</span
  >
</template>
