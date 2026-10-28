<script setup>
// รายการ ชื่อ–ค่า (Figma: List/Key Value) — items: [{ label, value }] ปรับค่าแต่ละรายการได้ด้วย slot "value"
defineProps({
  items: { type: Array, required: true },
  columns: { type: Number, default: 1 },
});
</script>

<template>
  <dl class="kv" :style="{ '--kv-columns': columns }">
    <div v-for="item in items" :key="item.label" class="d-flex flex-column ga-1">
      <dt class="pf-type-caption text-text-tertiary">{{ item.label }}</dt>
      <dd class="pf-type-body-sm-strong text-text-primary">
        <slot name="value" :item="item">{{ item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.kv {
  display: grid;
  grid-template-columns: repeat(var(--kv-columns), minmax(0, 1fr));
  gap: var(--pf-space-16) var(--pf-space-24);
}
</style>
