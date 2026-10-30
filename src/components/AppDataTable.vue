<script setup>
// ตารางข้อมูลมาตรฐาน (Figma: Table/Header Cell, Table/Cell) + Pagination
// headers: ตาม v-data-table — { title, key, align?, width?, sortable? }
// ปรับแต่ง cell ผ่าน slot แบบ v-data-table เช่น <template #item.status="{ item }">
// rowClass(item) → class ของแถว เช่น 'pf-row-highlight'
// คอลัมน์ปุ่ม (key "actions" / "view") ติดขอบขวาเสมอ ไม่ถูกตัดเมื่อตารางกว้างเกินการ์ด
//   เมื่อยังมีเนื้อหาซ่อนอยู่ใต้คอลัมน์นี้ (ตารางกว้างกว่าการ์ดและยังเลื่อนไม่สุด) แสดงเส้นแบ่ง ให้รู้ว่าเลื่อนดูต่อได้
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from "vue";
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

const ACTION_KEYS = ["actions", "view"];
const sticky = { class: "pf-col-actions" };
const tableHeaders = computed(() =>
  props.headers.map((h) => (ACTION_KEYS.includes(h.key) ? { ...h, nowrap: true, headerProps: sticky, cellProps: sticky } : h))
);

// clipped = มีเนื้อหาอยู่ใต้คอลัมน์ปุ่มที่ sticky (ยังเลื่อนไปทางขวาได้)
const root = ref(null);
const clipped = ref(false);
let wrapper = null;
let observer = null;
const measure = () => {
  if (!wrapper) return;
  clipped.value = wrapper.scrollLeft + wrapper.clientWidth < wrapper.scrollWidth - 1;
};
onMounted(() => {
  wrapper = root.value?.querySelector(".v-table__wrapper");
  if (!wrapper) return;
  wrapper.addEventListener("scroll", measure, { passive: true });
  observer = new ResizeObserver(measure);
  observer.observe(wrapper);
  const table = wrapper.querySelector("table");
  if (table) observer.observe(table);
  measure();
});
onBeforeUnmount(() => {
  wrapper?.removeEventListener("scroll", measure);
  observer?.disconnect();
});
</script>

<template>
  <div ref="root">
    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      :items="items"
      :item-value="itemValue"
      :items-per-page="paginate ? itemsPerPage : -1"
      :row-props="rowProps"
      :hover="hover"
      hide-default-footer
      class="pf-table"
      :class="{ 'pf-table--clipped': clipped }"
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
.pf-table :deep(td.pf-col-actions),
.pf-table :deep(th.pf-col-actions) {
  position: sticky !important; /* ชนะ position: relative ของ hover ใน v-table */
  right: 0;
  z-index: 1;
  width: 1%;
}
.pf-table :deep(td.pf-col-actions) {
  background: rgb(var(--v-theme-surface));
}
/* เส้นแบ่งด้านซ้ายของคอลัมน์ปุ่ม เมื่อมีเนื้อหาซ่อนอยู่ข้างใต้ */
.pf-table--clipped :deep(td.pf-col-actions),
.pf-table--clipped :deep(th.pf-col-actions) {
  box-shadow: inset var(--pf-stroke-default) 0 0 rgb(var(--v-theme-border-default));
}
.pf-table :deep(tr.pf-row-highlight > td.pf-col-actions) {
  background: rgb(var(--v-theme-bg-row-highlight));
}
</style>
