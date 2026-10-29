<script setup>
// รายการ "รายงานที่บันทึกไว้" (B-13) — คลิกเพื่อเปิด · ปุ่มแก้ไข / ลบ
// items: [{ id, name, type, range, updatedAt }] · types = reportsText.types
import TableIconButton from "@/components/TableIconButton.vue";
import EmptyState from "@/components/EmptyState.vue";
import { reportsText } from "@/content/reports.js";
import { formatDate, formatDateTime } from "@/utils/format.js";

defineProps({
  items: { type: Array, required: true },
  activeId: { type: Number, default: null },
});
defineEmits(["open", "edit", "delete"]);
const t = reportsText.saved;
const types = reportsText.types;
</script>

<template>
  <ul v-if="items.length" class="list">
    <li
      v-for="r in items"
      :key="r.id"
      class="item d-flex align-center ga-3 px-5 py-3"
      :class="{ 'bg-accent-teal-subtle': r.id === activeId }"
    >
      <button type="button" class="flex-grow-1 min-w-0 text-start" :title="t.open" @click="$emit('open', r)">
        <span class="d-block pf-type-label-md text-text-primary text-truncate">{{ r.name }}</span>
        <span class="d-block pf-type-caption text-text-secondary text-truncate">
          {{ types[r.type].short }} · {{ formatDate(r.range[0]) }} – {{ formatDate(r.range[1]) }}
        </span>
        <span class="d-block pf-type-caption text-text-tertiary">{{ t.updated(formatDateTime(r.updatedAt)) }}</span>
      </button>
      <div class="d-flex ga-2 flex-shrink-0">
        <TableIconButton icon="far fa-pen-to-square" :label="`${t.edit} ${r.name}`" @click="$emit('edit', r)" />
        <TableIconButton icon="far fa-trash-can" :label="`${t.delete} ${r.name}`" tone="status-danger-fg" @click="$emit('delete', r)" />
      </div>
    </li>
  </ul>
  <EmptyState v-else icon="far fa-bookmark" tone="neutral" :title="t.empty" />
</template>

<style scoped>
.list {
  list-style: none;
}
.item + .item {
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
</style>
