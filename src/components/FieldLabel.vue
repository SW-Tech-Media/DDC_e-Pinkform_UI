<script setup>
// ป้ายชื่อเหนือช่องกรอก (Figma: Form/Field) — required แสดง * สีแดง
defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  for: { type: String, default: undefined },
});
</script>

<template>
  <label :for="$props.for" class="d-block pf-type-label-md text-text-primary mb-2">
    {{ label }}<span v-if="required" class="text-status-danger-fg"> *</span>
  </label>
</template>
