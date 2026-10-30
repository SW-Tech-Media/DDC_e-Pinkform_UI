<script setup>
// Checklist "รายการตรวจสอบก่อนอนุมัติ" (Figma D10) — v-model = id ที่ทำเครื่องหมายแล้ว
import { computed } from "vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { reviewText } from "@/content/review.js";

const props = defineProps({
  items: { type: Array, required: true }, // [{ id, label }]
  readonly: { type: Boolean, default: false },
  // ข้อความใต้ Checklist เมื่อ readonly (ค่าเริ่มต้น = บันทึกผลแล้ว)
  readonlyText: { type: String, default: "" },
});
const model = defineModel({ type: Array, default: () => [] });
const t = reviewText.checklist;

const done = computed(() => model.value.length);
const complete = computed(() => done.value === props.items.length);
const toggle = (id, on) => {
  model.value = on ? [...model.value, id] : model.value.filter((x) => x !== id);
};
</script>

<template>
  <SectionCard :title="t.title">
    <template #header>
      <StatusBadge :tone="complete ? 'success' : 'neutral'">{{ t.count(done, items.length) }}</StatusBadge>
    </template>
    <ul class="checklist">
      <li v-for="item in items" :key="item.id" class="checklist__item pf-bordered-bottom">
        <v-checkbox
          :model-value="model.includes(item.id)"
          :label="item.label"
          :disabled="readonly"
          color="primary"
          base-color="border-strong"
          density="compact"
          hide-details
          class="checklist__box"
          @update:model-value="(on) => toggle(item.id, on)"
        />
      </li>
    </ul>
    <v-progress-linear
      :model-value="(done / items.length) * 100"
      :color="complete ? 'success' : 'primary'"
      bg-color="chart-track"
      bg-opacity="1"
      rounded
      class="mt-4"
      :aria-label="t.title"
    />
    <p class="pf-type-caption mt-2" :class="complete ? 'text-status-success-fg' : 'text-text-tertiary'">
      {{ readonly ? readonlyText || t.locked : complete ? t.done : t.hint }}
    </p>
  </SectionCard>
</template>

<style scoped>
.checklist {
  list-style: none;
  margin-top: calc(var(--pf-space-8) * -1);
}
.checklist__item {
  padding-block: var(--pf-space-4);
}
.checklist__box :deep(.v-label) {
  color: rgb(var(--v-theme-text-primary));
  opacity: 1;
  font-size: var(--pf-type-body-md-size);
  line-height: var(--pf-type-body-md-line);
}
</style>
