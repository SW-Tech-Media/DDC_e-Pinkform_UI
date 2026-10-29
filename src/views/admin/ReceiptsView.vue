<script setup>
// B-12 · ใบเสร็จรับเงิน (TOR 4.4.4 (2)(3)) — ยังไม่มีใน Figma ใช้สไตล์ D13 (ผู้ใช้ฝ่ายการเงิน: ประภาพร)
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import ReceiptPreview from "@/components/receipts/ReceiptPreview.vue";
import { receiptsText as t } from "@/content/receipts.js";
import { common } from "@/content/common.js";
import { banks } from "@/mocks/payments.js";
import { receiptKpis, receiptSigners, receiptStatuses, receipts } from "@/mocks/receipts.js";
import { formatDate, formatMoney, formatNumber, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("prapaporn");

const kpis = receiptKpis.map((k) => ({ ...k, value: k.money !== undefined ? formatMoney(k.money) : formatNumber(k.value) }));

const statusOptions = [
  { title: t.filters.all, value: null },
  ...Object.entries(receiptStatuses).map(([value, s]) => ({ title: s.label, value })),
];
const bankOptions = [
  { title: t.filters.all, value: null },
  ...Object.entries(banks).map(([value, name]) => ({ title: `${value} · ${name}`, value })),
];

const blank = () => ({ taxId: "", company: "", reference: "", requestNo: "", ref1: "", status: null, bank: null, range: null });
const draft = reactive(blank());
const applied = ref(blank());

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const has = (value, q) => !q.trim() || norm(value).includes(norm(q));

const filtered = computed(() => {
  const f = applied.value;
  const [from, to] = f.range ?? [];
  return receipts.filter((r) => {
    const day = r.issuedAt.slice(0, 10);
    return (
      has(r.taxId, f.taxId) &&
      (has(r.company, f.company) || has(r.companyEn, f.company)) &&
      (has(r.reference, f.reference) || has(r.receiptNo, f.reference)) &&
      has(r.requestNo, f.requestNo) &&
      has(r.ref1, f.ref1) &&
      (!f.status || r.status === f.status) &&
      (!f.bank || r.bankCode === f.bank) &&
      (!from || day >= from) &&
      (!to || day <= to)
    );
  });
});
const search = () => (applied.value = { ...draft, range: draft.range ? [...draft.range] : null });
const reset = () => {
  Object.assign(draft, blank());
  search();
};

const rowClass = (item) => (item.status === "pending" ? "pf-row-highlight" : "");

const view = reactive({ open: false, receipt: null });
const openView = (receipt) => Object.assign(view, { open: true, receipt });

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });
const download = () => {
  view.open = false;
  notify(t.preview.downloaded(view.receipt.receiptNo));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-download" :disabled="!filtered.length" @click="notify(t.actions.exported)">
          {{ t.actions.export }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
      </v-col>
    </v-row>

    <FilterCard class="rc-filters" @search="search" @reset="reset">
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.taxId" for="rc-tax" />
        <v-text-field id="rc-tax" v-model="draft.taxId" :placeholder="t.filters.numberPlaceholder" inputmode="numeric" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.company" for="rc-company" />
        <v-text-field id="rc-company" v-model="draft.company" :placeholder="t.filters.textPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.reference" for="rc-ref" />
        <v-text-field id="rc-ref" v-model="draft.reference" :placeholder="t.filters.numberPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.requestNo" for="rc-req" />
        <v-text-field id="rc-req" v-model="draft.requestNo" :placeholder="t.filters.numberPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.ref1" for="rc-ref1" />
        <v-text-field id="rc-ref1" v-model="draft.ref1" :placeholder="t.filters.numberPlaceholder" hide-details />
      </v-col>
      <v-col cols="6" sm="3" md="2">
        <FieldLabel :label="t.filters.status" for="rc-status" />
        <v-select id="rc-status" v-model="draft.status" :items="statusOptions" hide-details />
      </v-col>
      <v-col cols="6" sm="3" md="2">
        <FieldLabel :label="t.filters.bank" for="rc-bank" />
        <v-select id="rc-bank" v-model="draft.bank" :items="bankOptions" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <FieldLabel :label="t.filters.date" for="rc-date" />
        <DateField id="rc-date" v-model="draft.range" range clearable :placeholder="t.filters.datePlaceholder" />
      </v-col>
    </FilterCard>

    <v-card class="pf-bordered">
      <AppDataTable :headers="t.headers" :items="filtered" :row-class="rowClass" class="rc-table" @click:row="openView">
        <template #item.issuedAt="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong">{{ formatDate(item.issuedAt) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.issuedAt) }} {{ t.timeSuffix }}</div>
          </div>
        </template>
        <template #item.reference="{ item }">
          <span class="pf-type-body-sm-strong text-text-link">{{ item.reference }}</span>
        </template>
        <template #item.company="{ item }">
          <div class="company py-3">
            <div>{{ item.company }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ item.taxId }}</div>
          </div>
        </template>
        <template #item.bankCode="{ item }">
          <div class="pf-type-body-sm-strong">{{ item.bankCode }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ banks[item.bankCode] }}</div>
        </template>
        <template #item.receiptNo="{ item }">
          <div class="pf-type-body-sm-strong text-text-brand">{{ item.receiptNo }}</div>
          <StatusBadge :tone="receiptStatuses[item.status].tone" dot class="mt-1">{{ receiptStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.signer="{ item }">
          <div class="signer d-flex align-center ga-2">
            <v-icon
              :icon="item.status === 'signed' ? 'fas fa-file-signature' : 'far fa-clock'"
              :color="item.status === 'signed' ? 'status-success-fg' : 'icon-muted'"
              size="x-small"
            />
            <span>{{ receiptSigners[item.signer].name }}</span>
          </div>
        </template>
        <template #item.amount="{ item }">
          <span class="pf-type-body-sm-strong" :class="{ 'text-decoration-line-through text-text-tertiary': item.status === 'cancelled' }">
            {{ formatMoney(item.amount) }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <TableIconButton icon="far fa-file-pdf" :label="t.viewLabel" tone="icon-brand" @click="openView(item)" />
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" :description="t.noDataHint" />
        </template>
      </AppDataTable>
    </v-card>

    <AppDialog
      v-if="view.receipt"
      v-model="view.open"
      :title="t.preview.title(view.receipt.receiptNo)"
      :subtitle="t.preview.subtitle(view.receipt.company)"
      wide
    >
      <AlertBox v-if="view.receipt.status === 'signed'" tone="success" icon="fas fa-file-signature" class="mb-5">
        {{ t.preview.verified }}
      </AlertBox>
      <AlertBox v-else-if="view.receipt.status === 'pending'" tone="warning" class="mb-5">{{ t.preview.pendingSign }}</AlertBox>
      <AlertBox v-else tone="neutral" class="mb-5">{{ t.preview.cancelled }}</AlertBox>
      <ReceiptPreview :receipt="view.receipt" />
      <template #actions>
        <v-btn variant="outlined" color="secondary" :height="size['control-md']" @click="view.open = false">{{ common.actions.close }}</v-btn>
        <v-btn
          color="primary"
          prepend-icon="fas fa-file-pdf"
          :height="size['control-md']"
          :disabled="view.receipt.status !== 'signed'"
          @click="download"
        >
          {{ t.preview.download }}
        </v-btn>
      </template>
    </AppDialog>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.rc-table :deep(th) {
  white-space: pre !important;
}
.rc-table :deep(td) {
  white-space: nowrap;
}
.rc-table :deep(th),
.rc-table :deep(td) {
  padding-inline: var(--pf-space-8) !important;
}
.rc-table :deep(tbody tr) {
  cursor: pointer;
}
.rc-filters :deep(label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.signer {
  white-space: normal;
  min-width: calc(var(--pf-space-80) + var(--pf-space-16));
}
.company {
  white-space: normal;
  min-width: var(--pf-space-120);
}
</style>
