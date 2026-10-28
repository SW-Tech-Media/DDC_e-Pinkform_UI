<script setup>
// กราฟแท่ง (Figma: Chart/Bar Group, Chart/Legend Item) — ไม่ใช้ไลบรารีภายนอก
// labels: ['13','14',...]  series: [{ name: 'คำขอ', color: 'chart-series-1', data: [52, 61, ...] }]
import { computed } from "vue";

const props = defineProps({
  labels: { type: Array, required: true },
  series: { type: Array, required: true },
  ticks: { type: Number, default: 4 },
  max: { type: Number, default: 0 },
  axisLabel: { type: String, default: "" },
  hideLegend: { type: Boolean, default: false },
});

const top = computed(() => {
  if (props.max) return props.max;
  const peak = Math.max(1, ...props.series.flatMap((s) => s.data));
  const step = 10 ** Math.floor(Math.log10(peak));
  return Math.ceil(peak / step) * step;
});
const tickValues = computed(() =>
  Array.from({ length: props.ticks + 1 }, (_, i) => Math.round((top.value / props.ticks) * (props.ticks - i)))
);
const pct = (v) => `${(v / top.value) * 100}%`;
const fmt = (v) => v.toLocaleString("th-TH");
</script>

<template>
  <div>
    <div v-if="!hideLegend" class="d-flex flex-wrap ga-4 mb-4">
      <div v-for="s in series" :key="s.name" class="d-flex align-center ga-2 pf-type-caption text-text-secondary">
        <span class="legend-dot" :class="`bg-${s.color}`" />
        {{ s.name }}
      </div>
    </div>
    <div class="d-flex ga-3">
      <div class="axis d-flex flex-column justify-space-between text-end pf-type-caption text-text-tertiary">
        <span v-for="t in tickValues" :key="t">{{ fmt(t) }}</span>
      </div>
      <div class="flex-grow-1">
        <div class="plot position-relative d-flex align-end justify-space-around ga-1">
          <div v-for="t in tickValues" :key="`g${t}`" class="gridline" :style="{ bottom: pct(t) }" />
          <div v-for="(label, i) in labels" :key="label" class="group d-flex align-end justify-center h-100">
            <div
              v-for="s in series"
              :key="s.name"
              class="bar"
              :class="`bg-${s.color}`"
              :style="{ height: pct(s.data[i] ?? 0) }"
              :title="`${s.name} ${label}: ${fmt(s.data[i] ?? 0)}`"
            />
          </div>
        </div>
        <div class="d-flex justify-space-around ga-1 mt-2">
          <span v-for="label in labels" :key="label" class="group text-center pf-type-caption text-text-tertiary">
            {{ label }}
          </span>
        </div>
      </div>
    </div>
    <p v-if="axisLabel" class="pf-type-caption text-text-tertiary mt-2">{{ axisLabel }}</p>
  </div>
</template>

<style scoped>
.legend-dot {
  width: var(--pf-space-10);
  height: var(--pf-space-10);
  border-radius: var(--pf-radius-xs);
}
.axis {
  min-width: var(--pf-space-32);
  height: calc(var(--pf-space-120) * 2);
  margin-top: calc(-1 * var(--pf-type-caption-line) / 2);
  margin-bottom: calc(-1 * var(--pf-type-caption-line) / 2);
}
.plot {
  height: calc(var(--pf-space-120) * 2);
}
.gridline {
  position: absolute;
  inset-inline: 0;
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-chart-track));
}
.group {
  flex: 1 1 0;
  gap: var(--pf-space-2);
  min-width: 0;
}
.bar {
  position: relative;
  width: min(var(--pf-space-20), 40%);
  border-radius: var(--pf-radius-xs) var(--pf-radius-xs) 0 0;
}
</style>
