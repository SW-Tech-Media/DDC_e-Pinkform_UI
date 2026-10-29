<script setup>
// Checklist เงื่อนไข PIN / นโยบายรหัสผ่าน แบบ real-time (Figma: D06 Validation)
// rules: [{ label, state: 'pass' | 'fail' | 'pending' }]
defineProps({
  rules: { type: Array, required: true },
});

const icon = { pass: "fas fa-check", fail: "fas fa-xmark", pending: "far fa-clock" };
const iconColor = { pass: "status-success-fg", fail: "status-danger-fg", pending: "icon-muted" };
const textClass = { pass: "text-status-success-fg", fail: "text-status-danger-fg", pending: "text-text-secondary" };
</script>

<template>
  <ul class="rules d-flex flex-column ga-2 pa-4 rounded-lg pf-bordered bg-bg-surface-muted" aria-live="polite">
    <li v-for="r in rules" :key="r.label" class="d-flex align-center ga-2 pf-type-body-sm" :class="textClass[r.state]">
      <v-icon :icon="icon[r.state]" :color="iconColor[r.state]" size="x-small" class="rule-icon" />
      {{ r.label }}
    </li>
  </ul>
</template>

<style scoped>
.rules {
  list-style: none;
}
.rule-icon {
  width: var(--pf-size-icon-sm);
}
</style>
