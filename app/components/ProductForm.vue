<script setup lang="ts">
import { productSchema } from "~/schemas/product.schema";
import type { ProductInput } from "~/types/product";

const props = defineProps<{
  initial?: ProductInput;
  submitLabel: string;
  pending: boolean;
  error: unknown; // mutation error, if any
}>();

const emit = defineEmits<{ submit: [input: ProductInput]; cancel: [] }>();

const empty: ProductInput = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  active: true,
};
const form = reactive<ProductInput>({ ...(props.initial ?? empty) });
const clientErrors = ref<Record<string, string>>({});

const apiError = computed(() =>
  props.error instanceof ApiError ? props.error : null,
);
// Client errors win; server field errors fill the rest (the API is authoritative).
const fieldErrors = computed(() => ({
  ...(apiError.value?.fieldErrors ?? {}),
  ...clientErrors.value,
}));

function onSubmit() {
  if (props.pending) return;
  const result = productSchema.safeParse(form);
  if (!result.success) {
    clientErrors.value = zodFieldErrors(result.error);
    return;
  }
  clientErrors.value = {};
  emit("submit", result.data);
}

function reset() {
  Object.assign(form, props.initial ?? empty);
  clientErrors.value = {};
}

const input = "mt-1 block w-full rounded border px-2 py-1";
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="onSubmit">
    <p v-if="error" role="alert" class="rounded bg-red-50 p-3 text-red-800">
      {{ errorMessage(error) }}
    </p>

    <label class="block">
      Name
      <input
        v-model="form.name"
        name="name"
        type="text"
        maxlength="100"
        :class="input"
      />
      <span v-if="fieldErrors.name" class="text-sm text-red-700">{{
        fieldErrors.name
      }}</span>
    </label>

    <label class="block">
      Description
      <textarea
        v-model="form.description"
        name="description"
        maxlength="500"
        :class="input"
      />
      <span v-if="fieldErrors.description" class="text-sm text-red-700">
        {{ fieldErrors.description }}
      </span>
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label class="block">
        Price
        <input
          v-model.number="form.price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          :class="input"
        />
        <span v-if="fieldErrors.price" class="text-sm text-red-700">{{
          fieldErrors.price
        }}</span>
      </label>
      <label class="block">
        Stock
        <input
          v-model.number="form.stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          :class="input"
        />
        <span v-if="fieldErrors.stock" class="text-sm text-red-700">{{
          fieldErrors.stock
        }}</span>
      </label>
    </div>

    <label class="flex items-center gap-2">
      <input v-model="form.active" name="active" type="checkbox" />
      Active
    </label>

    <div class="flex gap-2">
      <button
        type="submit"
        class="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        :disabled="pending"
      >
        {{ pending ? "Saving..." : submitLabel }}
      </button>
      <button
        type="button"
        class="rounded border px-4 py-2"
        :disabled="pending"
        @click="reset"
      >
        Reset
      </button>
      <button
        type="button"
        class="rounded border px-4 py-2"
        :disabled="pending"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
