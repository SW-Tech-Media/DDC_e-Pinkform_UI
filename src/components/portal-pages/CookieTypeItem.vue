<script setup>
// แถวตั้งค่าคุกกี้แต่ละประเภท (P-07) — type: { key, icon, tone, title, description, locked? }
// locked = คุกกี้จำเป็น ปิดไม่ได้
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";

const props = defineProps({
  type: { type: Object, required: true },
  alwaysOn: { type: String, required: true },
  onLabel: { type: String, required: true },
  offLabel: { type: String, required: true },
});
const model = defineModel({ type: Boolean, default: false });
const inputId = `cookie-${props.type.key}`;
</script>

<template>
  <div class="d-flex align-start ga-4 pa-4 rounded-lg pf-bordered">
    <IconTile :icon="type.icon" :tone="type.tone" />
    <div class="flex-grow-1 min-w-0">
      <div class="d-flex align-center flex-wrap ga-2">
        <label :for="inputId" class="pf-type-body-md-strong text-text-primary">{{ type.title }}</label>
        <StatusBadge v-if="type.locked" tone="success" dot>{{ alwaysOn }}</StatusBadge>
      </div>
      <p class="pf-type-body-sm text-text-secondary mt-1">{{ type.description }}</p>
    </div>
    <div class="d-flex flex-column align-center flex-shrink-0">
      <v-switch
        :id="inputId"
        v-model="model"
        :disabled="type.locked"
        color="primary"
        inset
        hide-details
        density="compact"
        :aria-label="type.title"
      />
      <span class="pf-type-caption-strong" :class="model ? 'text-text-brand' : 'text-text-tertiary'">
        {{ model ? onLabel : offLabel }}
      </span>
    </div>
  </div>
</template>
