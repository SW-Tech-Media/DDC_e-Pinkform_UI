<script setup>
// D13 · Admin / Payments – List (B-11) — Figma node 19:3539
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import OutlineButton from "@/components/payments/OutlineButton.vue";
import TableIconButton from "@/components/payments/TableIconButton.vue";
import PaymentDetailDialog from "@/components/payments/PaymentDetailDialog.vue";
import AppDialog from "@/components/payments/AppDialog.vue";
import DateField from "@/components/outbreak/DateField.vue";
import { paymentsText as t } from "@/content/payments.js";
import { common } from "@/content/common.js";
import { banks, paymentKpis, paymentStatuses, payments, paymentToday } from "@/mocks/payments.js";
import { formatDate, formatMoney, formatThaiDate, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("prapaporn");

const kpis = paymentKpis.map((k) => ({ ...k, value: k.money !== undefined ? formatMoney(k.money) : k.value }));

const statusOptions = [
  { title: t.filters.all, value: null },
  ...Object.entries(paymentStatuses).map(([value, s]) => ({ title: s.label, value })),
];
const bankOptions = [
  { title: t.filters.all, value: null },
  ...Object.entries(banks).map(([value, name]) => ({ title: `${value} · ${name}`, value })),
];

const blank = () => ({ reference: "", ref1: "", company: "", status: null, bank: null, date: paymentToday });
const draft = reactive(blank());
const applied = ref(blank());

const has = (value, q) => !q || value.toLowerCase().includes(q.trim().toLowerCase());
const filtered = computed(() => {
  const f = applied.value;
  return payments.filter(
    (p) =>
      (has(p.id, f.reference) || has(p.requestNo, f.reference)) &&
      has(p.ref1, f.ref1) &&
      (has(p.company, f.company) || has(p.taxId, f.company)) &&
      (!f.status || p.status === f.status) &&
      (!f.bank || p.bankCode === f.bank) &&
      (!f.date || p.sentAt.startsWith(f.date))
  );
});
const search = () => (applied.value = { ...draft });
const reset = () => {
  Object.assign(draft, blank());
  search();
};

const rowClass = (item) => (item.status === "failed" ? "pf-row-highlight" : "");

// Dialog รายละเอียด / กระทบยอด / รายงานประจำวัน
const detail = reactive({ open: false, payment: null });
const openDetail = (payment) => Object.assign(detail, { open: true, payment });

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

const reconcileOpen = ref(false);
const reconcileRows = computed(() =>
  Object.entries(banks).map(([code, name]) => {
    const paid = payments.filter((p) => p.bankCode === code && p.status === "paid");
    const sum = paid.reduce((a, p) => a + p.amount, 0);
    return { bank: `${code} · ${name}`, count: paid.length, system: sum, bankAmount: sum };
  })
);
const confirmReconcile = () => {
  reconcileOpen.value = false;
  notify(t.reconcile.done(reconcileRows.value.length));
};

const reportOpen = ref(false);
const reportRows = computed(() => {
  const rows = Object.keys(paymentStatuses).map((status) => {
    const list = payments.filter((p) => p.status === status);
    return { key: status, label: t.report.rows[status], count: list.length, sum: list.reduce((a, p) => a + p.amount, 0) };
  });
  const total = rows.reduce((a, r) => ({ count: a.count + r.count, sum: a.sum + r.sum }), { count: 0, sum: 0 });
  return [...rows, { key: "total", label: t.report.rows.total, ...total }];
});
const downloadReport = () => {
  reportOpen.value = false;
  notify(t.report.downloaded);
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <OutlineButton prepend-icon="fas fa-arrows-rotate" @click="reconcileOpen = true">
          {{ t.actions.reconcile }}
        </OutlineButton>
        <v-btn color="primary" prepend-icon="fas fa-download" :height="size['control-lg']" @click="reportOpen = true">
          {{ t.actions.dailyReport }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
      </v-col>
    </v-row>

    <FilterCard class="pay-filters" :show-reset="false" @search="search" @reset="reset">
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.reference" for="pay-ref" />
        <v-text-field id="pay-ref" v-model="draft.reference" :placeholder="t.filters.numberPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.ref1" for="pay-ref1" />
        <v-text-field id="pay-ref1" v-model="draft.ref1" :placeholder="t.filters.numberPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.company" for="pay-company" />
        <v-text-field id="pay-company" v-model="draft.company" :placeholder="t.filters.textPlaceholder" hide-details />
      </v-col>
      <v-col cols="6" sm="3" md>
        <FieldLabel :label="t.filters.status" for="pay-status" />
        <v-select id="pay-status" v-model="draft.status" :items="statusOptions" hide-details />
      </v-col>
      <v-col cols="6" sm="3" md>
        <FieldLabel :label="t.filters.bank" for="pay-bank" />
        <v-select id="pay-bank" v-model="draft.bank" :items="bankOptions" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <FieldLabel :label="t.filters.date" for="pay-date" />
        <DateField id="pay-date" v-model="draft.date" />
      </v-col>
    </FilterCard>

    <v-card class="pf-bordered">
      <AppDataTable
        :headers="t.headers"
        :items="filtered"
        :row-class="rowClass"
        class="payments-table"
        @click:row="openDetail"
      >
        <template #item.sentAt="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong">{{ formatDate(item.sentAt) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.sentAt) }} {{ t.timeSuffix }}</div>
          </div>
        </template>
        <template #item.id="{ item }">
          <span class="pf-type-body-sm-strong text-text-link">{{ item.id }}</span>
        </template>
        <template #item.company="{ item }">
          <span class="company">{{ item.company }}</span>
        </template>
        <template #item.bankCode="{ item }">
          <div class="pf-type-body-sm-strong">{{ item.bankCode }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ banks[item.bankCode] }}</div>
        </template>
        <template #item.amount="{ item }">
          <span class="pf-type-body-sm-strong">{{ formatMoney(item.amount) }}</span>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="paymentStatuses[item.status].tone" dot>{{ paymentStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <TableIconButton icon="far fa-eye" :label="t.viewLabel" @click="openDetail(item)" />
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
        </template>
      </AppDataTable>
    </v-card>

    <PaymentDetailDialog v-model="detail.open" :payment="detail.payment" />

    <AppDialog v-model="reconcileOpen" :title="t.reconcile.title" :subtitle="`${t.reconcile.description} ${formatThaiDate(paymentToday)}`" wide>
      <v-card class="pf-bordered">
        <AppDataTable :headers="t.reconcile.headers" :items="reconcileRows" item-value="bank" :paginate="false" :hover="false">
          <template #item.system="{ item }">{{ formatMoney(item.system) }}</template>
          <template #item.bankAmount="{ item }">{{ formatMoney(item.bankAmount) }}</template>
          <template #item.result>
            <StatusBadge tone="success" dot>{{ t.reconcile.matched }}</StatusBadge>
          </template>
        </AppDataTable>
      </v-card>
      <template #actions>
        <v-btn variant="outlined" color="secondary" @click="reconcileOpen = false">{{ common.actions.cancel }}</v-btn>
        <v-btn color="primary" prepend-icon="fas fa-check" @click="confirmReconcile">{{ t.reconcile.confirm }}</v-btn>
      </template>
    </AppDialog>

    <AppDialog v-model="reportOpen" :title="t.report.title" :subtitle="`${t.report.date} ${formatThaiDate(paymentToday)}`">
      <div class="d-flex flex-column ga-3">
        <div
          v-for="r in reportRows"
          :key="r.key"
          class="d-flex align-center justify-space-between ga-4 pa-4 rounded-lg"
          :class="r.key === 'total' ? 'bg-accent-teal-subtle' : 'bg-bg-surface-muted'"
        >
          <div>
            <StatusBadge v-if="r.key !== 'total'" :tone="paymentStatuses[r.key].tone" dot>{{ r.label }}</StatusBadge>
            <span v-else class="pf-type-label-lg text-text-brand">{{ r.label }}</span>
            <div class="pf-type-caption text-text-tertiary mt-1">{{ t.report.count(r.count) }}</div>
          </div>
          <span class="pf-type-h4 text-text-primary">{{ formatMoney(r.sum) }}</span>
        </div>
      </div>
      <template #actions>
        <v-btn variant="outlined" color="secondary" @click="reportOpen = false">{{ common.actions.close }}</v-btn>
        <v-btn color="primary" prepend-icon="fas fa-file-pdf" @click="downloadReport">{{ t.report.download }}</v-btn>
      </template>
    </AppDialog>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.payments-table :deep(th) {
  white-space: pre !important;
}
.payments-table :deep(td) {
  white-space: nowrap;
}
.payments-table :deep(th),
.payments-table :deep(td) {
  padding-inline: var(--pf-space-10) !important;
}
.pay-filters :deep(label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.payments-table :deep(tbody tr) {
  cursor: pointer;
}
.company {
  display: inline-block;
  white-space: normal;
  min-width: var(--pf-space-120);
}
</style>
