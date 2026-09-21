<script setup lang="ts">
import { Menu, Plus, Pin, Search, Star, User } from "@lucide/vue";
import { liveCount, sports } from "~/data/matches";
import { leagues } from "~/data/leagues";

// Static stand-in for the "pinned" list a signed-in user would have.
const pinned = leagues.slice(0, 2);
const followedTeams = ["Jerman", "Chelsea"];
</script>

<template>
  <div class="bg-muted text-foreground min-h-screen">
    <header class="bg-header text-header-foreground">
      <div class="mx-auto flex max-w-[1240px] items-center gap-2 px-4 py-3">
        <NuxtLink to="/" class="text-2xl font-extrabold tracking-tight">
          SKOR<span class="bg-primary ml-1 rounded px-1.5">KINI</span>
        </NuxtLink>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Pencarian"
          class="hover:bg-header-foreground/10 ml-auto rounded-full"
        >
          <Search />
        </Button>
        <Button
          variant="ghost"
          class="hover:bg-header-foreground/10 hidden gap-2 rounded-full sm:flex"
        >
          <User />
          <span class="font-semibold">Masuk</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menu"
          class="hover:bg-header-foreground/10 rounded-full"
        >
          <Menu />
        </Button>
      </div>
    </header>

    <nav aria-label="Olahraga" class="bg-background border-b">
      <ul
        class="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 text-sm font-semibold"
      >
        <li v-for="(sport, i) in sports" :key="sport">
          <span
            class="flex items-center gap-2 px-3 py-3 whitespace-nowrap uppercase"
            :class="
              i === 0
                ? 'border-primary text-primary border-b-3'
                : 'text-muted-foreground'
            "
          >
            <Star v-if="i === 0" class="size-4" />
            {{ sport }}
            <Badge
              v-if="i === 0 && liveCount > 0"
              variant="secondary"
              class="rounded-sm"
            >
              {{ liveCount }}
            </Badge>
          </span>
        </li>
      </ul>
    </nav>

    <div class="mx-auto flex max-w-[1240px] gap-4 px-4 py-4">
      <aside class="hidden w-52 shrink-0 space-y-6 lg:block">
        <nav aria-label="Liga yang disematkan">
          <h2
            class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
          >
            <Pin class="size-4" /> Liga Yang Disematkan
          </h2>
          <ul class="py-1 text-sm">
            <li v-for="league in pinned" :key="league.id">
              <NuxtLink
                :to="`/sepak-bola/${league.id}`"
                class="hover:text-primary flex items-center gap-2 py-1.5"
              >
                <CountryChip :country="league.country" />
                {{ league.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Kompetisi">
          <h2
            class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
          >
            Kompetisi
          </h2>
          <ul class="py-1 text-sm">
            <li v-for="league in leagues" :key="league.id">
              <NuxtLink
                :to="`/sepak-bola/${league.id}`"
                class="hover:text-primary flex items-center gap-2 py-1.5"
                active-class="text-primary font-semibold"
              >
                <CountryChip :country="league.country" />
                {{ league.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <section>
          <h2
            class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
          >
            <Star class="size-4 fill-current" /> Tim Saya
          </h2>
          <ul class="py-1 text-sm">
            <li v-for="team in followedTeams" :key="team">
              <span class="flex items-center gap-2 py-1.5">
                <CountryChip :country="team" />
                {{ team }}
              </span>
            </li>
          </ul>
          <p
            class="text-primary flex items-center gap-2 py-1.5 text-sm font-semibold"
          >
            <Plus class="size-4" /> TAMBAHKAN TIM
          </p>
        </section>
      </aside>

      <main class="min-w-0 flex-1">
        <slot />
      </main>

      <!-- Ad rail: empty placeholders until a real ad script is wired in. -->
      <aside
        aria-label="Iklan"
        class="hidden w-[300px] shrink-0 space-y-4 xl:block"
      >
        <div
          v-for="slot in ['iklan-atas', 'iklan-bawah']"
          :key="slot"
          :data-ad-slot="slot"
          class="text-muted-foreground bg-background grid h-64 place-items-center border border-dashed text-xs"
        >
          Ruang iklan 300&times;250
        </div>
      </aside>
    </div>

    <footer class="bg-background border-t">
      <div
        class="text-muted-foreground mx-auto max-w-[1240px] px-4 py-6 text-xs sm:flex sm:justify-between"
      >
        <p>SkorKini — slicing statis dengan data dummy.</p>
        <p>Skor hanya untuk demonstrasi.</p>
      </div>
    </footer>
  </div>
</template>
