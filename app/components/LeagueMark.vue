<script setup lang="ts">
// A competition's logo, or its country chip when the logo is missing or broken.
const props = defineProps<{ country: string; logo?: string }>();

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
    width="20"
    height="20"
    class="size-5 shrink-0 object-contain"
    @error="failed = true"
  />
  <CountryChip v-else :country="country" />
</template>
