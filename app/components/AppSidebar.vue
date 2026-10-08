<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { Pin, Plus, Star, X } from "@lucide/vue";
import { slugify } from "~/utils/slug";

const { pinnedLeagues } = usePinnedLeagues();
const { competitions, countries } = useCompetitions();

// Long lists start short; one click shows the rest, another folds them back.
const FIRST = 3;
const allCompetitions = ref(false);
const allCountries = ref(false);

const followed = useFollowed("team");
const myTeams = useTeams(followed.ids);

const adding = ref(false);
const q = ref("");
const search = useSearch(refDebounced(q, 300));
const candidates = computed(() =>
  (search.data.value?.teams ?? []).filter((t) => !followed.isFollowed(t.id)),
);
const add = (id: string) => {
  followed.toggle(id);
  q.value = "";
};
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
            <LeagueMark :country="league.country" :logo="league.logo" />
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
        <li
          v-for="league in competitions.slice(
            0,
            allCompetitions ? undefined : FIRST,
          )"
          :key="league.id"
        >
          <NuxtLink
            :to="`/sepak-bola/${league.id}`"
            class="hover:text-primary flex items-center gap-2 py-1.5"
            active-class="text-primary font-semibold"
          >
            <LeagueMark :country="league.country" :logo="league.logo" />
            {{ league.name }}
          </NuxtLink>
        </li>
      </ul>
      <Button
        v-if="competitions.length > FIRST"
        variant="link"
        class="h-auto px-0 py-1.5 text-sm font-semibold"
        :aria-expanded="allCompetitions"
        @click="allCompetitions = !allCompetitions"
      >
        {{ allCompetitions ? "Muat lebih sedikit" : "Muat lebih banyak" }}
      </Button>
    </nav>

    <nav aria-label="Negara">
      <h2
        class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
      >
        Negara
      </h2>
      <ul class="py-1 text-sm">
        <li
          v-for="country in countries.slice(
            0,
            allCountries ? undefined : FIRST,
          )"
          :key="country"
        >
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
      <Button
        v-if="countries.length > FIRST"
        variant="link"
        class="h-auto px-0 py-1.5 text-sm font-semibold"
        :aria-expanded="allCountries"
        @click="allCountries = !allCountries"
      >
        {{ allCountries ? "Muat lebih sedikit" : "Muat lebih banyak" }}
      </Button>
    </nav>

    <section aria-label="Tim saya">
      <h2
        class="flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase"
      >
        <Star class="size-4 fill-current" /> Tim Saya
      </h2>
      <p
        v-if="!followed.ids.value.length"
        class="text-muted-foreground py-2 text-xs"
      >
        Belum ada tim yang diikuti.
      </p>
      <ul class="py-1 text-sm">
        <li
          v-for="team in myTeams"
          :key="team.id"
          class="group flex items-center gap-2"
        >
          <NuxtLink
            :to="`/tim/${team.id}`"
            class="hover:text-primary flex min-w-0 flex-1 items-center gap-2 py-1.5"
            active-class="text-primary font-semibold"
          >
            <TeamBadge :badge="team.badge" :logo="team.logo" />
            <span class="truncate">{{ team.name }}</span>
          </NuxtLink>
          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground size-6"
            :aria-label="`Berhenti mengikuti ${team.name}`"
            @click="followed.toggle(team.id)"
          >
            <X class="size-3.5" />
          </Button>
        </li>
      </ul>

      <div v-if="adding" class="space-y-1">
        <Input
          v-model="q"
          type="search"
          placeholder="Cari tim…"
          aria-label="Cari tim"
          class="h-8 text-sm"
          autofocus
          @keydown.esc="adding = false"
        />
        <p
          v-if="
            q.trim().length >= 2 && search.isSuccess.value && !candidates.length
          "
          class="text-muted-foreground py-1 text-xs"
        >
          Tim tidak ditemukan.
        </p>
        <ul class="text-sm">
          <li v-for="team in candidates" :key="team.id">
            <button
              type="button"
              class="hover:text-primary flex w-full items-center gap-2 py-1.5 text-left"
              @click="add(team.id)"
            >
              <TeamBadge :badge="team.badge" :logo="team.logo" />
              <span class="truncate">{{ team.name }}</span>
            </button>
          </li>
        </ul>
      </div>
      <Button
        variant="link"
        class="h-auto gap-2 px-0 py-1.5 text-sm font-semibold"
        :aria-expanded="adding"
        @click="adding = !adding"
      >
        <template v-if="adding">Selesai</template>
        <template v-else><Plus class="size-4" /> Tambahkan tim</template>
      </Button>
    </section>
  </div>
</template>
