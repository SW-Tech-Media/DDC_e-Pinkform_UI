<script setup>
// รายการพื้นที่ที่ยังไม่ปลอดโรคระบาด แบบมือถือ (Figma S02) — แทนตารางของ D03
// items: [{ id, province, district, subdistrict, freeAt, days }] (freeAt จัดรูปแบบแล้ว) · text = outbreakText.table
import StatusBadge from "@/components/StatusBadge.vue";

defineProps({
  items: { type: Array, required: true },
  text: { type: Object, required: true },
});
</script>

<template>
  <div>
    <div v-for="a in items" :key="a.id" class="d-flex align-center ga-3 py-4 pf-bordered-bottom">
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-label-md text-text-primary">{{ text.areaName(a.subdistrict, a.district) }}</div>
        <div class="pf-type-caption text-text-secondary">{{ text.freeShort(a.province, a.freeAt) }}</div>
      </div>
      <StatusBadge tone="danger" dot>{{ text.remainingShort(a.days) }}</StatusBadge>
    </div>
  </div>
</template>
