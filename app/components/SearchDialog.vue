<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { Search, User, X } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";

const open = ref(false);
const q = ref("");
const term = refDebounced(q, 300);
const search = useSearch(term);
const ready = computed(() => term.value.trim().length >= 2);
const teams = computed(() => search.data.value?.teams ?? []);
const players = computed(() => search.data.value?.players ?? []);

// Close once a result navigates, and start fresh next time.
const route = useRoute();
watch(
  () => route.fullPath,
  () => (open.value = false),
);
watch(open, (isOpen) => {
  if (!isOpen) q.value = "";
});
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cari tim atau pemain"
        class="hover:bg-header-foreground/10 ml-auto rounded-full"
      >
        <Search />
      </Button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/40" />
      <DialogContent
        :aria-describedby="undefined"
        class="bg-background text-foreground fixed inset-x-4 top-16 z-50 mx-auto max-h-[75vh] max-w-lg overflow-y-auto rounded-lg p-3 shadow-lg"
      >
        <DialogTitle class="sr-only">Pencarian</DialogTitle>
        <div class="flex items-center gap-2">
          <Search class="text-muted-foreground size-4 shrink-0" />
          <Input
            v-model="q"
            type="search"
            placeholder="Cari tim atau pemain…"
            aria-label="Cari tim atau pemain"
            class="h-9"
            autofocus
          />
          <DialogClose as-child>
            <Button variant="ghost" size="icon" aria-label="Tutup pencarian">
              <X />
            </Button>
          </DialogClose>
        </div>

        <p v-if="!ready" class="text-muted-foreground px-1 pt-3 pb-1 text-xs">
          Ketik minimal 2 huruf.
        </p>
        <SkeletonRows
          v-else-if="search.isFetching.value && !search.data.value"
          :rows="3"
        />
        <ErrorState
          v-else-if="search.error.value"
          :error="search.error.value"
          @retry="search.refetch()"
        />
        <p
          v-else-if="!teams.length && !players.length"
          class="text-muted-foreground px-1 pt-3 pb-1 text-sm"
        >
          Tidak ada hasil untuk "{{ term.trim() }}".
        </p>
        <template v-else>
          <section v-if="teams.length" class="mt-3" aria-label="Tim">
            <SubHeading>Tim</SubHeading>
            <ul>
              <li v-for="team in teams" :key="team.id">
                <NuxtLink
                  :to="`/tim/${team.id}`"
                  class="hover:bg-muted flex items-center gap-2 rounded px-2 py-2 text-sm"
                >
                  <TeamBadge :badge="team.badge" :logo="team.logo" />
                  <span class="truncate font-semibold">{{ team.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </section>
          <section v-if="players.length" class="mt-3" aria-label="Pemain">
            <SubHeading>Pemain</SubHeading>
            <ul>
              <li v-for="player in players" :key="player.id">
                <NuxtLink
                  :to="`/pemain/${player.id}`"
                  class="hover:bg-muted flex items-center gap-2 rounded px-2 py-2 text-sm"
                >
                  <img
                    v-if="player.photo"
                    :src="player.photo"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    class="bg-muted size-6 shrink-0 rounded-full object-cover"
                  />
                  <User
                    v-else
                    class="text-muted-foreground size-6 shrink-0 p-1"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 flex-1 truncate font-semibold">{{
                    player.name
                  }}</span>
                  <span
                    v-if="player.team"
                    class="text-muted-foreground truncate text-xs"
                    >{{ player.team }}</span
                  >
                </NuxtLink>
              </li>
            </ul>
          </section>
        </template>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
