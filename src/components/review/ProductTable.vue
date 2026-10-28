<script setup>
// ตารางรายการสินค้าของคำขอ + ผลตรวจอัตโนมัติ + Alert พื้นที่โรคระบาด (Figma D10)
import { computed } from "vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AlertBox from "@/components/AlertBox.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { reviewText } from "@/content/review.js";
import { formatDate } from "@/utils/format.js";

const props = defineProps({
  detail: { type: Object, required: true },
});
const t = reviewText.products;

const headers = [
  { title: t.headers.no, key: "no", sortable: false },
  { title: t.headers.name, key: "name", sortable: false },
  { title: t.headers.hs, key: "hs", sortable: false },
  { title: t.headers.source, key: "source", sortable: false },
  { title: t.headers.producedAt, key: "producedAt", sortable: false },
  { title: t.headers.qty, key: "qty", sortable: false, align: "end" },
  { title: t.headers.result, key: "result", sortable: false },
];
const items = computed(() => props.detail.items.map((it, i) => ({ ...it, no: i + 1 })));
const rowClass = (item) => (item.result === "watch" ? "pf-row-highlight" : "");
const note = computed(() => props.detail.outbreakNote);
</script>

<template>
  <div>
    <div class="table-scroll">
      <AppDataTable :headers="headers" :items="items" item-value="no" :paginate="false" :row-class="rowClass" :hover="false">
        <template #item.name="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong text-text-primary">{{ item.nameTh }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ item.nameEn }}</div>
          </div>
        </template>
        <template #item.producedAt="{ item }">{{ formatDate(item.producedAt) }}</template>
        <template #item.qty="{ item }">
          <span class="pf-type-body-sm-strong text-no-wrap">{{ item.qty }}</span>
        </template>
        <template #item.result="{ item }">
          <StatusBadge :tone="t.results[item.result].tone" dot>{{ t.results[item.result].label }}</StatusBadge>
        </template>
      </AppDataTable>
    </div>
    <div v-if="note" class="px-6 py-4 pf-bordered-top">
      <AlertBox tone="warning">
        {{ t.outbreak(note.item, note.area, note.reportedAt, note.freeAt) }}
      </AlertBox>
    </div>
  </div>
</template>

<style scoped>
.table-scroll {
  overflow-x: auto;
}
</style>
