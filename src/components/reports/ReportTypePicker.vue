<script setup>
// เลือกประเภทรายงาน (B-13) — การ์ดแบบ radio พร้อมไอคอนและคำอธิบาย
// options: [{ value, label, description, icon, tone }]
import IconTile from "@/components/IconTile.vue";

defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: "" },
});
const model = defineModel({ type: String, default: null });
</script>

<template>
  <div class="d-flex flex-column ga-2" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="model === o.value"
      class="option d-flex align-center ga-3 pa-3 rounded-lg text-start"
      :class="model === o.value ? 'option--active bg-accent-teal-subtle' : 'bg-surface'"
      @click="model = o.value"
    >
      <IconTile :icon="o.icon" :tone="o.tone" />
      <span class="flex-grow-1 min-w-0">
        <span class="d-block pf-type-label-md text-text-primary">{{ o.label }}</span>
        <span class="d-block pf-type-caption text-text-tertiary">{{ o.description }}</span>
      </span>
      <v-icon
        :icon="model === o.value ? 'fas fa-circle-check' : 'far fa-circle'"
        :color="model === o.value ? 'primary' : 'icon-muted'"
        size="small"
      />
    </button>
  </div>
</template>

<style scoped>
.option {
  width: 100%;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  transition: border-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.option:hover,
.option--active {
  border-color: rgb(var(--v-theme-border-focus));
}
.option:focus-visible {
  outline: none;
  box-shadow: var(--pf-shadow-focus);
}
</style>
