<script setup>
// ประวัติการส่ง (Queue / Retry) ของข้อความที่เลือก (D16 แผงขวาล่าง)
import StatusBadge from "@/components/StatusBadge.vue";
import { attemptStatuses } from "@/mocks/ebxml.js";

defineProps({
  title: { type: String, required: true },
  attempts: { type: Array, required: true },
});
</script>

<template>
  <div>
    <h3 class="pf-type-h4 text-text-primary mb-2">{{ title }}</h3>
    <ol class="attempts">
      <li v-for="(a, i) in attempts" :key="i" class="d-flex align-center ga-4 py-3 pf-bordered-bottom">
        <span class="pf-type-caption text-text-tertiary">{{ a.time.slice(0, 5) }}</span>
        <span class="pf-type-body-sm text-text-primary flex-grow-1">{{ a.label }}</span>
        <StatusBadge :tone="attemptStatuses[a.status].tone" dot>{{ attemptStatuses[a.status].label }}</StatusBadge>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.attempts {
  list-style: none;
}
</style>
