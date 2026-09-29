<script setup lang="ts">
const props = defineProps<{ rating?: number }>();

// Same thresholds wherever a rating is printed.
const color = computed(() => {
  if (!props.rating) return "";
  if (props.rating >= 7) return "bg-win";
  if (props.rating >= 6.5) return "bg-draw";
  return "bg-muted-foreground";
});
</script>

<template>
  <Badge
    v-if="rating"
    class="justify-center rounded-sm px-1 text-[11px] font-bold text-white font-score"
    :class="color"
    >{{ rating.toFixed(1) }}</Badge
  >
  <span v-else class="text-muted-foreground">-</span>
</template>
