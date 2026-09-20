<script setup lang="ts">
import type { ProductInput } from "~/types/product";

const route = useRoute();
const id = computed(() => String(route.params.id));
const { data: product, error, isPending, isError, refetch } = useProduct(id);
const update = useUpdateProduct();

async function onSubmit(input: ProductInput) {
  try {
    await update.mutateAsync({ id: id.value, input });
  } catch {
    return; // shown by the form
  }
  await navigateTo("/products");
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">Edit product</h1>

    <div
      v-if="isPending"
      aria-busy="true"
      class="h-64 animate-pulse rounded bg-gray-200"
    />
    <ErrorState v-else-if="isError" :error="error" @retry="refetch()" />
    <ProductForm
      v-else-if="product"
      :key="product.updatedAt"
      :initial="product"
      submit-label="Save changes"
      :pending="update.isPending.value"
      :error="update.error.value"
      @submit="onSubmit"
      @cancel="navigateTo('/products')"
    />
  </div>
</template>
