<script setup>
// ปุ่มเลือกแบบกลุ่ม (Figma: Segmented Control ใน D17) — options: [{ value, label }]
defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: "" },
});
const model = defineModel({ type: [String, Number], default: null });
</script>

<template>
  <v-btn-toggle
    v-model="model"
    mandatory
    density="comfortable"
    rounded="lg"
    class="segmented pa-1"
    :aria-label="label"
  >
    <v-btn
      v-for="o in options"
      :key="o.value"
      :value="o.value"
      rounded="md"
      class="pf-type-label-md px-4"
      :class="model === o.value ? 'bg-primary text-text-on-inverse' : 'text-text-secondary'"
    >
      {{ o.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<style scoped>
.segmented {
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  height: auto;
  gap: var(--pf-space-2);
}
.segmented :deep(.v-btn) {
  height: var(--pf-size-control-sm) !important;
  border: 0 !important;
}
.segmented :deep(.v-btn__overlay) {
  opacity: 0;
}
</style>
