<script setup lang="ts">
// Neutral grey bar for a plain group inside a card: match halves, squad
// positions, detail sections. The tinted `bg-league-header` bar is reserved
// for rows that name a competition, so the colour keeps meaning something.
</script>

<template>
  <h3
    class="bg-muted text-muted-foreground flex items-center justify-between gap-2 px-4 py-1.5 text-xs font-semibold uppercase"
  >
    <span><slot /></span>
    <slot name="trailing" />
  </h3>
</template>
