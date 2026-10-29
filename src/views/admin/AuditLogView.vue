<script setup>
// B-19 · ประวัติการใช้งาน (Audit Log) — TOR 4.1.15 (Figma ยังไม่มี — ออกแบบตามสไตล์ D15/D16)
// รายการ = useAuditStore().all (ข้อมูลจำลอง + การอนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติ / แก้ไขคำขอที่บันทึกในรอบนี้)
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import AlertBox from "@/components/AlertBox.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import SectionCard from "@/components/SectionCard.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import AuditDetailDialog from "@/components/audit-log/AuditDetailDialog.vue";
import { downloadCsv } from "@/utils/csv.js";
import { auditText as t } from "@/content/audit-log.js";
import { auditRetention } from "@/mocks/audit-log.js";
import { staff } from "@/mocks/users.js";
import { formatDate, formatDateTime, formatDateTimeSec, formatTime } from "@/utils/format.js";
import { useSessionStore } from "@/stores/session.js";
import { useAuditStore } from "@/stores/audit.js";

useSessionStore().signInAs("thanakorn");
const audit = useAuditStore();
const auditLogs = computed(() => audit.all);
// ผู้ใช้ของ Log — บัญชีที่ไม่อยู่ในรายชื่อตัวอย่าง (staff) ใช้ชื่อที่บันทึกไว้ใน actor
const userOf = (l) => staff[l.user] ?? l.actor;

// ---------- ตัวกรอง (กดค้นหาจึงมีผล) ----------
const all = { value: null, title: t.filters.all };
const userItems = computed(() => [
  all,
  ...[...new Map(auditLogs.value.map((l) => [l.user, userOf(l)])).entries()].map(([value, u]) => ({ value, title: u.name })),
]);
const actionItems = [all, ...Object.entries(t.actions).map(([value, a]) => ({ value, title: a.label }))];
const menuItems = [all, ...Object.entries(t.menus).map(([value, title]) => ({ value, title }))];

const blank = () => ({ user: null, action: null, menu: null, range: null, ip: "" });
const form = reactive(blank());
const applied = ref(blank());
const search = () => (applied.value = { ...form, range: form.range ? [...form.range] : null });
const reset = () => {
  Object.assign(form, blank());
  search();
};

const day = (iso) => iso.slice(0, 10);
const rows = computed(() => {
  const f = applied.value;
  const ip = f.ip.trim();
  return auditLogs.value.filter(
    (l) =>
      (!f.user || l.user === f.user) &&
      (!f.action || l.action === f.action) &&
      (!f.menu || l.menu === f.menu) &&
      (!ip || l.ip.includes(ip)) &&
      (!f.range || (day(l.at) >= f.range[0] && day(l.at) <= (f.range[1] ?? f.range[0])))
  );
});

// ---------- รายละเอียด ----------
const detail = reactive({ open: false, entry: null });
const view = (entry) => Object.assign(detail, { open: true, entry });

// ---------- ส่งออก CSV (ตามผลการค้นหา — 1 แถวต่อ 1 ฟิลด์ที่แก้ไข) ----------
const snack = reactive({ show: false, text: "" });
const exportCsv = () => {
  const lines = rows.value.flatMap((l) => {
    const u = userOf(l);
    const base = [l.id, formatDateTimeSec(l.at), u.name, u.username, l.ip, l.host, l.device, t.menus[l.menu], t.actions[l.action].label, l.target];
    return l.changes.length ? l.changes.map((c) => [...base, c.field, c.before ?? "", c.after ?? ""]) : [[...base, "", "", ""]];
  });
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(t.csvFile(stamp), t.csv.headers, lines);
  Object.assign(snack, { show: true, text: t.exported(rows.value.length) });
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-file-csv" :disabled="!rows.length" @click="exportCsv">{{ t.exportCsv }}</SecondaryButton>
      </template>
    </PageHeader>

    <AlertBox tone="info" icon="fas fa-shield-halved" :title="t.retention.title" class="mb-6">
      {{ t.retention.body(formatDateTime(auditRetention.oldest), auditRetention.total) }}
    </AlertBox>

    <FilterCard @search="search" @reset="reset">
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.user" for="al-user" />
        <v-select id="al-user" v-model="form.user" :items="userItems" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.action" for="al-action" />
        <v-select id="al-action" v-model="form.action" :items="actionItems" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.menu" for="al-menu" />
        <v-select id="al-menu" v-model="form.menu" :items="menuItems" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.date" for="al-date" />
        <DateField id="al-date" v-model="form.range" range clearable :placeholder="t.filters.datePlaceholder" />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.ip" for="al-ip" />
        <v-text-field id="al-ip" v-model="form.ip" :placeholder="t.filters.ipPlaceholder" hide-details />
      </v-col>
    </FilterCard>

    <SectionCard flush>
      <template #header>
        <span class="pf-type-body-sm-strong text-text-secondary">{{ t.resultCount(rows.length) }}</span>
      </template>
      <AppDataTable
        :headers="t.headers"
        :items="rows"
        :per-page="10"
        :total="rows.length"
        class="audit-table"
        @click:row="view"
      >
        <template #item.at="{ item }">
          <div class="py-3 text-no-wrap">
            <div class="pf-type-body-sm-strong">{{ formatDate(item.at) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.at) }} {{ t.timeSuffix }}</div>
          </div>
        </template>
        <template #item.user="{ item }">
          <div class="text-no-wrap">
            <div class="pf-type-body-sm-strong">{{ userOf(item).name }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ userOf(item).username }}</div>
          </div>
        </template>
        <template #item.ip="{ item }">
          <div class="text-no-wrap">
            <div class="pf-type-body-sm-strong">{{ item.ip }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ item.host }} · {{ item.device }}</div>
          </div>
        </template>
        <template #item.menu="{ item }">
          <span class="text-no-wrap">{{ t.menus[item.menu] }}</span>
        </template>
        <template #item.action="{ item }">
          <StatusBadge :tone="t.actions[item.action].tone" dot>{{ t.actions[item.action].label }}</StatusBadge>
        </template>
        <template #item.target="{ item }">
          <div class="py-3 audit-table__target">
            <div>{{ item.target }}</div>
            <div v-if="item.changes.length" class="pf-type-caption text-text-tertiary">{{ t.changed(item.changes.length) }}</div>
          </div>
        </template>
        <template #item.view="{ item }">
          <TableIconButton icon="far fa-eye" :label="t.view" @click="view(item)" />
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" class="audit-table__empty" />
        </template>
      </AppDataTable>
    </SectionCard>

    <AuditDetailDialog v-model="detail.open" :entry="detail.entry" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.audit-table :deep(th),
.audit-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.audit-table :deep(tbody tr) {
  cursor: pointer;
}
.audit-table__target {
  min-width: calc(var(--pf-size-control-lg) * 5);
}
.audit-table__empty :deep(h1) {
  font-size: var(--pf-type-h4-size);
  line-height: var(--pf-type-h4-line);
}
</style>
