<script setup lang="ts">
defineProps<{ tabs: readonly string[]; modelValue: string }>();
defineEmits<{ "update:modelValue": [string] }>();
</script>

<template>
  <Tabs
    :model-value="modelValue"
    class="w-full"
    @update:model-value="$emit('update:modelValue', String($event))"
  >
    <TabsList
      variant="line"
      class="w-full justify-start overflow-x-auto p-0 group-data-horizontal/tabs:h-auto"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab"
        :value="tab"
        class="after:bg-primary h-auto flex-none rounded-none px-2 py-3 group-data-horizontal/tabs:after:bottom-0"
      >
        {{ tab }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
