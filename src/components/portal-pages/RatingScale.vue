<script setup>
// ให้คะแนน 1–5 สำหรับแต่ละด้าน (แบบสอบถาม P-06) — แสดงกรอบสีแดงเมื่อ error
// aspect: { key, icon, label, hint }
import IconTile from "@/components/IconTile.vue";

const props = defineProps({
  aspect: { type: Object, required: true },
  low: { type: String, required: true },
  high: { type: String, required: true },
  error: { type: Boolean, default: false },
  errorText: { type: String, default: "" },
});
const model = defineModel({ type: Number, default: null });

const scores = [1, 2, 3, 4, 5];
const groupId = `rating-${props.aspect.key}`;
</script>

<template>
  <div class="rating d-flex flex-column flex-md-row align-md-center ga-3 ga-md-6 pa-4 rounded-lg" :class="{ 'rating--error': error }">
    <div class="d-flex align-center ga-3 flex-grow-1 min-w-0">
      <IconTile :icon="aspect.icon" tone="teal" />
      <div class="min-w-0">
        <p :id="groupId" class="pf-type-body-md-strong text-text-primary">
          {{ aspect.label }}<span class="text-status-danger-fg"> *</span>
        </p>
        <p class="pf-type-caption text-text-tertiary">{{ aspect.hint }}</p>
      </div>
    </div>
    <div class="flex-shrink-0">
      <div class="d-flex ga-2" role="radiogroup" :aria-labelledby="groupId">
        <v-btn
          v-for="s in scores"
          :key="s"
          role="radio"
          :aria-checked="model === s"
          variant="flat"
          rounded="lg"
          class="rating__btn pf-type-label-lg flex-grow-1"
          :class="model === s ? 'bg-primary text-text-on-inverse' : 'rating__btn--idle bg-surface text-text-secondary'"
          @click="model = s"
        >
          {{ s }}
        </v-btn>
      </div>
      <div class="d-flex justify-space-between pf-type-caption text-text-tertiary mt-1">
        <span>{{ low }}</span>
        <span>{{ high }}</span>
      </div>
    </div>
  </div>
  <p v-if="error && errorText" class="pf-type-caption text-status-danger-fg mt-1">{{ errorText }}</p>
</template>

<style scoped>
.rating {
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  background: rgb(var(--v-theme-bg-surface-muted));
}
.rating--error {
  border-color: rgb(var(--v-theme-error));
}
.rating__btn {
  min-width: var(--pf-size-control-lg) !important;
  height: var(--pf-size-control-lg) !important;
}
.rating__btn--idle {
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-strong));
}
</style>
