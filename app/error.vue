<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
</script>

<template>
  <div class="grid min-h-screen place-items-center p-4 text-center">
    <div class="space-y-3">
      <h1 class="text-2xl font-semibold">
        {{ notFound ? "Page not found" : "Something went wrong" }}
      </h1>
      <button
        type="button"
        class="underline"
        @click="clearError({ redirect: '/products' })"
      >
        Back to products
      </button>
    </div>
  </div>
</template>
