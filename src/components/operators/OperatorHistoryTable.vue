<script setup>
// ตารางประวัติการแก้ไขข้อมูลผู้ประกอบการ (แท็บ "ประวัติการแก้ไข" ของ D08)
import AppDataTable from "@/components/AppDataTable.vue";
import { operatorsText as t } from "@/content/operators.js";
import { formatDateTime } from "@/utils/format.js";

defineProps({
  items: { type: Array, required: true },
});

const c = t.columns;
const headers = [
  { title: c.at, key: "at", sortable: false },
  { title: c.company, key: "company", sortable: false },
  { title: c.field, key: "field", sortable: false },
  { title: c.change, key: "change", sortable: false },
  { title: c.by, key: "by", sortable: false },
];
</script>

<template>
  <AppDataTable :headers="headers" :items="items" :hover="false">
    <template #item.at="{ item }">
      <span class="text-no-wrap">{{ formatDateTime(item.at) }}</span>
    </template>
    <template #item.company="{ item }">
      <div class="py-3">
        <div class="pf-type-body-sm-strong">{{ item.company }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ item.taxId }}</div>
      </div>
    </template>
    <template #item.change="{ item }">
      <span class="text-text-tertiary">{{ item.from }}</span>
      <v-icon icon="fas fa-arrow-right" size="x-small" color="icon-muted" class="mx-2" />
      <span class="pf-type-body-sm-strong">{{ item.to }}</span>
    </template>
    <template #no-data>
      <slot name="empty" />
    </template>
  </AppDataTable>
</template>
