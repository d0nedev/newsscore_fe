<script setup lang="ts">
const props = defineProps<{ home: number; away: number }>();

// Each half of the track fills from the middle outwards with that side's share.
const share = (side: "home" | "away") => {
  const total = props.home + props.away;
  return total === 0 ? 50 : Math.round((props[side] / total) * 100);
};
</script>

<template>
  <p class="flex h-[8px] gap-px">
    <span class="bg-muted flex flex-1 justify-end">
      <span class="bg-primary block" :style="{ width: `${share('home')}%` }" />
    </span>
    <span class="bg-muted flex flex-1">
      <span
        class="block bg-slate-700"
        :style="{ width: `${share('away')}%` }"
      />
    </span>
  </p>
</template>
