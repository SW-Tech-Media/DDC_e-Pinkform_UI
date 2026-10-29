<script setup>
// แถบเลื่อนหน้าใต้ตาราง (Figma: Pagination) — "แสดง 1 – 20 จาก 132 รายการ" · จำนวนต่อหน้า · หมายเลขหน้า
import { computed } from "vue";
import { common } from "@/content/common.js";

const props = defineProps({
  total: { type: Number, required: true },
  // TOR 7.8.26 สูงสุด 20 รายการต่อหน้า
  perPageOptions: { type: Array, default: () => [10, 20] },
  showPerPage: { type: Boolean, default: true },
});
const page = defineModel("page", { type: Number, default: 1 });
const perPage = defineModel("perPage", { type: Number, default: 20 });

const pages = computed(() => Math.max(1, Math.ceil(props.total / perPage.value)));
const from = computed(() => (props.total ? (page.value - 1) * perPage.value + 1 : 0));
const to = computed(() => Math.min(page.value * perPage.value, props.total));
</script>

<template>
  <div class="d-flex flex-wrap align-center justify-space-between ga-4">
    <div class="d-flex flex-wrap align-center ga-4 pf-type-body-sm text-text-secondary">
      <span>{{ common.pagination.range(from, to, total) }}</span>
      <div v-if="showPerPage" class="d-flex align-center ga-2">
        {{ common.pagination.show }}
        <v-select
          v-model="perPage"
          :items="perPageOptions"
          density="compact"
          hide-details
          class="per-page"
          @update:model-value="page = 1"
        />
        {{ common.pagination.perPage }}
      </div>
    </div>
    <v-pagination
      v-model="page"
      :length="pages"
      :total-visible="5"
      density="comfortable"
      rounded="lg"
      active-color="primary"
      variant="flat"
      class="flex-grow-0"
    />
  </div>
</template>

<style scoped>
.per-page {
  flex: 0 0 auto;
  min-width: calc(var(--pf-size-control-lg) * 2);
}
</style>
