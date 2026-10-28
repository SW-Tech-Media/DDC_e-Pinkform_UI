<script setup>
// รายการ ชื่อ–ค่า แบบแนวนอน (ชื่อซ้าย / ค่าขวา) ตาม Figma D10, D11, D12
// items: [{ label, value, lines? }] — lines = หลายบรรทัด · ปรับค่าด้วย slot "value"
// KeyValueList กลางเป็นแบบชื่ออยู่บนค่า จึงทำ component นี้แยกไว้
defineProps({
  items: { type: Array, required: true },
  dense: { type: Boolean, default: false },
});
</script>

<template>
  <dl class="kv-rows" :class="dense ? 'kv-rows--dense' : ''">
    <template v-for="item in items" :key="item.label">
      <dt class="pf-type-body-sm text-text-tertiary">{{ item.label }}</dt>
      <dd class="pf-type-body-sm-strong text-text-primary min-w-0">
        <slot name="value" :item="item">
          <template v-if="item.lines">
            <span v-for="line in item.lines" :key="line" class="d-block">{{ line }}</span>
          </template>
          <template v-else>{{ item.value }}</template>
        </slot>
      </dd>
    </template>
  </dl>
</template>

<style scoped>
.kv-rows {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: var(--pf-space-12) var(--pf-space-16);
  overflow-wrap: anywhere;
}
.kv-rows--dense {
  gap: var(--pf-space-8) var(--pf-space-16);
}
</style>
