<script setup lang="ts">
import type { CareerGroup, CareerRow } from "~/types/match";

const props = defineProps<{ rows: CareerRow[]; goalkeeper?: boolean }>();

const order: CareerGroup[] = [
  "Liga",
  "Piala Domestik",
  "Piala Internasional",
  "Tim Nasional",
];
// Only offer a group the player actually has rows for.
const groups = computed(() =>
  order.filter((group) => props.rows.some((row) => row.group === group)),
);
const group = ref<CareerGroup>();
const active = computed(() => group.value ?? groups.value[0]);

const visible = computed(() =>
  props.rows.filter((row) => row.group === active.value),
);

const total = computed(() =>
  visible.value.reduce(
    (sum, row) => ({
      apps: sum.apps + row.apps,
      goals: sum.goals + (row.goals ?? 0),
      assists: sum.assists + (row.assists ?? 0),
      cleanSheets: sum.cleanSheets + (row.cleanSheets ?? 0),
      yellow: sum.yellow + row.yellow,
      red: sum.red + row.red,
    }),
    { apps: 0, goals: 0, assists: 0, cleanSheets: 0, yellow: 0, red: 0 },
  ),
);
</script>

<template>
  <div>
    <div class="px-4 pb-3">
      <PillTabs
        :model-value="active"
        :items="groups"
        label="Bagian karir"
        @update:model-value="group = $event as CareerGroup"
      />
    </div>

    <Table class="text-sm">
      <TableHeader>
        <TableRow class="text-muted-foreground text-xs uppercase">
          <TableHead class="w-24 pl-4">Musim</TableHead>
          <TableHead>Tim</TableHead>
          <TableHead>Kompetisi</TableHead>
          <TableHead class="w-12 text-center">Nilai</TableHead>
          <TableHead class="w-12 text-center" title="Penampilan"
            >Main</TableHead
          >
          <template v-if="goalkeeper">
            <TableHead class="w-14 text-center" title="Persentase penyelamatan">
              SV%
            </TableHead>
            <TableHead class="w-12 text-center" title="Nirbobol">CS</TableHead>
          </template>
          <template v-else>
            <TableHead class="w-12 text-center">Gol</TableHead>
            <TableHead class="w-12 text-center">Ast</TableHead>
          </template>
          <TableHead class="w-8 text-center" title="Kartu kuning">KK</TableHead>
          <TableHead class="w-8 pr-4 text-center" title="Kartu merah">
            KM
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in visible" :key="row.season + row.competition">
          <TableCell class="text-muted-foreground pl-4 tabular-nums">
            {{ row.season }}
          </TableCell>
          <TableCell>
            <component
              :is="row.teamId ? 'NuxtLink' : 'span'"
              :to="row.teamId ? `/tim/${row.teamId}` : undefined"
              class="flex min-w-0 items-center gap-2 font-semibold"
              :class="row.teamId ? 'hover:text-primary' : ''"
            >
              <TeamBadge :badge="row.team.slice(0, 2).toUpperCase()" />
              <span class="truncate">{{ row.team }}</span>
            </component>
          </TableCell>
          <TableCell>
            <span class="flex min-w-0 items-center gap-2">
              <CountryChip :country="row.country" />
              <span class="truncate">{{ row.competition }}</span>
            </span>
          </TableCell>
          <TableCell class="text-center">
            <RatingBadge :rating="row.rating" />
          </TableCell>
          <TableCell class="text-center tabular-nums">{{ row.apps }}</TableCell>
          <template v-if="goalkeeper">
            <TableCell class="text-center tabular-nums">
              {{ row.savePct?.toFixed(1) ?? "-" }}
            </TableCell>
            <TableCell class="text-center font-semibold tabular-nums">
              {{ row.cleanSheets ?? 0 }}
            </TableCell>
          </template>
          <template v-else>
            <TableCell class="text-center font-semibold tabular-nums">
              {{ row.goals ?? 0 }}
            </TableCell>
            <TableCell class="text-center tabular-nums">
              {{ row.assists ?? 0 }}
            </TableCell>
          </template>
          <TableCell class="text-center tabular-nums">{{
            row.yellow
          }}</TableCell>
          <TableCell class="pr-4 text-center tabular-nums">{{
            row.red
          }}</TableCell>
        </TableRow>

        <TableRow class="bg-muted/60 font-semibold">
          <TableCell class="pl-4 text-xs uppercase" colspan="4"
            >Total</TableCell
          >
          <TableCell class="text-center tabular-nums">{{
            total.apps
          }}</TableCell>
          <template v-if="goalkeeper">
            <TableCell class="text-muted-foreground text-center">-</TableCell>
            <TableCell class="text-center tabular-nums">{{
              total.cleanSheets
            }}</TableCell>
          </template>
          <template v-else>
            <TableCell class="text-center tabular-nums">{{
              total.goals
            }}</TableCell>
            <TableCell class="text-center tabular-nums">{{
              total.assists
            }}</TableCell>
          </template>
          <TableCell class="text-center tabular-nums">{{
            total.yellow
          }}</TableCell>
          <TableCell class="pr-4 text-center tabular-nums">{{
            total.red
          }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
