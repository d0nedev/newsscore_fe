<script setup lang="ts">
const props = defineProps<{ rating?: number }>();

// Same thresholds wherever a rating is printed.
const color = computed(() => {
  if (!props.rating) return "";
  if (props.rating >= 7) return "bg-emerald-600";
  if (props.rating >= 6.5) return "bg-amber-500";
  return "bg-muted-foreground";
});
</script>

<template>
  <Badge
    v-if="rating"
    class="justify-center rounded-sm px-1 text-[11px] font-bold text-white tabular-nums"
    :class="color"
    >{{ rating.toFixed(1) }}</Badge
  >
  <span v-else class="text-muted-foreground">-</span>
</template>
