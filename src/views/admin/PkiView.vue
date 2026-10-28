<script setup>
// D17 · Admin / PKI Certificates – Expiring (B-18) — Figma node 22:5813
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import OutlineButton from "@/components/payments/OutlineButton.vue";
import TableIconButton from "@/components/payments/TableIconButton.vue";
import AppDialog from "@/components/payments/AppDialog.vue";
import AlertSettingsForm from "@/components/pki/AlertSettingsForm.vue";
import AgentList from "@/components/pki/AgentList.vue";
import CertImportDialog from "@/components/pki/CertImportDialog.vue";
import { daysBetween, addDays } from "@/components/outbreak/outbreak-utils.js";
import { pkiText as t } from "@/content/pki.js";
import { common } from "@/content/common.js";
import { agents, certCategories, certificates, lastAlertAt, nearExpiryDays, pkiToday } from "@/mocks/pki.js";
import { formatDate, formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("thanakorn");

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- ใบรับรอง ----------
const list = ref(certificates.map((c) => ({ ...c })));
const rows = computed(() =>
  list.value.map((c) => {
    const daysLeft = daysBetween(pkiToday, c.expiresOn);
    return { ...c, daysLeft, status: daysLeft <= 0 ? "expired" : daysLeft <= nearExpiryDays ? "near" : "active" };
  })
);
const near = computed(() => rows.value.filter((c) => c.status === "near"));
const rowClass = (c) => (c.status === "near" ? "pf-row-highlight" : "");
const statusTone = { active: "success", near: "warning", expired: "danger" };

const kpis = computed(() => [
  { key: "active", icon: "fas fa-shield-halved", tone: "green", label: t.kpis.active, value: rows.value.filter((c) => c.status !== "expired").length },
  { key: "near", icon: "far fa-clock", tone: "amber", label: t.kpis.near(nearExpiryDays), value: near.value.length },
  { key: "expired", icon: "fas fa-triangle-exclamation", tone: "red", label: t.kpis.expired, value: rows.value.filter((c) => c.status === "expired").length },
  { key: "agents", icon: "fas fa-server", tone: "teal", label: t.kpis.connected, value: `${agents.filter((a) => a.online).length} / ${agents.length}` },
]);

const tab = ref("all");
const tabs = computed(() => [
  { value: "all", label: t.tabs.all, count: rows.value.length },
  ...certCategories.map((c) => ({ value: c, label: t.tabs[c], count: rows.value.filter((r) => r.category === c).length })),
]);
const visible = computed(() => rows.value.filter((r) => tab.value === "all" || r.category === tab.value));

// แจ้งเตือนใบรับรอง Signer ใกล้หมดอายุ
const nearSigners = computed(() => near.value.filter((c) => c.category === "signer"));
const alertTitle = computed(() =>
  t.alert.title(nearSigners.value.length, Math.max(...nearSigners.value.map((c) => c.daysLeft)))
);
const alertBody = computed(() => {
  const first = [...nearSigners.value].sort((a, b) => a.expiresOn.localeCompare(b.expiresOn))[0];
  return t.alert.body(formatDateTime(lastAlertAt), formatDate(first.expiresOn));
});

// ---------- ดูรายละเอียด / ตรวจใหม่ ----------
const detail = reactive({ open: false, cert: null });
const openDetail = (c) => Object.assign(detail, { open: true, cert: c });
const f = t.detail.fields;
const detailItems = computed(() => {
  const c = detail.cert;
  if (!c) return [];
  return [
    { label: f.subject, value: c.subject },
    { label: f.type, value: c.type },
    { label: f.issuer, value: c.issuer },
    { label: f.serial, value: c.serial },
    { label: f.validFrom, value: formatDate(c.validFrom) },
    { label: f.expiresOn, value: formatDate(c.expiresOn) },
    { label: f.daysLeft, value: t.detail.days(c.daysLeft), status: c.status },
    { label: f.ocsp, value: t.ocsp[c.ocsp], ocsp: true },
    { label: f.keyUsage, value: c.keyUsage },
    { label: f.fingerprint, value: c.fingerprint },
  ];
});
const recheck = (c) => notify(t.rechecked(c.subject));

// ---------- นำเข้า / สภาพแวดล้อม / ตั้งค่า ----------
const importOpen = ref(false);
const importCert = ({ cn, category }) => {
  const id = Math.max(...list.value.map((c) => c.id)) + 1;
  const hex = (n) => n.toString(16).toUpperCase().padStart(2, "0");
  list.value.push({
    id,
    subject: `CN=${cn}`,
    type: t.importDialog.typeLabel[category],
    category,
    issuer: t.importDialog.issuer,
    serial: [id * 17, id * 29, id * 41, id * 53].map((n) => hex(n % 256)).join(":"),
    validFrom: pkiToday,
    expiresOn: addDays(pkiToday, 730),
    ocsp: "good",
    keyUsage: "Digital Signature, Key Encipherment",
    fingerprint: "—",
  });
  tab.value = "all";
  notify(t.importDialog.imported(cn));
};

const env = ref("test");
const switchEnv = (value) => {
  env.value = value;
  notify(t.env.switched(t.env[value]));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <v-menu>
          <template #activator="{ props }">
            <OutlineButton v-bind="props" append-icon="fas fa-chevron-down">{{ t.env[env] }}</OutlineButton>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="key in ['test', 'production']"
              :key="key"
              :title="t.env[key]"
              :active="env === key"
              color="primary"
              @click="switchEnv(key)"
            />
          </v-list>
        </v-menu>
        <v-btn color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="importOpen = true">
          {{ t.import }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" />
      </v-col>
    </v-row>

    <v-card class="pf-bordered mb-6">
      <div class="px-4 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>
      <AppDataTable :headers="t.headers" :items="visible" :paginate="false" :row-class="rowClass" class="pki-table">
        <template #item.subject="{ item }">
          <span class="subject d-inline-block py-3">{{ item.subject }}</span>
        </template>
        <template #item.type="{ item }">
          <span class="type d-inline-block">{{ item.type }}</span>
        </template>
        <template #item.expiresOn="{ item }">{{ formatDate(item.expiresOn) }}</template>
        <template #item.ocsp="{ item }">
          <StatusBadge :tone="item.ocsp === 'good' ? 'success' : 'danger'" dot>{{ t.ocsp[item.ocsp] }}</StatusBadge>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="statusTone[item.status]" dot>{{ t.status[item.status] }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="far fa-eye" :label="t.view" @click="openDetail(item)" />
            <TableIconButton icon="fas fa-arrows-rotate" :label="t.recheck" @click="recheck(item)" />
          </div>
        </template>
      </AppDataTable>
      <div v-if="nearSigners.length" class="pa-4 pf-bordered-top">
        <AlertBox tone="warning" :title="alertTitle" class="pki-alert">{{ alertBody }}</AlertBox>
      </div>
    </v-card>

    <v-row>
      <v-col cols="12" lg="7">
        <AlertSettingsForm @saved="notify(t.settings.saved)" />
      </v-col>
      <v-col cols="12" lg="5">
        <AgentList :agents="agents" />
      </v-col>
    </v-row>

    <AppDialog v-model="detail.open" :title="t.detail.title" :subtitle="detail.cert?.subject">
      <KeyValueList :items="detailItems" :columns="2">
        <template #value="{ item }">
          <StatusBadge v-if="item.ocsp" tone="success" dot>{{ item.value }}</StatusBadge>
          <StatusBadge v-else-if="item.status" :tone="statusTone[item.status]" dot>{{ item.value }}</StatusBadge>
          <span v-else class="value">{{ item.value }}</span>
        </template>
      </KeyValueList>
      <template #actions>
        <OutlineButton prepend-icon="fas fa-arrows-rotate" :height="size['control-md']" @click="recheck(detail.cert)">
          {{ t.recheck }}
        </OutlineButton>
        <v-btn color="primary" :height="size['control-md']" @click="detail.open = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <CertImportDialog v-model="importOpen" @import="importCert" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.pki-table :deep(td) {
  white-space: nowrap;
}
.pki-table :deep(th),
.pki-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.subject,
.type {
  white-space: normal;
  min-width: var(--pf-space-120);
  max-width: calc(var(--pf-space-120) * 2);
}
.type {
  max-width: calc(var(--pf-space-120) + var(--pf-space-40));
}
.pki-alert {
  border: var(--pf-stroke-default) solid rgba(var(--v-theme-warning), 0.4);
}
.value {
  word-break: break-all;
}
</style>
