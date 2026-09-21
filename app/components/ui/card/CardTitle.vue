<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";

// Local tweak: `as` so a card title can stay a real heading (h1/h2/h3).
const props = defineProps<
  PrimitiveProps & {
    class?: HTMLAttributes["class"];
  }
>();
</script>

<template>
  <Primitive
    data-slot="card-title"
    :as="props.as ?? 'div'"
    :as-child="props.asChild"
    :class="
      cn(
        'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm cn-font-heading',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
