<script setup lang="ts">
defineProps<{ tabs: readonly string[]; modelValue: string }>();
defineEmits<{ "update:modelValue": [string] }>();
</script>

<template>
  <div class="flex gap-1 overflow-x-auto border-b bg-white px-2">
    <button
      v-for="tab in tabs"
      :key="tab"
      type="button"
      class="px-3 py-2 text-sm whitespace-nowrap"
      :class="
        tab === modelValue
          ? 'border-b-2 border-emerald-500 font-semibold'
          : 'text-slate-500'
      "
      :aria-pressed="tab === modelValue"
      @click="$emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>
