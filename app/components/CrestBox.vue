<script setup lang="ts">
import { Shield, Trophy, User } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    /** Shown when no initials are given: a competition, club or person mark. */
    icon?: "trophy" | "shield" | "user";
    initials?: string;
    to?: string;
    label?: string;
  }>(),
  { icon: "shield", initials: undefined, to: undefined, label: undefined },
);

const glyph = computed(
  () => ({ trophy: Trophy, shield: Shield, user: User })[props.icon],
);
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'span'"
    :to="to"
    :aria-label="label"
    class="bg-muted grid size-16 shrink-0 place-items-center rounded-lg border"
  >
    <span v-if="initials" class="text-lg font-bold">{{ initials }}</span>
    <component
      :is="glyph"
      v-else
      class="text-muted-foreground size-7"
      aria-hidden="true"
    />
  </component>
</template>
