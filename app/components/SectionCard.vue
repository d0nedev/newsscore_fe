<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";

withDefaults(
  defineProps<{
    title?: string;
    /** Edge-to-edge body, for tables and match rows. */
    flush?: boolean;
    /** Lets a wide table scroll sideways on small screens. */
    scroll?: boolean;
    /** Message shown in place of the body when there is nothing to list. */
    empty?: string;
    /** Renders the reveal button at the foot of the card. */
    moreLabel?: string;
  }>(),
  {
    flush: true,
    title: undefined,
    empty: undefined,
    moreLabel: undefined,
  },
);
defineEmits<{ more: [] }>();
</script>

<template>
  <Card class="gap-0 overflow-hidden py-0">
    <CardHeader
      v-if="title || $slots.action"
      class="flex flex-row items-center justify-between gap-2 px-4 py-3"
    >
      <CardTitle as="h2" class="text-base">{{ title }}</CardTitle>
      <slot name="action" />
    </CardHeader>

    <CardContent
      :class="[flush ? 'px-0' : 'p-4 pt-0', scroll ? 'overflow-x-auto' : '']"
    >
      <p v-if="empty" class="text-muted-foreground p-4 text-sm">{{ empty }}</p>
      <slot v-else />

      <Button
        v-if="moreLabel"
        variant="ghost"
        class="text-muted-foreground w-full rounded-none text-xs font-semibold"
        @click="$emit('more')"
      >
        {{ moreLabel }}
        <ChevronDown class="size-3" />
      </Button>
    </CardContent>
  </Card>
</template>
