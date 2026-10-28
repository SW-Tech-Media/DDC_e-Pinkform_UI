<script setup>
// สถานะว่าง / ยังไม่มีข้อมูล (Figma: State/Empty & Error)
import IconTile from "./IconTile.vue";

defineProps({
  icon: { type: String, required: true },
  tone: { type: String, default: "teal" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>

<template>
  <div class="d-flex flex-column align-center text-center py-16 px-6">
    <IconTile :icon="icon" :tone="tone" size="lg" />
    <h1 class="pf-type-h3 text-text-primary mt-6">{{ title }}</h1>
    <p class="pf-type-body-md text-text-secondary mt-2">{{ description }}</p>
    <div v-if="$slots.actions" class="d-flex ga-3 mt-6">
      <slot name="actions" />
    </div>
  </div>
</template>
