<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
</script>

<template>
  <!-- Inside the site layout, so header and navigation stay available. -->
  <NuxtLayout>
    <div class="grid place-items-center py-16 text-center">
      <Card data-card="error" class="max-w-sm">
        <CardHeader>
          <CardTitle as="h1" class="text-2xl">
            {{ notFound ? "Halaman tidak ditemukan" : "Terjadi kesalahan" }}
          </CardTitle>
        </CardHeader>
        <CardFooter class="justify-center">
          <Button @click="clearError({ redirect: '/' })"
            >Kembali ke skor</Button
          >
        </CardFooter>
      </Card>
    </div>
  </NuxtLayout>
</template>
