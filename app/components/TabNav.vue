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
    <TabsList variant="line" class="w-full justify-start overflow-x-auto">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab"
        :value="tab"
        class="flex-none"
      >
        {{ tab }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
