<script setup lang="ts">
import { liveCount, sports } from "~/data/matches";
import { leagues } from "~/data/leagues";

// Static stand-in for the "pinned" list a signed-in user would have.
const pinned = leagues.slice(0, 2);
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header class="bg-slate-900 text-white">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <NuxtLink to="/" class="text-lg font-bold tracking-tight">
          Skor<span class="text-emerald-400">Kini</span>
        </NuxtLink>
        <input
          type="search"
          placeholder="Cari tim, pemain, kompetisi"
          aria-label="Pencarian"
          class="ml-auto hidden w-72 rounded bg-slate-800 px-3 py-1.5 text-sm placeholder:text-slate-400 sm:block"
        />
      </div>
      <nav aria-label="Olahraga" class="border-t border-slate-800">
        <ul class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 text-sm">
          <li v-for="(sport, i) in sports" :key="sport">
            <span
              class="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap"
              :class="
                i === 0
                  ? 'border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300'
              "
            >
              {{ sport }}
              <span
                v-if="i === 0 && liveCount > 0"
                class="rounded bg-red-600 px-1.5 text-xs font-semibold"
                >{{ liveCount }}</span
              >
            </span>
          </li>
        </ul>
      </nav>
    </header>

    <div class="mx-auto flex max-w-6xl gap-4 px-4 py-4">
      <aside class="hidden w-56 shrink-0 space-y-4 lg:block">
        <nav
          aria-label="Liga yang disematkan"
          class="rounded bg-white shadow-sm"
        >
          <p class="border-b px-3 py-2 text-xs font-semibold uppercase">
            Liga Yang Disematkan
          </p>
          <ul class="py-1 text-sm">
            <li v-for="league in pinned" :key="league.id">
              <NuxtLink
                :to="`/sepak-bola/${league.id}`"
                class="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50"
              >
                <span class="text-amber-500" aria-hidden="true">&#9733;</span>
                {{ league.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Kompetisi" class="rounded bg-white shadow-sm">
          <p class="border-b px-3 py-2 text-xs font-semibold uppercase">
            Kompetisi
          </p>
          <ul class="py-1 text-sm">
            <li v-for="league in leagues" :key="league.id">
              <NuxtLink
                :to="`/sepak-bola/${league.id}`"
                class="block px-3 py-1.5 hover:bg-slate-50"
                active-class="bg-slate-100 font-semibold"
              >
                <span class="text-slate-500">{{ league.country }}:</span>
                {{ league.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <section class="rounded bg-white shadow-sm">
          <p class="border-b px-3 py-2 text-xs font-semibold uppercase">
            Tim Saya
          </p>
          <p class="px-3 py-3 text-sm text-slate-500">
            Belum ada tim yang diikuti.
          </p>
        </section>
      </aside>

      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>

    <footer class="border-t bg-white">
      <div
        class="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:flex sm:justify-between"
      >
        <p>SkorKini — slicing statis dengan data dummy.</p>
        <p>Skor hanya untuk demonstrasi.</p>
      </div>
    </footer>
  </div>
</template>
