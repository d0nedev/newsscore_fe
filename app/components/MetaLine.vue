<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <p class="text-muted-foreground text-sm">
    {{ label }}:
    <span class="text-foreground font-semibold"><slot /></span>
  </p>
</template>
