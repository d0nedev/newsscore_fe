<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
</script>

<template>
  <div
    class="bg-background grid min-h-screen place-items-center p-4 text-center"
  >
    <Card class="max-w-sm">
      <CardHeader>
        <CardTitle as="h1" class="text-2xl">
          {{ notFound ? "Halaman tidak ditemukan" : "Terjadi kesalahan" }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="justify-center">
        <Button @click="clearError({ redirect: '/' })">Kembali ke skor</Button>
      </CardFooter>
    </Card>
  </div>
</template>
