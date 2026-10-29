<script setup>
// Dialog รายละเอียด Audit Log (B-19): ผู้ใช้ / เครื่อง / วันเวลา + ตารางข้อมูลก่อน – หลังแก้ไข (TOR 4.1.15)
import { computed } from "vue";
import { useDisplay } from "vuetify";
import AppDialog from "@/components/AppDialog.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AlertBox from "@/components/AlertBox.vue";
import { auditText as t } from "@/content/audit-log.js";
import { common } from "@/content/common.js";
import { staff } from "@/mocks/users.js";
import { formatDate, formatDateTimeSec } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  entry: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const { smAndUp } = useDisplay();

const f = t.detail.fields;
const items = computed(() => {
  const e = props.entry;
  if (!e) return [];
  const u = staff[e.user];
  return [
    { label: f.at, value: `${formatDateTimeSec(e.at)} ${t.timeSuffix}` },
    { label: f.user, value: `${u.name} (${u.username})` },
    { label: f.ip, value: e.ip },
    { label: f.host, value: e.host },
    { label: f.device, value: e.device },
    { label: f.menu, value: t.menus[e.menu] },
    { key: "action", label: f.action, value: t.actions[e.action].label },
    { label: f.target, value: e.target },
  ];
});

const headers = [
  { title: t.detail.field, key: "field", sortable: false },
  { title: t.detail.before, key: "before", sortable: false },
  { title: t.detail.after, key: "after", sortable: false },
];
const rows = computed(() => (props.entry?.changes ?? []).map((c, i) => ({ id: i, ...c })));
const show = (v) => (v === null || v === undefined ? t.detail.empty : /^\d{4}-\d{2}-\d{2}$/.test(v) ? formatDate(v) : v);
</script>

<template>
  <AppDialog v-model="open" :title="t.detail.title" :subtitle="entry ? t.detail.subtitle(entry.id) : ''" wide>
    <div v-if="entry" class="d-flex flex-column ga-6">
      <KeyValueList :items="items" :columns="smAndUp ? 2 : 1">
        <template #value="{ item }">
          <StatusBadge v-if="item.key === 'action'" :tone="t.actions[entry.action].tone" dot>{{ item.value }}</StatusBadge>
          <span v-else class="text-break">{{ item.value }}</span>
        </template>
      </KeyValueList>

      <section>
        <h3 class="pf-type-label-lg text-text-primary mb-3">{{ t.detail.diffTitle }}</h3>
        <div v-if="rows.length" class="pf-bordered rounded-lg overflow-hidden">
          <AppDataTable :headers="headers" :items="rows" :paginate="false" :hover="false" class="audit-diff">
            <template #item.field="{ item }">
              <span class="pf-type-body-sm-strong">{{ item.field }}</span>
            </template>
            <template #item.before="{ item }">
              <span v-if="item.before === null" class="text-text-tertiary">{{ t.detail.empty }}</span>
              <span v-else class="audit-diff__val bg-status-danger-bg text-status-danger-fg">{{ show(item.before) }}</span>
            </template>
            <template #item.after="{ item }">
              <span v-if="item.after === null" class="text-text-tertiary">{{ t.detail.empty }}</span>
              <span v-else class="audit-diff__val bg-status-success-bg text-status-success-fg">{{ show(item.after) }}</span>
            </template>
          </AppDataTable>
        </div>
        <AlertBox v-else tone="neutral">{{ t.detail.noChanges }}</AlertBox>
      </section>
    </div>
    <template #actions>
      <v-btn color="primary" :height="size['control-md']" @click="open = false">{{ common.actions.close }}</v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.audit-diff :deep(td) {
  padding-block: var(--pf-space-8) !important;
  vertical-align: top;
}
.audit-diff__val {
  display: inline-block;
  padding: var(--pf-space-2) var(--pf-space-8);
  border-radius: var(--pf-radius-xs);
  white-space: normal;
}
</style>
