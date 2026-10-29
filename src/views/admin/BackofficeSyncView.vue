<script setup>
// B-25 · ส่งข้อมูลระบบงานภายใน DDC (เสนอเพิ่ม — ยังไม่มีใน Figma) — TOR 7.8.38, 8.3
import { computed, reactive, ref } from "vue";
import { useDisplay } from "vuetify";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import SectionCard from "@/components/SectionCard.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import DataCheckDialog from "@/components/backoffice-sync/DataCheckDialog.vue";
import { backofficeSyncText as t } from "@/content/backoffice-sync.js";
import { syncDocTypes, syncItems, syncNow, syncStatuses, syncToday, webService } from "@/mocks/backoffice-sync.js";
import { formatDate, formatDateTimeSec, formatNumber, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("thanakorn");
const { lgAndUp, smAndUp } = useDisplay();

const list = ref(syncItems.map((s) => ({ ...s })));
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- KPI (คำนวณจากรายการจริง — ส่งวันนี้ = รายการวันนี้ที่ส่งแล้ว ไม่นับที่รอส่ง) ----------
const count = (status) => list.value.filter((s) => s.status === status).length;
const sentToday = computed(() => list.value.filter((s) => s.at.slice(0, 10) === syncToday && s.status !== "pending"));
const kpis = computed(() => [
  { key: "sent", icon: "far fa-paper-plane", tone: "teal", label: t.kpis.sent, value: formatNumber(sentToday.value.length) },
  {
    key: "ok",
    icon: "fas fa-check",
    tone: "green",
    label: t.kpis.success,
    value: formatNumber(sentToday.value.filter((s) => s.status === "success").length),
  },
  { key: "pending", icon: "far fa-clock", tone: "blue", label: t.kpis.pending, value: count("pending") },
  { key: "error", icon: "fas fa-triangle-exclamation", tone: "red", label: t.kpis.error, value: count("error") },
]);

// ---------- Web Service ----------
const service = reactive({ ...webService });
const serviceItems = computed(() => [
  { key: "endpoint", label: t.service.endpoint, value: service.endpoint },
  { key: "protocol", label: t.service.protocol, value: service.protocol },
  { key: "heartbeat", label: t.service.heartbeat, value: formatDateTimeSec(service.lastHeartbeat) },
  { key: "latency", label: t.service.latency, value: t.service.latencyValue(service.latencyMs) },
  { key: "queue", label: t.service.queue, value: t.service.queueValue(count("pending")) },
]);
const testService = () => {
  service.lastHeartbeat = syncNow;
  service.latencyMs = 132;
  notify(t.service.tested(service.latencyMs));
};

// ---------- ตัวกรอง (กด ค้นหา จึงมีผล) ----------
const blankFilters = () => ({ q: "", docType: null, status: null, date: [syncToday, syncToday] });
const form = reactive(blankFilters());
const applied = ref(blankFilters());
const search = () => (applied.value = { ...form, date: form.date ? [...form.date] : null });
const reset = () => {
  Object.assign(form, blankFilters());
  search();
};
const docTypeItems = [{ title: t.filters.all, value: null }, ...Object.entries(syncDocTypes).map(([value, d]) => ({ title: d.label, value }))];
const statusItems = [{ title: t.filters.all, value: null }, ...Object.entries(syncStatuses).map(([value, s]) => ({ title: s.label, value }))];
const filtered = computed(() => {
  const f = applied.value;
  const q = f.q.trim().toLowerCase();
  return list.value.filter((s) => {
    const day = s.at.slice(0, 10);
    return (
      (!q || [s.docNo, s.reference].some((v) => v.toLowerCase().includes(q))) &&
      (!f.docType || s.docType === f.docType) &&
      (!f.status || s.status === f.status) &&
      (!f.date || (day >= f.date[0] && day <= (f.date[1] ?? f.date[0])))
    );
  });
});
const rowClass = (s) => (s.status === "error" ? "pf-row-highlight" : "");

// ---------- ส่งซ้ำ / ตรวจข้อมูล ----------
const resendItem = (s) => {
  s.attempts += 1;
  s.status = "success";
  s.at = syncNow;
  s.message = t.resentMessage(s.attempts);
};
const resend = (s) => {
  resendItem(s);
  notify(t.resent(s.docNo));
};
const resendFailed = () => {
  const failed = list.value.filter((s) => s.status === "error");
  if (!failed.length) return notify(t.actions.nothingToResend);
  failed.forEach(resendItem);
  notify(t.actions.resentFailed(failed.length));
};
const checker = reactive({ open: false, item: null });
const openCheck = (s) => Object.assign(checker, { open: true, item: s });
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-download" @click="notify(t.actions.exported(filtered.length))">{{ t.actions.exportLog }}</SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-arrows-rotate" :height="size['control-lg']" @click="resendFailed">
          {{ t.actions.resendFailed }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" />
      </v-col>
    </v-row>

    <SectionCard :title="t.service.title" :subtitle="t.service.subtitle" class="mb-6">
      <template #header>
        <StatusBadge :tone="service.online ? 'success' : 'danger'" dot>
          {{ service.online ? t.service.online : t.service.offline }}
        </StatusBadge>
      </template>
      <template #actions>
        <SecondaryButton icon="fas fa-plug-circle-check" height="control-md" @click="testService">{{ t.service.test }}</SecondaryButton>
      </template>
      <KeyValueList :items="serviceItems" :columns="lgAndUp ? 5 : smAndUp ? 2 : 1" class="service-kv" />
    </SectionCard>

    <FilterCard @search="search" @reset="reset">
      <v-col cols="12" md="3">
        <FieldLabel :label="t.filters.search" for="bs-q" />
        <v-text-field id="bs-q" v-model="form.q" prepend-inner-icon="fas fa-magnifying-glass" clearable hide-details />
      </v-col>
      <v-col cols="6" md="2">
        <FieldLabel :label="t.filters.docType" for="bs-type" />
        <v-select id="bs-type" v-model="form.docType" :items="docTypeItems" hide-details />
      </v-col>
      <v-col cols="6" md="2">
        <FieldLabel :label="t.filters.status" for="bs-status" />
        <v-select id="bs-status" v-model="form.status" :items="statusItems" hide-details />
      </v-col>
      <v-col cols="12" md>
        <FieldLabel :label="t.filters.date" for="bs-date" />
        <DateField id="bs-date" v-model="form.date" range clearable :placeholder="t.filters.datePlaceholder" />
      </v-col>
    </FilterCard>

    <v-card class="pf-bordered">
      <AppDataTable :headers="t.headers" :items="filtered" :per-page="10" :show-per-page="false" :row-class="rowClass" class="sync-table">
        <template #item.at="{ item }">
          <div class="pf-type-body-sm-strong">{{ formatTime(item.at) }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ formatDate(item.at) }}</div>
        </template>
        <template #item.docType="{ item }">
          <StatusBadge :tone="syncDocTypes[item.docType].tone">{{ syncDocTypes[item.docType].label }}</StatusBadge>
        </template>
        <template #item.docNo="{ item }">
          <span class="pf-type-body-sm-strong">{{ item.docNo }}</span>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="syncStatuses[item.status].tone" dot>{{ syncStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.attempts="{ item }">{{ item.attempts }}</template>
        <template #item.message="{ item }">
          <span class="message d-inline-block py-3" :class="item.status === 'error' ? 'text-status-danger-fg' : 'text-text-secondary'">
            {{ item.message }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="fas fa-list-check" :label="t.check" @click="openCheck(item)" />
            <TableIconButton icon="fas fa-arrows-rotate" :label="t.resend" :disabled="item.status === 'success'" @click="resend(item)" />
          </div>
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
        </template>
      </AppDataTable>
    </v-card>

    <DataCheckDialog v-model="checker.open" :item="checker.item" @resend="resend" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.sync-table :deep(td) {
  white-space: nowrap;
}
.sync-table :deep(th),
.sync-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.message {
  white-space: normal;
  min-width: calc(var(--pf-space-120) * 2);
  max-width: calc(var(--pf-space-120) * 3);
}
.service-kv :deep(dd) {
  word-break: break-all;
}
</style>
