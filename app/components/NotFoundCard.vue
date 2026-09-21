<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <Card>
    <CardContent class="space-y-2 py-8 text-center text-sm">
      <p class="text-muted-foreground">{{ message }}</p>
      <Button as-child variant="link" size="sm">
        <NuxtLink to="/">Kembali ke skor</NuxtLink>
      </Button>
    </CardContent>
  </Card>
</template>
