<script setup>
// การ์ดสรุปคำขอด้านบนของ D10: Reference No. · ผู้ยื่น · ยื่นผ่าน · วันที่ส่ง · Badge สถานะ / ลายมือชื่อ
import StatusBadge from "@/components/StatusBadge.vue";
import { reviewText } from "@/content/review.js";
import { formatDateTime } from "@/utils/format.js";
import { computed } from "vue";
import { useDisplay } from "vuetify";

defineProps({
  detail: { type: Object, required: true },
  status: { type: Object, required: true }, // { label, tone }
});
const t = reviewText.summary;
const { lgAndUp, xs } = useDisplay();
const mode = computed(() => (lgAndUp.value ? "summary--wide" : xs.value ? "summary--narrow" : "summary--mid"));
</script>

<template>
  <v-card class="pf-bordered px-6 py-5 mb-6">
    <div class="summary" :class="mode">
      <div class="summary__ref">
        <div class="pf-type-caption text-text-tertiary">{{ t.ref }}</div>
        <div class="pf-type-h2 text-text-brand">{{ detail.ref }}</div>
      </div>
      <div class="summary__divider" aria-hidden="true" />
      <div class="min-w-0">
        <div class="pf-type-body-sm text-text-tertiary">{{ t.applicant }}</div>
        <div class="pf-type-body-sm-strong text-text-primary">{{ detail.exporter.nameTh }}</div>
      </div>
      <div class="min-w-0">
        <div class="pf-type-body-sm text-text-tertiary">{{ t.via }}</div>
        <div class="pf-type-body-sm-strong text-text-primary">{{ detail.via }}</div>
      </div>
      <div class="min-w-0">
        <div class="pf-type-body-sm text-text-tertiary">{{ t.submittedAt }}</div>
        <div class="pf-type-body-sm-strong text-text-primary">{{ formatDateTime(detail.submittedAt) }}</div>
      </div>
      <div class="d-flex flex-column align-start align-lg-end ga-2">
        <StatusBadge :tone="status.tone" dot>{{ status.label }}</StatusBadge>
        <StatusBadge :tone="detail.signatureValid ? 'success' : 'danger'" dot>
          {{ detail.signatureValid ? t.signatureValid : t.signatureInvalid }}
        </StatusBadge>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.summary {
  display: grid;
  align-items: center;
  gap: var(--pf-space-16) var(--pf-space-24);
}
.summary--wide {
  grid-template-columns: auto auto minmax(0, 1fr) minmax(0, 1fr) auto auto;
}
.summary--mid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.summary--narrow {
  grid-template-columns: minmax(0, 1fr);
}
.summary__divider {
  align-self: stretch;
  border-left: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.summary--mid .summary__ref,
.summary--narrow .summary__ref {
  grid-column: 1 / -1;
}
.summary--mid .summary__divider,
.summary--narrow .summary__divider {
  display: none;
}
</style>
