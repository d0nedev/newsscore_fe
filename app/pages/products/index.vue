<script setup lang="ts">
const {
  data,
  error,
  isPending,
  isError,
  refetch,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
} = useProducts();

const products = computed(
  () => data.value?.pages.flatMap((page) => page.data) ?? [],
);
const remove = useDeleteProduct();

function loadMore() {
  if (hasNextPage.value && !isFetchingNextPage.value) fetchNextPage();
}

function onDelete(id: string, name: string) {
  if (remove.isPending.value) return;
  if (window.confirm(`Delete "${name}"?`)) remove.mutate(id);
}

const price = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Products</h1>
      <NuxtLink
        to="/products/new"
        class="rounded bg-gray-900 px-4 py-2 text-white"
        >New product</NuxtLink
      >
    </div>

    <p
      v-if="remove.isError.value"
      role="alert"
      class="rounded bg-red-50 p-3 text-red-800"
    >
      {{ errorMessage(remove.error.value) }}
    </p>

    <ul v-if="isPending" aria-busy="true" class="space-y-2">
      <li
        v-for="n in 5"
        :key="n"
        class="h-12 animate-pulse rounded bg-gray-200"
      />
    </ul>

    <ErrorState
      v-else-if="isError && !data"
      :error="error"
      @retry="refetch()"
    />

    <p
      v-else-if="products.length === 0"
      class="rounded border bg-white p-6 text-center text-gray-600"
    >
      No products found.
    </p>

    <template v-else>
      <ul class="divide-y rounded border bg-white">
        <li
          v-for="product in products"
          :key="product.id"
          class="flex items-center gap-4 p-3"
        >
          <div class="flex-1">
            <p class="font-medium">
              {{ product.name }}
              <span v-if="!product.active" class="text-xs text-gray-500"
                >(inactive)</span
              >
            </p>
            <p class="text-sm text-gray-600">
              {{ price.format(product.price) }} · stock {{ product.stock }}
            </p>
          </div>
          <NuxtLink
            :to="`/products/${encodeURIComponent(product.id)}/edit`"
            class="underline"
            >Edit</NuxtLink
          >
          <button
            type="button"
            class="text-red-700 underline disabled:opacity-50"
            :disabled="remove.isPending.value"
            @click="onDelete(product.id, product.name)"
          >
            {{
              remove.isPending.value && remove.variables.value === product.id
                ? "Deleting..."
                : "Delete"
            }}
          </button>
        </li>
      </ul>

      <ErrorState
        v-if="isFetchNextPageError"
        :error="error"
        @retry="loadMore"
      />
      <button
        v-else-if="hasNextPage"
        type="button"
        class="w-full rounded border bg-white py-2 disabled:opacity-50"
        :disabled="isFetchingNextPage"
        @click="loadMore"
      >
        {{ isFetchingNextPage ? "Loading..." : "Load more" }}
      </button>
      <p v-else class="text-center text-sm text-gray-500">End of list</p>
    </template>
  </div>
</template>
