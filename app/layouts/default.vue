<script setup lang="ts">
const { data: user } = useCurrentUser();
const logout = useLogout();
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="border-b bg-white">
      <nav class="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <NuxtLink to="/products" class="font-semibold">Products</NuxtLink>
        <span class="ml-auto text-sm text-gray-600">{{ user?.email }}</span>
        <button
          type="button"
          class="text-sm underline disabled:opacity-50"
          :disabled="logout.isPending.value"
          @click="logout.mutate()"
        >
          {{ logout.isError.value ? "Logout failed, retry" : "Logout" }}
        </button>
      </nav>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
