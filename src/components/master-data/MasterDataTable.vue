<script setup>
// ตารางชุดข้อมูลหลัก (B-15) — คอลัมน์ตาม dataset.columns (format: strong · code · status · kind · file)
// emit edit(item), remove(item) · canRemove = สิทธิ์ลบ (รหัสข้อความตอบกลับ: Admin เท่านั้น)
import { computed } from "vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import EmptyState from "@/components/EmptyState.vue";
import { masterText as t } from "@/content/master-data.js";

const props = defineProps({
  dataset: { type: Object, required: true },
  items: { type: Array, required: true },
  canRemove: { type: Boolean, default: true },
});
const emit = defineEmits(["edit", "remove"]);

const headers = computed(() => [
  ...props.dataset.columns.map((c) => ({ ...c, sortable: false })),
  { title: t.actionsColumn, key: "actions", align: "center", sortable: false },
]);
const formatted = computed(() => props.dataset.columns.filter((c) => c.format || c.key === "seq"));
</script>

<template>
  <AppDataTable :headers="headers" :items="items" :per-page="10" class="master-table">
    <template v-for="col in formatted" :key="col.key" #[`item.${col.key}`]="{ item }">
      <span v-if="col.key === 'seq'" class="text-text-tertiary">{{ item.seq }}</span>
      <div v-else-if="col.format === 'strong'" class="py-3 master-table__wrap">
        <div class="pf-type-body-sm-strong">{{ item[col.key] }}</div>
        <div v-if="col.caption && item[col.caption]" class="pf-type-caption text-text-tertiary">{{ item[col.caption] }}</div>
      </div>
      <span v-else-if="col.format === 'code'" class="pf-type-body-sm-strong text-text-brand text-no-wrap">{{ item[col.key] }}</span>
      <StatusBadge v-else-if="col.format === 'status'" :tone="t.status[item.status].tone" dot>
        {{ t.status[item.status].label }}
      </StatusBadge>
      <StatusBadge v-else-if="col.format === 'kind'" :tone="t.kind[item.kind].tone" dot>{{ t.kind[item.kind].label }}</StatusBadge>
      <span v-else-if="col.format === 'file'" class="d-inline-flex align-center ga-2 text-text-link text-no-wrap">
        <v-icon icon="far fa-file-image" size="x-small" />
        {{ item[col.key] }}
      </span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex justify-center ga-2">
        <TableIconButton icon="far fa-pen-to-square" :label="t.edit" @click="emit('edit', item)" />
        <TableIconButton
          icon="far fa-trash-can"
          :label="t.remove"
          tone="status-danger-fg"
          :disabled="!canRemove"
          @click="emit('remove', item)"
        />
      </div>
    </template>
    <template #no-data>
      <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" class="master-table__empty" />
    </template>
  </AppDataTable>
</template>

<style scoped>
.master-table :deep(th),
.master-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.master-table__wrap {
  min-width: calc(var(--pf-size-control-lg) * 4);
}
.master-table__empty :deep(h1) {
  font-size: var(--pf-type-h4-size);
  line-height: var(--pf-type-h4-line);
}
</style>
