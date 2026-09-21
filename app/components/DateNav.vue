<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { matchDates, today } from "~/data/matches";

const model = defineModel<string>({ required: true });

const index = computed(() => matchDates.indexOf(model.value));

function step(delta: number) {
  const next = matchDates[index.value + delta];
  if (next) model.value = next;
}

// "20.09.2026" -> "Min 20.09"
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
function label(date: string) {
  if (date === today) return "Hari ini";
  const [day, month, year] = date.split(".").map(Number);
  const weekday = dayNames[new Date(year!, month! - 1, day!).getDay()];
  return `${weekday} ${day!.toString().padStart(2, "0")}.${month!.toString().padStart(2, "0")}`;
}
</script>

<template>
  <nav
    aria-label="Tanggal pertandingan"
    class="flex items-center gap-1 rounded-full border px-1"
  >
    <Button
      variant="ghost"
      size="icon"
      class="size-8"
      aria-label="Tanggal sebelumnya"
      :disabled="index <= 0"
      @click="step(-1)"
    >
      <ChevronLeft />
    </Button>
    <slot />
    <ul class="flex flex-1 justify-center gap-1 overflow-x-auto">
      <li v-for="date in matchDates" :key="date">
        <Button
          variant="ghost"
          size="sm"
          class="whitespace-nowrap"
          :class="
            date === model
              ? 'border-primary rounded-none border-b-2 font-semibold'
              : 'text-muted-foreground'
          "
          :aria-pressed="date === model"
          @click="model = date"
        >
          {{ label(date) }}
        </Button>
      </li>
    </ul>
    <Button
      variant="ghost"
      size="icon"
      class="size-8"
      aria-label="Tanggal berikutnya"
      :disabled="index >= matchDates.length - 1"
      @click="step(1)"
    >
      <ChevronRight />
    </Button>
  </nav>
</template>
