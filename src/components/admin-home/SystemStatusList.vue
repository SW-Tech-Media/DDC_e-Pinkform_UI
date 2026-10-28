<script setup>
// สถานะการเชื่อมโยงระบบภายนอก (Figma D07) — items: [{ name, detail, label, tone }]
import StatusBadge from "@/components/StatusBadge.vue";

defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <ul class="list">
    <li v-for="item in items" :key="item.name" class="d-flex align-center ga-3 px-6 py-4">
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-body-sm-strong text-text-primary">{{ item.name }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.detail }}</div>
      </div>
      <StatusBadge :tone="item.tone" dot>{{ item.label }}</StatusBadge>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
}
</style>
