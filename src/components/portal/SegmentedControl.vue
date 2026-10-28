<script setup>
// ปุ่มสลับแบบกลุ่ม (Figma D02 / D03: รายเดือน · รายปี · ย้อนหลัง 5 ปี)
// options: [{ value, label }] · v-model = value ที่เลือก
defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: "" },
});
const model = defineModel({ type: String, required: true });
</script>

<template>
  <div class="segmented d-inline-flex ga-1 pa-1 rounded-lg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="model === o.value"
      class="segmented__item pf-type-label-md rounded-lg px-4"
      :class="model === o.value ? 'bg-bg-inverse text-text-on-inverse' : 'text-text-secondary'"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  max-width: 100%;
  overflow-x: auto;
}
.segmented__item {
  height: var(--pf-size-control-sm);
  white-space: nowrap;
  transition: background-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.segmented__item:not([aria-checked="true"]):hover {
  background: rgb(var(--v-theme-bg-subtle));
}
</style>
