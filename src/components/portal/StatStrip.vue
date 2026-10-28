<script setup>
// แถบตัวเลขสถิติที่วางซ้อนขอบล่าง Hero (Figma D01 / S01)
// items: [{ key, value, label, short?, desktopOnly? }] · compact = มือถือ (ข้อความสั้น, ไม่แสดง desktopOnly)
import { computed } from "vue";
import { formatNumber } from "@/utils/format.js";

const props = defineProps({
  items: { type: Array, required: true },
  compact: { type: Boolean, default: false },
});

const shown = computed(() => (props.compact ? props.items.filter((x) => !x.desktopOnly) : props.items));
const display = (v) => (typeof v === "number" ? formatNumber(v) : v);
</script>

<template>
  <v-card class="pf-bordered pf-elevation-card" :class="compact ? 'px-2 py-4' : 'px-6 py-8'">
    <div class="d-flex">
      <div v-for="s in shown" :key="s.key" class="flex-1-1-0 text-center px-2 min-w-0">
        <div :class="compact ? 'pf-type-h4' : 'pf-type-kpi'" class="text-text-brand">{{ display(s.value) }}</div>
        <div class="text-text-secondary" :class="compact ? 'pf-type-caption' : 'pf-type-body-sm'">
          {{ compact ? s.short : s.label }}
        </div>
      </div>
    </div>
  </v-card>
</template>
