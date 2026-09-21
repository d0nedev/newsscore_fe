<script setup lang="ts">
import { TriangleAlert } from "@lucide/vue";

defineProps<{ error: unknown }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <Alert variant="destructive" role="alert">
    <TriangleAlert />
    <AlertTitle>Terjadi kesalahan</AlertTitle>
    <AlertDescription>{{ errorMessage(error) }}</AlertDescription>
    <AlertAction>
      <Button size="sm" variant="outline" @click="$emit('retry')">Retry</Button>
    </AlertAction>
  </Alert>
</template>
