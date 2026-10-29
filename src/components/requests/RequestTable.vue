<script setup>
// ตารางคำขอใบรับรองฯ (Figma D09: Table) — คลิกแถว / ปุ่ม View → emit open
// item.undoUntil = เวลาสิ้นสุดการยกเลิกการอนุมัติ (ms) ของคำขอที่เพิ่งอนุมัติ · item.statusAt = เวลาอัปเดตสถานะ (แสดงเมื่อเรียงตามเวลานี้) · highlight = Reference No. ของแถวที่ต้องไฮไลต์ (คำขอที่ยื่นก่อนสุด) · slot "empty" = Empty state
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import { requestsText as t } from "@/content/requests.js";
import { autoCheck, requestStatuses } from "@/mocks/requests.js";
import { formatDate, formatDateTime, formatNumber, formatTime } from "@/utils/format.js";

defineProps({
  items: { type: Array, required: true },
  highlight: { type: String, default: null },
});
const emit = defineEmits(["open"]);

const c = t.columns;
const headers = [
  { title: c.ref, key: "ref", sortable: false },
  { title: c.submittedAt, key: "submittedAt", sortable: false },
  { title: c.invoice, key: "invoice", sortable: false },
  { title: c.company, key: "company", sortable: false },
  { title: c.brand, key: "brand", sortable: false },
  { title: c.country, key: "country", sortable: false },
  { title: c.items, key: "items", align: "end", sortable: false },
  { title: c.autoCheck, key: "flagged", sortable: false },
  { title: c.status, key: "status", sortable: false },
  { title: c.view, key: "view", align: "center", sortable: false },
];

const check = (item) => (item.flagged ? autoCheck.flagged(item.flagged) : autoCheck.passed);
</script>

<template>
  <AppDataTable
    :headers="headers"
    :items="items"
    item-value="ref"
    :row-class="(item) => (item.ref === highlight ? 'pf-row-highlight request-row' : 'request-row')"
    class="request-table"
    @click:row="(item) => emit('open', item)"
  >
    <template #item.ref="{ item }">
      <span class="pf-type-body-sm-strong text-text-link text-no-wrap">{{ item.ref }}</span>
    </template>
    <template #item.submittedAt="{ item }">
      <div class="text-no-wrap py-3">
        <div class="pf-type-body-sm-strong">{{ formatDate(item.submittedAt) }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.submittedAt) }} {{ t.timeSuffix }}</div>
      </div>
    </template>
    <template #item.invoice="{ item }">
      <span class="text-no-wrap">{{ item.invoice }}</span>
    </template>
    <template #item.company="{ item }">
      <div class="request-table__company">{{ item.company }}</div>
    </template>
    <template #item.brand="{ item }">
      <div class="request-table__brand">{{ item.brand }}</div>
    </template>
    <template #item.items="{ item }">
      <span class="pf-type-body-sm-strong">{{ formatNumber(item.items) }}</span>
    </template>
    <template #item.flagged="{ item }">
      <StatusBadge :tone="check(item).tone" dot>{{ check(item).label }}</StatusBadge>
    </template>
    <template #item.status="{ item }">
      <div class="py-2">
        <StatusBadge :tone="requestStatuses[item.status].tone" dot>{{ requestStatuses[item.status].label }}</StatusBadge>
        <div v-if="item.undoUntil" class="pf-type-caption text-text-tertiary mt-1">
          {{ t.undoUntil(formatTime(item.undoUntil)) }}
        </div>
        <div v-else-if="item.statusAt" class="pf-type-caption text-text-tertiary mt-1">
          {{ t.statusAt(formatDateTime(item.statusAt)) }}
        </div>
      </div>
    </template>
    <template #item.view="{ item }">
      <TableIconButton icon="far fa-eye" :label="t.viewAria(item.ref)" @click="emit('open', item)" />
    </template>
    <template #no-data>
      <slot name="empty" />
    </template>
  </AppDataTable>
</template>

<style scoped>
.request-table :deep(th),
.request-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.request-table :deep(.pf-table th) {
  font-size: var(--pf-type-label-sm-size);
  line-height: var(--pf-type-label-sm-line);
}
.request-table :deep(th:first-child),
.request-table :deep(td:first-child) {
  padding-inline-start: var(--pf-space-12) !important;
}

.request-table :deep(.request-row) {
  cursor: pointer;
}
.request-table__company {
  min-width: calc(var(--pf-size-icon-tile-lg) * 3);
  max-width: calc(var(--pf-size-control-lg) * 3);
}
.request-table__brand {
  min-width: calc(var(--pf-size-control-lg) * 2);
}
.request-table :deep(td:has(.v-chip)) {
  white-space: nowrap;
}
</style>
