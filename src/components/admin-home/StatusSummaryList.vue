<script setup>
// รายการสรุปจำนวนตามสถานะ: จุดสี + ชื่อ + จำนวน (Figma D07 · สถานะคำขอวันนี้)
// items: [{ label, count, color }]  color = ชื่อสีใน Design Token
import { formatNumber } from "@/utils/format.js";

defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <ul class="list d-flex flex-column ga-3">
    <li v-for="item in items" :key="item.label" class="d-flex align-center ga-3">
      <span class="swatch rounded-sm flex-shrink-0" :class="`bg-${item.color}`" />
      <span class="flex-grow-1 pf-type-body-sm text-text-primary">{{ item.label }}</span>
      <span class="pf-type-body-sm-strong text-text-primary">{{ formatNumber(item.count) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
}
.swatch {
  width: var(--pf-space-10);
  height: var(--pf-space-10);
}
</style>
