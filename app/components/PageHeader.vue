<script setup lang="ts">
import type { Crumb } from "~/components/AppBreadcrumb.vue";

defineProps<{
  crumbs: Crumb[];
  title: string;
  icon?: "trophy" | "shield" | "user";
  initials?: string;
}>();
</script>

<template>
  <Card class="gap-0 py-0">
    <AppBreadcrumb :items="crumbs" />

    <div class="flex items-start gap-4 p-4">
      <CrestBox :icon="icon" :initials="initials" />

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h1 class="truncate text-xl font-bold">{{ title }}</h1>
          <slot name="actions" />
        </div>
        <slot name="meta" />
      </div>

      <slot name="aside" />
    </div>
  </Card>
</template>
