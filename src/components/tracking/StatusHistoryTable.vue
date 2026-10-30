<script setup>
// ตารางประวัติสถานะ (Figma D12) — ใช้ทั้งหน้า D12 และแท็บ "ประวัติสถานะ" ของ D10
// entries: [{ status?: key ใน requestStatuses, event?: key ใน reviewText.history.events, label?, tone?, detail, at, by, email? }]
// email = ร่องรอยอีเมลแจ้งผู้ยื่น (G-06) { to, subject, summary } — แสดงหัวเรื่องและสรุปเนื้อหาใต้รายละเอียด
import { computed } from "vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { requestStatuses } from "@/mocks/requests.js";
import { reviewText } from "@/content/review.js";
import { trackingText } from "@/content/tracking.js";
import { emailText } from "@/content/notifications.js";
import { formatDate, formatDateTimeSec } from "@/utils/format.js";

const props = defineProps({
  entries: { type: Array, required: true },
});
const h = trackingText.history.headers;
const headers = [
  { title: h.status, key: "label", sortable: false },
  { title: h.detail, key: "detail", sortable: false },
  { title: h.at, key: "at", sortable: false },
  { title: h.by, key: "by", sortable: false },
];
const items = computed(() =>
  props.entries.map((e, i) => {
    const base = e.event ? reviewText.history.events[e.event] : requestStatuses[e.status];
    return { ...e, id: i, label: e.label ?? base.label, tone: e.tone ?? base.tone };
  })
);
const timeOf = (at) => formatDateTimeSec(at).slice(formatDate(at).length + 1);
</script>

<template>
  <div class="history">
    <AppDataTable :headers="headers" :items="items" :paginate="false" :hover="false">
      <template #item.label="{ item }">
        <StatusBadge :tone="item.tone" dot>{{ item.label }}</StatusBadge>
      </template>
      <template #item.detail="{ item }">
        <div class="py-3 history__detail">
          {{ item.detail }}
          <div v-if="item.email" class="pf-type-caption text-text-secondary mt-1">
            <div>
              <span class="text-text-tertiary">{{ emailText.fields.subject }}:</span> {{ item.email.subject }}
            </div>
            <div>
              <span class="text-text-tertiary">{{ emailText.fields.summary }}:</span> {{ item.email.summary }}
            </div>
          </div>
        </div>
      </template>
      <template #item.at="{ item }">
        <div class="py-3 text-no-wrap">
          <div class="pf-type-body-sm-strong">{{ formatDate(item.at) }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ timeOf(item.at) }}</div>
        </div>
      </template>
    </AppDataTable>
  </div>
</template>

<style scoped>
.history__detail {
  min-width: calc(var(--pf-size-control-lg) * 4);
}
</style>
