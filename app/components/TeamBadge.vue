<script setup lang="ts">
const props = defineProps<{ badge: string; logo?: string }>();

// A broken or missing logo falls back to the short code.
const failed = ref(false);
watch(
  () => props.logo,
  () => (failed.value = false),
);
</script>

<template>
  <img
    v-if="logo && !failed"
    :src="logo"
    alt=""
    aria-hidden="true"
    loading="lazy"
    width="30"
    height="30"
    class="size-5 shrink-0 object-contain"
    @error="failed = true"
  />
  <Badge
    v-else
    variant="secondary"
    class="size-5 shrink-0 justify-center rounded-full p-0 text-[10px] font-bold"
    aria-hidden="true"
    >{{ badge }}</Badge
  >
</template>
