<script setup>
// กราฟโดนัท + คำอธิบาย (Figma D02: ผู้ประกอบการที่ขอใบรับรองฯ) — SVG ไม่ใช้ไลบรารีภายนอก
// segments: [{ label, value, color: 'chart-series-1' }] · unit = หน่วยใต้ตัวเลขรวม
import { computed } from "vue";
import { formatNumber } from "@/utils/format.js";

const props = defineProps({
  segments: { type: Array, required: true },
  unit: { type: String, default: "" },
});

// วงกลมรัศมี 15.915 → เส้นรอบวง = 100 (คิดเป็น %)
const R = 15.915;
const total = computed(() => props.segments.reduce((a, s) => a + s.value, 0));
const arcs = computed(() => {
  let offset = 0;
  return props.segments.map((s) => {
    const pct = total.value ? (s.value / total.value) * 100 : 0;
    const arc = { ...s, dash: `${pct} ${100 - pct}`, offset: -offset };
    offset += pct;
    return arc;
  });
});
</script>

<template>
  <div class="d-flex flex-wrap align-center ga-6">
    <div class="donut position-relative flex-shrink-0">
      <svg viewBox="0 0 42 42" class="w-100 h-100" role="img" :aria-label="segments.map((s) => `${s.label} ${s.value}`).join(', ')">
        <circle cx="21" cy="21" :r="R" fill="none" class="donut__track" stroke-width="6" />
        <circle
          v-for="a in arcs"
          :key="a.label"
          cx="21"
          cy="21"
          :r="R"
          fill="none"
          stroke-width="6"
          :stroke-dasharray="a.dash"
          :stroke-dashoffset="a.offset"
          :style="{ stroke: `rgb(var(--v-theme-${a.color}))` }"
          transform="rotate(-90 21 21)"
        />
      </svg>
      <div class="position-absolute d-flex flex-column align-center justify-center donut__center">
        <span class="pf-type-h3 text-text-primary">{{ formatNumber(total) }}</span>
        <span class="pf-type-caption text-text-tertiary">{{ unit }}</span>
      </div>
    </div>
    <div class="d-flex flex-column ga-4">
      <div v-for="s in segments" :key="s.label">
        <div class="d-flex align-center ga-2 pf-type-caption text-text-secondary">
          <span class="legend-dot rounded-sm" :class="`bg-${s.color}`" />
          {{ s.label }}
        </div>
        <div class="pf-type-h4 text-text-primary">{{ formatNumber(s.value) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut {
  width: calc(var(--pf-space-120) + var(--pf-space-32));
  height: calc(var(--pf-space-120) + var(--pf-space-32));
}
.donut__track {
  stroke: rgb(var(--v-theme-chart-track));
}
.donut__center {
  inset: 0;
}
.legend-dot {
  width: var(--pf-space-10);
  height: var(--pf-space-10);
}
</style>
