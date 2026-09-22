<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: readonly string[];
    modelValue?: string;
    /** Stretch the pills to fill the row instead of hugging their labels. */
    fill?: boolean;
    label?: string;
    /**
     * "tabs" swaps whole panels and follows the ARIA tabs pattern.
     * "filter" narrows one list that stays on screen: toggle buttons, not tabs.
     */
    variant?: "filter" | "tabs";
    /** Id stem shared with the panel; required for the tabs variant. */
    idPrefix?: string;
  }>(),
  {
    modelValue: undefined,
    fill: false,
    label: undefined,
    variant: "filter",
    idPrefix: undefined,
  },
);

const emit = defineEmits<{ "update:modelValue": [string] }>();

const fallbackId = useId();
const stem = computed(() => props.idPrefix ?? fallbackId);
const isTabs = computed(() => props.variant === "tabs");

// Arrow keys move between tabs, which the tabs pattern requires; a filter row
// is a plain group of toggles and keeps normal Tab-key behaviour.
function onKeydown(event: KeyboardEvent, index: number) {
  if (!isTabs.value) return;
  const last = props.items.length - 1;
  const next = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  }[event.key];
  if (next === undefined) return;

  event.preventDefault();
  const target = props.items[next];
  if (!target) return;
  emit("update:modelValue", target);
  const list = (event.currentTarget as HTMLElement).closest("[data-pill-tabs]");
  const buttons = list?.querySelectorAll<HTMLButtonElement>("button");
  buttons?.[next]?.focus();
}
</script>

<template>
  <div
    data-pill-tabs
    :role="isTabs ? 'tablist' : 'group'"
    :aria-label="label"
    class="bg-background flex gap-1 overflow-x-auto rounded-lg border p-1 text-xs"
  >
    <button
      v-for="(item, index) in items"
      :id="isTabs ? tabId(stem, item) : undefined"
      :key="item"
      type="button"
      :role="isTabs ? 'tab' : undefined"
      :aria-controls="isTabs ? tabPanelId(stem, item) : undefined"
      :aria-selected="isTabs ? modelValue === item : undefined"
      :aria-pressed="isTabs ? undefined : modelValue === item"
      :tabindex="isTabs && modelValue !== item ? -1 : undefined"
      class="rounded-md px-3 py-1.5 font-semibold whitespace-nowrap uppercase"
      :class="[
        fill ? 'flex-1' : '',
        modelValue === item
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="emit('update:modelValue', item)"
      @keydown="onKeydown($event, index)"
    >
      {{ item }}
    </button>
  </div>
</template>
