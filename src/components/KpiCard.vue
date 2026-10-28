<script setup>
// การ์ดตัวเลขสรุป (Figma: Card/KPI)
// trend: { direction: 'up' | 'down', value: '12%', text: 'จากเมื่อวาน' }
import IconTile from "./IconTile.vue";

defineProps({
  icon: { type: String, required: true },
  tone: { type: String, default: "teal" },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  caption: { type: String, default: "" },
  trend: { type: Object, default: null },
});
</script>

<template>
  <v-card class="pf-bordered pa-5 h-100">
    <div class="d-flex align-start ga-4">
      <IconTile :icon="icon" :tone="tone" />
      <div class="min-w-0">
        <div class="pf-type-body-sm text-text-secondary">{{ label }}</div>
        <div class="pf-type-kpi text-text-primary">{{ value }}</div>
        <div v-if="trend" class="pf-type-caption text-text-tertiary">
          <span
            class="pf-type-caption-strong"
            :class="trend.direction === 'down' ? 'text-status-danger-fg' : 'text-status-success-fg'"
          >
            <v-icon :icon="trend.direction === 'down' ? 'fas fa-caret-down' : 'fas fa-caret-up'" size="x-small" />
            {{ trend.value }}
          </span>
          {{ trend.text }}
        </div>
        <div v-else-if="caption" class="pf-type-caption text-text-tertiary">{{ caption }}</div>
      </div>
    </div>
  </v-card>
</template>
