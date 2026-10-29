<script setup>
// ตารางคำขอขึ้นทะเบียน THNSW (B-04) — mode: pending | approved | rejected
// emit view (คลิกแถว / ปุ่มดู), approve, reject
import { computed } from "vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import { thnswText as t } from "@/content/thnsw.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { formatDate, formatTime } from "@/utils/format.js";
import { checkStatus } from "./check-status.js";

const props = defineProps({
  items: { type: Array, required: true },
  mode: { type: String, default: "pending" },
});
const emit = defineEmits(["view", "approve", "reject"]);

const c = t.columns;
const headers = computed(() => {
  const base = [
    { title: c.profile, key: "profileId", sortable: false },
    { title: c.company, key: "nameTh", sortable: false },
    { title: c.access, key: "type", sortable: false },
  ];
  if (props.mode === "pending")
    return [
      ...base,
      { title: c.checks, key: "checks", sortable: false },
      { title: c.receivedAt, key: "receivedAt", sortable: false },
      { title: c.actions, key: "actions", align: "center", sortable: false },
    ];
  return [
    ...base,
    props.mode === "approved"
      ? { title: c.result, key: "result", sortable: false }
      : { title: c.reason, key: "reason", sortable: false },
    { title: c.decidedAt, key: "decidedAt", sortable: false },
    { title: c.actions, key: "actions", align: "center", sortable: false },
  ];
});
</script>

<template>
  <AppDataTable :headers="headers" :items="items" :per-page="10" class="thnsw-requests" @click:row="emit('view', $event)">
    <template #item.profileId="{ item }">
      <div class="py-3 text-no-wrap">
        <div class="pf-type-body-sm-strong text-text-link">{{ item.profileId }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.nswId }}</div>
      </div>
    </template>
    <template #item.taxId="{ item }">
      <div class="text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ item.taxId }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.branch(item.branch) }}</div>
      </div>
    </template>
    <template #item.nameTh="{ item }">
      <div class="py-3 thnsw-requests__name">
        <div class="pf-type-body-sm-strong">{{ item.nameTh }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.nameEn }}</div>
        <div class="pf-type-caption text-text-secondary">{{ item.taxId }} · {{ t.branch(item.branch) }}</div>
      </div>
    </template>
    <template #item.type="{ item }">
      <StatusBadge tone="neutral" dot>{{ operatorTypes[item.type].label }}</StatusBadge>
    </template>
    <template #item.checks="{ item }">
      <StatusBadge :tone="checkStatus(item.checks).tone" dot>{{ t.checkBadge[checkStatus(item.checks).key] }}</StatusBadge>
    </template>
    <template #item.receivedAt="{ item }">
      <div class="text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ formatDate(item.receivedAt) }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.receivedAt) }} {{ t.timeSuffix }}</div>
      </div>
    </template>
    <template #item.result="{ item }">
      <div class="d-flex flex-wrap ga-1">
        <StatusBadge :tone="operatorAccess[item.access].tone" dot>{{ operatorAccess[item.access].label }}</StatusBadge>
        <StatusBadge tone="info">{{ operatorServices[item.service].label }}</StatusBadge>
      </div>
    </template>
    <template #item.reason="{ item }">
      <div class="py-3 thnsw-requests__reason text-text-secondary">{{ item.reason }}</div>
    </template>
    <template #item.decidedAt="{ item }">
      <div class="text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ formatDate(item.decidedAt) }} {{ formatTime(item.decidedAt) }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.decidedBy }}</div>
      </div>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex justify-center align-center flex-nowrap ga-2">
        <TableIconButton v-if="mode !== 'pending'" icon="far fa-eye" :label="t.actions.view" @click="emit('view', item)" />
        <template v-else>
          <v-btn color="primary" size="small" prepend-icon="fas fa-check" @click.stop="emit('approve', item)">
            {{ t.actions.approve }}
          </v-btn>
          <v-btn variant="outlined" color="error" size="small" prepend-icon="fas fa-xmark" @click.stop="emit('reject', item)">
            {{ t.actions.reject }}
          </v-btn>
        </template>
      </div>
    </template>
    <template #no-data>
      <slot name="empty" />
    </template>
  </AppDataTable>
</template>

<style scoped>
.thnsw-requests :deep(th),
.thnsw-requests :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.thnsw-requests :deep(tbody tr) {
  cursor: pointer;
}
.thnsw-requests__name {
  min-width: calc(var(--pf-size-control-lg) * 3.5);
}
.thnsw-requests__reason {
  min-width: calc(var(--pf-size-control-lg) * 5);
}
</style>
