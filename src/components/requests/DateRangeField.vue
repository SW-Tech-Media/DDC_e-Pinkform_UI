<script setup>
// ช่องเลือกช่วงวันที่ (Figma: Form/Date Range) — v-model = ["YYYY-MM-DD", "YYYY-MM-DD"] หรือ []
import { computed, ref } from "vue";
import { formatDate } from "@/utils/format.js";

defineProps({
  id: { type: String, default: undefined },
  placeholder: { type: String, default: "" },
});
const model = defineModel({ type: Array, default: () => [] });
const open = ref(false);

const pad = (n) => String(n).padStart(2, "0");
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDate = (s) => new Date(`${s}T00:00:00`);

const display = computed(() => {
  const [from, to] = model.value;
  if (!from) return "";
  return to && to !== from ? `${formatDate(from)} – ${formatDate(to)}` : formatDate(from);
});

const pickerValue = computed({
  get: () => model.value.filter(Boolean).map(toDate),
  set: (dates) => {
    const list = (dates ?? []).map((d) => toIso(new Date(d))).sort();
    model.value = list.length ? [list[0], list[list.length - 1]] : [];
    if (list.length > 1) open.value = false;
  },
});
</script>

<template>
  <v-menu v-model="open" :close-on-content-click="false" location="bottom start">
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :id="id"
        :model-value="display"
        :placeholder="placeholder"
        prepend-inner-icon="far fa-calendar"
        readonly
        hide-details
        clearable
        @click:clear="model = []"
      />
    </template>
    <v-card class="pf-bordered pf-elevation-modal">
      <v-date-picker v-model="pickerValue" multiple="range" color="primary" hide-header show-adjacent-months />
    </v-card>
  </v-menu>
</template>
