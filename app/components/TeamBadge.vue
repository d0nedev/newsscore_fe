<script setup lang="ts">
defineProps<{ badge: string }>();
</script>

<template>
  <Badge
    variant="secondary"
    class="size-5 shrink-0 justify-center rounded-full p-0 text-[10px] font-bold"
    aria-hidden="true"
    >{{ badge }}</Badge
  >
</template>
