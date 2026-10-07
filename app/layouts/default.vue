<script setup lang="ts">
import { Menu, Search, Star, User, X } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";

const { byCountry } = useCompetitions();
// Footer "Jelajahi" lists the home country's competitions.
const indonesian = computed(() => byCountry("Indonesia"));

// Below lg the sidebar lives in a drawer; close it once a link navigates.
const menuOpen = ref(false);
const route = useRoute();
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
);
const sports = [
  "Sepak Bola",
  "Tenis",
  "Bola Basket",
  "Hoki",
  "Bisbol",
  "Kriket",
  "Esports",
];
const { today } = useMatchDays();
const { data: todayMatches } = useMatches({ date: today });
const liveCount = computed(
  () => todayMatches.value?.filter((m) => m.status === "live").length ?? 0,
);
const help = [
  "Ketentuan Penggunaan",
  "Kebijakan Privasi",
  "Cara Membaca Statistik",
  "Kontak",
];
const year = new Date().getFullYear();
const showAdSlots = import.meta.dev;
</script>

<template>
  <div class="bg-muted text-foreground flex min-h-dvh flex-col">
    <a
      href="#konten"
      class="bg-background text-foreground sr-only z-50 rounded px-3 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >Lewati ke konten</a
    >
    <header class="bg-header text-header-foreground">
      <div class="mx-auto flex max-w-[1240px] items-center gap-2 px-4 py-5">
        <NuxtLink to="/" class="text-2xl font-extrabold tracking-tight">
          NEWS<span class="bg-primary ml-1 rounded px-1.5">SCORE</span>
        </NuxtLink>
        <!-- Search and sign-in have no backend yet: disabled, not fake-clickable. -->
        <Button
          variant="ghost"
          size="icon"
          aria-label="Pencarian (segera hadir)"
          disabled
          class="hover:bg-header-foreground/10 ml-auto rounded-full"
        >
          <Search />
        </Button>
        <Button
          variant="ghost"
          disabled
          class="hover:bg-header-foreground/10 hidden gap-2 rounded-full sm:flex"
        >
          <User />
          <span class="font-semibold">Masuk</span>
        </Button>

        <DialogRoot v-model:open="menuOpen">
          <DialogTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              class="hover:bg-header-foreground/10 rounded-full lg:hidden"
            >
              <Menu />
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-50 bg-black/40" />
            <DialogContent
              :aria-describedby="undefined"
              class="bg-background fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto p-4 shadow-lg"
            >
              <div class="mb-4 flex items-center justify-between">
                <DialogTitle class="font-heading text-base font-bold">
                  Menu
                </DialogTitle>
                <DialogClose as-child>
                  <Button variant="ghost" size="icon" aria-label="Tutup menu">
                    <X />
                  </Button>
                </DialogClose>
              </div>
              <AppSidebar />
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    </header>

    <nav aria-label="Olahraga" class="bg-background border-b">
      <ul
        class="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 text-sm font-semibold"
      >
        <li>
          <NuxtLink
            to="/"
            class="border-primary text-primary flex items-center gap-2 border-b-3 px-3 py-3 whitespace-nowrap uppercase"
          >
            <Star class="size-4" />
            {{ sports[0] }}
            <Badge v-if="liveCount > 0" variant="secondary" class="rounded-sm">
              {{ liveCount }}
            </Badge>
          </NuxtLink>
        </li>
        <!-- Other sports have no pages yet. -->
        <li v-for="sport in sports.slice(1)" :key="sport">
          <span
            aria-disabled="true"
            class="text-muted-foreground/60 flex items-center gap-2 px-3 py-3 whitespace-nowrap uppercase"
          >
            {{ sport }}
          </span>
        </li>
      </ul>
    </nav>

    <div class="mx-auto flex w-full max-w-[1240px] flex-1 gap-4 px-4 py-4">
      <aside class="hidden w-52 shrink-0 lg:block">
        <AppSidebar />
      </aside>

      <main id="konten" tabindex="-1" class="min-w-0 flex-1 outline-none">
        <slot />
      </main>

      <!-- Ad rail: placeholders show in dev only, until a real ad script is wired in. -->
      <aside
        v-if="showAdSlots"
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
            <li v-for="league in indonesian" :key="league.id">
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
            <span class="font-semibold">Hubungi kami</span>
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
