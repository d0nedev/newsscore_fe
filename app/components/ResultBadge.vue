<script setup lang="ts">
// One shared meaning for W/D/L across standings, match rows and player logs:
// Menang, Seri, Kalah.
const style = {
  W: { label: "M", color: "bg-emerald-500" },
  D: { label: "S", color: "bg-amber-500" },
  L: { label: "K", color: "bg-destructive" },
};
const title = { W: "Menang", D: "Seri", L: "Kalah" };

defineProps<{ result: "W" | "D" | "L" }>();
</script>

<template>
  <Badge
    class="size-4.5 justify-center rounded-sm p-0 text-[10px] font-bold text-white"
    :class="style[result].color"
    :title="title[result]"
    >{{ style[result].label }}</Badge
  >
</template>
