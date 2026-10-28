<script setup>
// ตารางผู้ประกอบการ (Figma D08: Table) — ปุ่มจัดการ ดู / แก้ไข / ลบ → emit view, edit, remove
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { operatorsText as t } from "@/content/operators.js";
import { common } from "@/content/common.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { formatDate } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

defineProps({
  items: { type: Array, required: true },
});
const emit = defineEmits(["view", "edit", "remove"]);

const c = t.columns;
const headers = [
  { title: c.taxId, key: "taxId", sortable: false },
  { title: c.company, key: "nameTh", sortable: false },
  { title: c.type, key: "type", sortable: false },
  { title: c.service, key: "service", sortable: false },
  { title: c.nswId, key: "nswId", sortable: false },
  { title: c.access, key: "access", sortable: false },
  { title: c.lastRequest, key: "lastRequestAt", sortable: false },
  { title: c.actions, key: "actions", align: "center", sortable: false },
];

const actions = [
  { key: "view", icon: "far fa-eye", label: common.actions.view },
  { key: "edit", icon: "fas fa-pen", label: common.actions.edit },
  { key: "remove", icon: "far fa-trash-can", label: common.actions.delete },
];
</script>

<template>
  <AppDataTable :headers="headers" :items="items" class="operator-table">
    <template #item.taxId="{ item }">
      <div class="py-3 text-no-wrap">
        <div class="pf-type-body-sm-strong">{{ item.taxId }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.branch(item.branch) }}</div>
      </div>
    </template>
    <template #item.nameTh="{ item }">
      <div class="py-3 operator-table__name">
        <div class="pf-type-body-sm-strong">{{ item.nameTh }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.nameEn }}</div>
      </div>
    </template>
    <template #item.type="{ item }">
      <StatusBadge tone="neutral" dot>{{ operatorTypes[item.type].label }}</StatusBadge>
    </template>
    <template #item.service="{ item }">
      <span class="text-no-wrap">{{ operatorServices[item.service].label }}</span>
    </template>
    <template #item.access="{ item }">
      <StatusBadge :tone="operatorAccess[item.access].tone" dot>{{ operatorAccess[item.access].label }}</StatusBadge>
    </template>
    <template #item.lastRequestAt="{ item }">
      <span class="text-no-wrap">{{ item.lastRequestAt ? formatDate(item.lastRequestAt) : "–" }}</span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex justify-center ga-2 flex-nowrap">
        <v-btn
          v-for="a in actions"
          :key="a.key"
          icon
          variant="outlined"
          color="border-default"
          :width="size['control-sm']"
          :height="size['control-sm']"
          :aria-label="`${a.label} ${item.nameTh}`"
          @click="emit(a.key, item)"
        >
          <v-icon :icon="a.icon" color="icon-default" size="small" />
        </v-btn>
      </div>
    </template>
    <template #no-data>
      <slot name="empty" />
    </template>
  </AppDataTable>
</template>

<style scoped>
.operator-table :deep(th),
.operator-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.operator-table :deep(.pf-table th) {
  font-size: var(--pf-type-label-sm-size);
  line-height: var(--pf-type-label-sm-line);
}
.operator-table :deep(th:first-child),
.operator-table :deep(td:first-child) {
  padding-inline-start: var(--pf-space-12) !important;
}

.operator-table__name {
  min-width: calc(var(--pf-size-control-lg) * 4);
}
</style>
