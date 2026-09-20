<script setup lang="ts">
import { loginSchema } from "~/schemas/auth.schema";

definePageMeta({ public: true, layout: "blank" });

const route = useRoute();
const login = useLogin();
const form = reactive({ email: "", password: "" });
const fieldErrors = ref<Record<string, string>>({});

async function onSubmit() {
  if (login.isPending.value) return;
  const result = loginSchema.safeParse(form);
  if (!result.success) {
    fieldErrors.value = zodFieldErrors(result.error);
    return;
  }
  fieldErrors.value = {};
  try {
    await login.mutateAsync(result.data);
  } catch {
    return; // shown via login.error
  }
  form.password = "";
  await navigateTo(safeRedirect(route.query.redirect));
}

// Wrong credentials should not show the "session expired" text.
const loginError = computed(() => {
  const error = login.error.value;
  if (error instanceof ApiError && error.kind === "unauthorized") {
    return "Invalid email or password.";
  }
  return error ? errorMessage(error) : "";
});
</script>

<template>
  <form
    class="w-full max-w-sm space-y-4 rounded border bg-white p-6"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h1 class="text-xl font-semibold">Sign in</h1>
    <p
      v-if="loginError"
      role="alert"
      class="rounded bg-red-50 p-3 text-red-800"
    >
      {{ loginError }}
    </p>

    <label class="block">
      Email
      <input
        v-model="form.email"
        name="email"
        type="email"
        autocomplete="username"
        class="mt-1 block w-full rounded border px-2 py-1"
      />
      <span v-if="fieldErrors.email" class="text-sm text-red-700">{{
        fieldErrors.email
      }}</span>
    </label>
    <label class="block">
      Password
      <input
        v-model="form.password"
        name="password"
        type="password"
        autocomplete="current-password"
        class="mt-1 block w-full rounded border px-2 py-1"
      />
      <span v-if="fieldErrors.password" class="text-sm text-red-700">{{
        fieldErrors.password
      }}</span>
    </label>

    <button
      type="submit"
      class="w-full rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      :disabled="login.isPending.value"
    >
      {{ login.isPending.value ? "Signing in..." : "Sign in" }}
    </button>
  </form>
</template>
