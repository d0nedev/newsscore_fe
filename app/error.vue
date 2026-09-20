<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
</script>

<template>
  <div class="grid min-h-screen place-items-center p-4 text-center">
    <div class="space-y-3">
      <h1 class="text-2xl font-semibold">
        {{ notFound ? "Halaman tidak ditemukan" : "Terjadi kesalahan" }}
      </h1>
      <button
        type="button"
        class="underline"
        @click="clearError({ redirect: '/' })"
      >
        Kembali ke skor
      </button>
    </div>
  </div>
</template>
