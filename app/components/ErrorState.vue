<script setup lang="ts">
defineProps<{ error: unknown }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <div
    role="alert"
    class="rounded border border-red-200 bg-red-50 p-4 text-red-800"
  >
    <p>{{ errorMessage(error) }}</p>
    <button type="button" class="mt-2 underline" @click="$emit('retry')">
      Retry
    </button>
  </div>
</template>
