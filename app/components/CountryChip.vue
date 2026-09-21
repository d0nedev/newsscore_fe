<script setup lang="ts">
const props = defineProps<{ country: string }>();

// Stand-in for a flag: a stable colour per country plus its first letters.
const palette = [
  "bg-rose-600",
  "bg-sky-600",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-slate-600",
];
const hash = computed(() =>
  [...props.country].reduce((sum, char) => sum + char.charCodeAt(0), 0),
);
const color = computed(() => palette[hash.value % palette.length]);
const code = computed(() => props.country.slice(0, 2).toUpperCase());
</script>

<template>
  <span
    class="grid h-3.5 w-5 shrink-0 place-items-center rounded-[2px] text-[8px] font-bold text-white"
    :class="color"
    :title="country"
    aria-hidden="true"
    >{{ code }}</span
  >
</template>
