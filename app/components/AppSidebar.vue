<script setup lang="ts">
import { Pin, Plus, Star } from "@lucide/vue";
import { slugify } from "~/utils/slug";

const { pinnedLeagues } = usePinnedLeagues();
const { competitions, countries } = useCompetitions();
const followedTeams = ["Jerman", "Chelsea"];
</script>

<template>
  <div class="space-y-6">
    <nav aria-label="Liga yang disematkan">
      <h2
        class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
      >
        <Pin class="size-4" /> Liga yang disematkan
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
        <li v-for="league in competitions" :key="league.id">
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
      <!-- Not wired up yet: shown disabled so it doesn't read as a working link. -->
      <Button
        variant="link"
        disabled
        class="h-auto gap-2 px-0 py-1.5 text-sm font-semibold"
      >
        <Plus class="size-4" /> Tambahkan tim
      </Button>
    </section>
  </div>
</template>
