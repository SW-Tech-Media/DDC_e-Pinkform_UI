<script setup>
// ตารางรอพิจารณาอนุมัติ THNSW (B-04 — Figma ยังไม่มี ออกแบบตามสไตล์ D08) — emit approve, reject
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { operatorsText as t } from "@/content/operators.js";
import { operatorTypes } from "@/mocks/operators.js";
import { formatDate, formatTime } from "@/utils/format.js";

defineProps({
  items: { type: Array, required: true },
});
const emit = defineEmits(["approve", "reject"]);

const c = t.columns;
const headers = [
  { title: `${c.profileId} / ${c.nswId}`, key: "profileId", sortable: false },
  { title: c.taxId, key: "taxId", sortable: false },
  { title: c.company, key: "nameTh", sortable: false },
  { title: c.type, key: "type", sortable: false },
  { title: c.receivedAt, key: "receivedAt", sortable: false },
  { title: c.decision, key: "decision", sortable: false },
  { title: c.actions, key: "actions", align: "center", sortable: false },
];

const badge = (item) => t.thnsw[item.decision ?? "pending"];
</script>

<template>
  <AppDataTable :headers="headers" :items="items" class="thnsw-table">
    <template #item.profileId="{ item }">
      <div class="py-3 text-no-wrap">
        <div class="pf-type-body-sm-strong text-text-link">{{ item.profileId }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.nswId }}</div>
      </div>
    </template>
    <template #item.taxId="{ item }">
      <div class="py-3 text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ item.taxId }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.branch(item.branch) }}</div>
      </div>
    </template>
    <template #item.nameTh="{ item }">
      <div class="py-3 thnsw__name">
        <div class="pf-type-body-sm-strong">{{ item.nameTh }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.nameEn }}</div>
      </div>
    </template>
    <template #item.type="{ item }">
      <StatusBadge tone="neutral" dot>{{ operatorTypes[item.type].label }}</StatusBadge>
    </template>
    <template #item.receivedAt="{ item }">
      <div class="text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ formatDate(item.receivedAt) }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.receivedAt) }} {{ t.timeSuffix }}</div>
      </div>
    </template>
    <template #item.decision="{ item }">
      <StatusBadge :tone="badge(item).tone" dot>{{ badge(item).label }}</StatusBadge>
    </template>
    <template #item.actions="{ item }">
      <div v-if="!item.decision" class="d-flex justify-center flex-nowrap ga-2">
        <v-btn color="primary" size="small" prepend-icon="fas fa-check" @click="emit('approve', item)">
          {{ t.thnsw.approve }}
        </v-btn>
        <v-btn variant="outlined" color="error" size="small" prepend-icon="fas fa-xmark" @click="emit('reject', item)">
          {{ t.thnsw.reject }}
        </v-btn>
      </div>
      <div v-else class="text-center text-text-tertiary">–</div>
    </template>
    <template #no-data>
      <slot name="empty" />
    </template>
  </AppDataTable>
</template>

<style scoped>
.thnsw-table :deep(th),
.thnsw-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.thnsw-table :deep(.pf-table th) {
  font-size: var(--pf-type-label-sm-size);
  line-height: var(--pf-type-label-sm-line);
}
.thnsw__name {
  min-width: calc(var(--pf-size-control-lg) * 4);
}
</style>
