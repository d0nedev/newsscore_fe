<script setup lang="ts">
import { Building2, Flag, Users, Whistle } from "@lucide/vue";
import type { Match } from "~/types/match";
import { findTeam } from "~/data/teams";

const props = defineProps<{ match: Match }>();

const home = computed(() => findTeam(props.match.home.id));
const number = new Intl.NumberFormat("id-ID");

const rows = computed(() =>
  [
    { icon: Whistle, label: "Wasit", value: props.match.referee },
    { icon: Building2, label: "Stadion", value: props.match.venue },
    {
      icon: Flag,
      label: "Kapasitas",
      value: home.value ? number.format(home.value.capacity) : undefined,
    },
    {
      icon: Users,
      label: "Jumlah penonton",
      value: props.match.attendance
        ? number.format(props.match.attendance)
        : undefined,
    },
  ].filter((row) => row.value),
);
</script>

<template>
  <dl v-if="rows.length" class="divide-y text-sm">
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex items-center justify-between gap-3 px-3 py-2"
    >
      <dt
        class="text-muted-foreground flex items-center gap-2 text-xs uppercase"
      >
        <component :is="row.icon" class="size-4" />
        {{ row.label }}
      </dt>
      <dd class="font-semibold">{{ row.value }}</dd>
    </div>
  </dl>
</template>
