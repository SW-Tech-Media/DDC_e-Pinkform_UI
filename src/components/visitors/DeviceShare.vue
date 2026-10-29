<script setup>
// สัดส่วนอุปกรณ์ที่เข้าชม (B-20) — items: [{ key, label, icon, share, visits }] · share เป็น %
import IconTile from "@/components/IconTile.vue";

defineProps({
  items: { type: Array, required: true },
  visitsText: { type: Function, required: true },
});
const tones = ["teal", "pink", "neutral"];
const bars = ["chart-series-1", "chart-series-2", "chart-series-muted"];
</script>

<template>
  <div class="d-flex flex-column ga-5">
    <div v-for="(d, i) in items" :key="d.key" class="d-flex align-center ga-4">
      <IconTile :icon="d.icon" :tone="tones[i % tones.length]" />
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex justify-space-between align-baseline ga-2">
          <span class="pf-type-body-sm-strong text-truncate">{{ d.label }}</span>
          <span class="pf-type-h4 text-text-primary">{{ d.share }}%</span>
        </div>
        <v-progress-linear
          :model-value="d.share"
          :color="bars[i % bars.length]"
          bg-color="chart-track"
          bg-opacity="1"
          rounded
          class="my-1 device-share__bar"
        />
        <div class="pf-type-caption text-text-tertiary">{{ visitsText(d.visits) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-share__bar {
  height: var(--pf-space-8) !important;
}
</style>
