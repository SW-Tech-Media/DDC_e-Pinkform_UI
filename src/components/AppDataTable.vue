<script setup>
// ตารางข้อมูลมาตรฐาน (Figma: Table/Header Cell, Table/Cell) + Pagination
// headers: ตาม v-data-table — { title, key, align?, width?, sortable? }
// ปรับแต่ง cell ผ่าน slot แบบ v-data-table เช่น <template #item.status="{ item }">
// rowClass(item) → class ของแถว เช่น 'pf-row-highlight'
import { computed, ref, useSlots } from "vue";
import TablePagination from "./TablePagination.vue";

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  itemValue: { type: String, default: "id" },
  paginate: { type: Boolean, default: true },
  perPage: { type: Number, default: 20 },
  showPerPage: { type: Boolean, default: true },
  rowClass: { type: Function, default: null },
  hover: { type: Boolean, default: true },
  // จำนวนทั้งหมดในระบบ (ถ้ามากกว่ารายการที่โหลดมา เช่น "จาก 1,420 รายการ")
  total: { type: Number, default: 0 },
});
defineEmits(["click:row"]);

const slots = useSlots();
const cellSlots = computed(() => Object.keys(slots).filter((n) => n.startsWith("item.") || n.startsWith("header.")));

const page = ref(1);
const itemsPerPage = ref(props.perPage);
const rowProps = ({ item }) => (props.rowClass ? { class: props.rowClass(item) } : {});
</script>

<template>
  <div>
    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :item-value="itemValue"
      :items-per-page="paginate ? itemsPerPage : -1"
      :row-props="rowProps"
      :hover="hover"
      hide-default-footer
      class="pf-table"
      @click:row="(e, { item }) => $emit('click:row', item)"
    >
      <template v-for="name in cellSlots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
      <template #no-data>
        <slot name="no-data" />
      </template>
    </v-data-table>
    <div v-if="paginate && items.length" class="px-6 py-4 pf-bordered-top">
      <TablePagination
        v-model:page="page"
        v-model:per-page="itemsPerPage"
        :total="Math.max(total, items.length)"
        :show-per-page="showPerPage"
      />
    </div>
  </div>
</template>

<style scoped>
.pf-table {
  background: transparent;
}
.pf-table :deep(th) {
  background: rgb(var(--v-theme-bg-surface-muted)) !important;
  color: rgb(var(--v-theme-text-secondary));
  font-size: var(--pf-type-label-sm-size);
  line-height: var(--pf-type-label-sm-line);
  font-weight: var(--pf-type-label-sm-weight) !important;
  white-space: nowrap;
}
.pf-table :deep(td) {
  font-size: var(--pf-type-body-sm-size);
  line-height: var(--pf-type-body-sm-line);
  color: rgb(var(--v-theme-text-primary));
}
.pf-table :deep(th:first-child),
.pf-table :deep(td:first-child) {
  padding-inline-start: var(--pf-space-24);
}
.pf-table :deep(th:last-child),
.pf-table :deep(td:last-child) {
  padding-inline-end: var(--pf-space-24);
}
.pf-table :deep(tr.pf-row-highlight > td) {
  background: rgb(var(--v-theme-bg-row-highlight));
}
</style>
