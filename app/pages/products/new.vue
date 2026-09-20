<script setup lang="ts">
import type { ProductInput } from "~/types/product";

const create = useCreateProduct();

async function onSubmit(input: ProductInput) {
  try {
    await create.mutateAsync(input);
  } catch {
    return; // shown by the form
  }
  await navigateTo("/products");
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">New product</h1>
    <ProductForm
      submit-label="Create product"
      :pending="create.isPending.value"
      :error="create.error.value"
      @submit="onSubmit"
      @cancel="navigateTo('/products')"
    />
  </div>
</template>
