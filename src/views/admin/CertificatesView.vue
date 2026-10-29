<script setup>
// B-10 · ข้อมูลใบรับรองฯ (TOR 4.4.3) — ยังไม่มีใน Figma ใช้สไตล์ D09 / D13
// ตัวกรองตาม 4.4.3 (2) · ตารางตาม 4.4.3 (1) · View = dialog ตัวอย่างใบรับรองฯ + ดาวน์โหลด PDF / XML
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import CertificateViewDialog from "@/components/certificates/CertificateViewDialog.vue";
import { certificatesText as t } from "@/content/certificates.js";
import { common } from "@/content/common.js";
import { certificates, certificateToday, eLicensingStatuses } from "@/mocks/certificates.js";
import { formatDate, formatMonthYear, formatNumber, formatTime } from "@/utils/format.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("somrudee");

const rows = ref(certificates.map((c) => ({ ...c })));
// ----- การ์ดสรุป: นับจากรายการใบรับรองฯ (ส่งใหม่แล้วตัวเลขเปลี่ยนตาม) -----
const k = t.kpis;
const yearBE = Number(certificateToday.slice(0, 4)) + 543;
const kpis = computed(() => {
  const on = (prefix) => rows.value.filter((c) => c.sentAt.startsWith(prefix));
  const today = on(certificateToday);
  const count = (status) => rows.value.filter((c) => c.eLicensing === status).length;
  const latest = today[0]?.sentAt;
  return [
    { key: "today", ...k.today, value: formatNumber(today.length), caption: latest ? k.today.caption(formatTime(latest)) : "" },
    { key: "month", ...k.month, label: k.month.label(formatMonthYear(certificateToday)), value: formatNumber(on(certificateToday.slice(0, 7)).length) },
    { key: "year", ...k.year, label: k.year.label(yearBE), value: formatNumber(on(certificateToday.slice(0, 4)).length) },
    {
      key: "eLicensing",
      ...k.eLicensing,
      value: formatNumber(today.filter((c) => c.eLicensing === "sent").length),
      caption: k.eLicensing.caption(count("pending"), count("failed")),
    },
  ];
});

const blank = () => ({ taxId: "", company: "", ref: "", certNo: "", invoice: "", range: null });
const draft = reactive(blank());
const applied = ref(blank());
const tab = ref("all");

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const has = (value, q) => !q.trim() || norm(value).includes(norm(q));

const matched = computed(() => {
  const f = applied.value;
  const [from, to] = f.range ?? [];
  return rows.value.filter((c) => {
    const day = c.sentAt.slice(0, 10);
    return (
      has(c.taxId, f.taxId) &&
      (has(c.company, f.company) || has(c.companyEn, f.company)) &&
      has(c.ref, f.ref) &&
      has(c.certNo, f.certNo) &&
      has(c.invoice, f.invoice) &&
      (!from || day >= from) &&
      (!to || day <= to)
    );
  });
});
const tabs = computed(() =>
  t.tabs.map((x) => ({
    ...x,
    count: x.value === "all" ? matched.value.length : matched.value.filter((c) => c.eLicensing === x.value).length,
  }))
);
const filtered = computed(() => (tab.value === "all" ? matched.value : matched.value.filter((c) => c.eLicensing === tab.value)));

const search = () => (applied.value = { ...draft, range: draft.range ? [...draft.range] : null });
const reset = () => {
  Object.assign(draft, blank());
  search();
};

const rowClass = (item) => (item.eLicensing === "failed" ? "pf-row-highlight" : "");

// Dialog / snackbar
const view = reactive({ open: false, id: null });
const current = computed(() => rows.value.find((c) => c.id === view.id) ?? null);
const openView = (item) => Object.assign(view, { open: true, id: item.id });

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });
const download = (type) => notify(t.preview.downloaded(current.value.certNo, type));
const resend = () => {
  current.value.eLicensing = "sent";
  notify(t.preview.resent(current.value.certNo));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-download" :disabled="!filtered.length" @click="notify(t.exported)">
          {{ common.actions.exportExcel }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
      </v-col>
    </v-row>

    <FilterCard class="cert-filters" @search="search" @reset="reset">
      <v-col cols="12" sm="6" md="4" lg="2">
        <FieldLabel :label="t.filters.taxId.label" for="cf-tax" />
        <v-text-field id="cf-tax" v-model="draft.taxId" :placeholder="t.filters.taxId.placeholder" inputmode="numeric" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <FieldLabel :label="t.filters.company.label" for="cf-company" />
        <v-text-field id="cf-company" v-model="draft.company" :placeholder="t.filters.company.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <FieldLabel :label="t.filters.ref.label" for="cf-ref" />
        <v-text-field id="cf-ref" v-model="draft.ref" :placeholder="t.filters.ref.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <FieldLabel :label="t.filters.certNo.label" for="cf-cert" />
        <v-text-field id="cf-cert" v-model="draft.certNo" :placeholder="t.filters.certNo.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <FieldLabel :label="t.filters.invoice.label" for="cf-invoice" />
        <v-text-field id="cf-invoice" v-model="draft.invoice" :placeholder="t.filters.invoice.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <FieldLabel :label="t.filters.date.label" for="cf-date" />
        <DateField id="cf-date" v-model="draft.range" range clearable :placeholder="t.filters.date.placeholder" />
      </v-col>
    </FilterCard>

    <SectionCard flush>
      <div class="px-2 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>
      <AppDataTable :headers="t.headers" :items="filtered" :row-class="rowClass" class="cert-table" @click:row="openView">
        <template #item.ref="{ item }">
          <span class="pf-type-body-sm-strong text-text-link">{{ item.ref }}</span>
        </template>
        <template #item.sentAt="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong">{{ formatDate(item.sentAt) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.sentAt) }} {{ t.timeSuffix }}</div>
          </div>
        </template>
        <template #item.company="{ item }">
          <div class="company py-3">
            <div>{{ item.company }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ item.taxId }}</div>
          </div>
        </template>
        <template #item.certNo="{ item }">
          <span class="pf-type-body-sm-strong text-text-accent">{{ item.certNo }}</span>
        </template>
        <template #item.items="{ item }">{{ t.itemsUnit(item.items) }}</template>
        <template #item.eLicensing="{ item }">
          <StatusBadge :tone="eLicensingStatuses[item.eLicensing].tone" dot>{{ eLicensingStatuses[item.eLicensing].label }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <TableIconButton icon="far fa-file-pdf" :label="t.viewLabel" tone="icon-accent" @click="openView(item)" />
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" :description="t.noDataHint" />
        </template>
      </AppDataTable>
    </SectionCard>

    <CertificateViewDialog v-model="view.open" :certificate="current" @download="download" @resend="resend" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.cert-table :deep(th) {
  white-space: pre !important;
}
.cert-table :deep(td) {
  white-space: nowrap;
}
.cert-table :deep(th),
.cert-table :deep(td) {
  padding-inline: var(--pf-space-10) !important;
}
.cert-table :deep(tbody tr) {
  cursor: pointer;
}
.cert-filters :deep(label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.company {
  white-space: normal;
  min-width: var(--pf-space-120);
}
</style>
