<script setup>
// หัวหน้าจอ Back Office: หัวข้อ + คำอธิบาย ด้านซ้าย / ปุ่มด้านขวา (slot actions)
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>

<template>
  <div class="d-flex flex-wrap align-end justify-space-between ga-4 mb-6">
    <div>
      <h1 class="pf-type-h2 text-text-primary">{{ title }}</h1>
      <p v-if="description" class="pf-type-body-md text-text-secondary mt-1">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="d-flex flex-wrap align-center ga-3">
      <slot name="actions" />
    </div>
  </div>
</template>
