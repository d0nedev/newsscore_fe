<script setup lang="ts">
import { Menu, Plus, Pin, Search, Star, User } from "@lucide/vue";
import { liveCount, sports } from "~/data/matches";
import { countries, leagues } from "~/data/leagues";
import { slugify } from "~/utils/slug";

const { pinnedLeagues } = usePinnedLeagues();
const followedTeams = ["Jerman", "Chelsea"];
const help = [
  "Ketentuan Penggunaan",
  "Kebijakan Privasi",
  "Cara Membaca Statistik",
  "Kontak",
];
const year = new Date().getFullYear();
</script>

<template>
  <div class="bg-muted text-foreground min-h-screen">
    <header class="bg-header text-header-foreground">
      <div class="mx-auto flex max-w-[1240px] items-center gap-2 px-4 py-3">
        <NuxtLink to="/" class="text-2xl font-extrabold tracking-tight">
          NEWS<span class="bg-primary ml-1 rounded px-1.5">SCORE</span>
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
          <p
            v-if="!pinnedLeagues.length"
            class="text-muted-foreground py-2 text-xs"
          >
            Belum ada liga yang disematkan.
          </p>
          <ul class="py-1 text-sm">
            <li v-for="league in pinnedLeagues" :key="league.id">
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

        <nav aria-label="Negara">
          <h2
            class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
          >
            Negara
          </h2>
          <ul class="py-1 text-sm">
            <li v-for="country in countries" :key="country">
              <NuxtLink
                :to="`/negara/${slugify(country)}`"
                class="hover:text-primary flex items-center gap-2 py-1.5"
                active-class="text-primary font-semibold"
              >
                <CountryChip :country="country" />
                {{ country }}
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

    <footer class="bg-header text-header-foreground mt-4">
      <div
        class="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <p class="text-xl font-extrabold tracking-tight">
            NEWS<span class="bg-primary ml-1 rounded px-1.5">SCORE</span>
          </p>
          <p class="text-header-foreground/60 mt-3 text-xs leading-relaxed">
            Skor langsung, klasemen, dan statistik pertandingan. Seluruh angka
            di situs ini masih data dummy untuk keperluan pengembangan.
          </p>
        </div>

        <nav aria-label="Jelajahi">
          <h2 class="text-header-foreground/50 text-xs font-bold uppercase">
            Jelajahi
          </h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="hover:text-primary"
                >Skor Langsung</NuxtLink
              >
            </li>
            <li v-for="league in leagues" :key="league.id">
              <NuxtLink
                :to="`/sepak-bola/${league.id}`"
                class="hover:text-primary"
                >{{ league.name }}</NuxtLink
              >
            </li>
          </ul>
        </nav>

        <nav aria-label="Bantuan">
          <h2 class="text-header-foreground/50 text-xs font-bold uppercase">
            Bantuan
          </h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="item in help" :key="item">
              <span class="text-header-foreground/70">{{ item }}</span>
            </li>
          </ul>
        </nav>

        <section>
          <h2 class="text-header-foreground/50 text-xs font-bold uppercase">
            Tentang Data
          </h2>
          <p class="text-header-foreground/60 mt-3 text-xs leading-relaxed">
            Jadwal, hasil, dan klasemen diperbarui otomatis saat sumber data
            tersambung. Sampai saat itu, semua isinya contoh statis.
          </p>
          <p class="text-header-foreground/60 mt-3 text-xs">
            Ada koreksi data?
            <span class="text-primary font-semibold">Hubungi kami</span>
          </p>
        </section>
      </div>

      <div class="border-header-foreground/10 border-t">
        <div
          class="text-header-foreground/50 mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-4 text-xs sm:flex-row sm:justify-between"
        >
          <p>&copy; {{ year }} NEWSSCORE</p>
          <p>Skor hanya untuk demonstrasi.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
