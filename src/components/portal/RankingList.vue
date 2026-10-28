<script setup>
// รายการจัดอันดับ + แถบสัดส่วน (Figma D02: ประเทศปลายทาง, สินค้าที่ส่งออกมากที่สุด)
// items: [{ name, value }] (เรียงมาก → น้อย) · color = ชื่อสีใน token ของแถบ
import { computed } from "vue";
import { formatNumber } from "@/utils/format.js";

const props = defineProps({
  items: { type: Array, required: true },
  color: { type: String, default: "chart-series-1" },
  highlight: { type: String, default: "" },
});

const peak = computed(() => Math.max(1, ...props.items.map((x) => x.value)));
const rank = (i) => String(i + 1).padStart(2, "0");
</script>

<template>
  <ol class="ranking">
    <li
      v-for="(item, i) in items"
      :key="item.name"
      class="d-flex align-center ga-4 py-2"
      :class="{ 'ranking--dim': highlight && highlight !== item.name }"
    >
      <span class="ranking__no pf-type-body-sm text-text-tertiary">{{ rank(i) }}</span>
      <span class="flex-grow-1 min-w-0 text-truncate pf-type-body-md text-text-primary">{{ item.name }}</span>
      <span class="ranking__track bg-chart-track rounded-pill">
        <span class="ranking__bar d-block h-100 rounded-pill" :class="`bg-${color}`" :style="{ width: `${(item.value / peak) * 100}%` }" />
      </span>
      <span class="ranking__value text-end pf-type-body-sm-strong text-text-primary">{{ formatNumber(item.value) }}</span>
    </li>
  </ol>
</template>

<style scoped>
.ranking {
  list-style: none;
}
.ranking__no {
  min-width: var(--pf-space-20);
}
.ranking__track {
  width: calc(var(--pf-space-80) + var(--pf-space-24));
  height: var(--pf-space-6);
  flex-shrink: 0;
  overflow: hidden;
}
.ranking__bar {
  transition: width var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.ranking__value {
  min-width: var(--pf-space-48);
}
.ranking--dim {
  opacity: 0.45;
}
</style>
