<script setup>
// D16 · Admin / ebXML Monitor – Retry Detail (B-17) — Figma node 22:4793
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import AppDialog from "@/components/AppDialog.vue";
import DateField from "@/components/DateField.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import RetryHistory from "@/components/ebxml/RetryHistory.vue";
import CpaDialog from "@/components/ebxml/CpaDialog.vue";
import { buildHeaderXml, buildPayloadXml, ebxmlText as t } from "@/content/ebxml.js";
import { common } from "@/content/common.js";
import { directions, docTypes, ebxmlNow, ebxmlStats, ebxmlToday, maxRetry, messages } from "@/mocks/ebxml.js";
import { formatNumber } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("thanakorn");

const list = ref(messages.map((m) => ({ ...m, attempts: m.attempts.map((a) => ({ ...a })) })));
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- KPI (คิว / ผิดพลาด คำนวณจากรายการจริง) ----------
const count = (status) => list.value.filter((m) => m.status === status).length;
const kpis = computed(() => [
  { key: "in", icon: "fas fa-download", tone: "teal", label: t.kpis.received, value: formatNumber(ebxmlStats.received) },
  { key: "out", icon: "far fa-paper-plane", tone: "pink", label: t.kpis.sent, value: formatNumber(ebxmlStats.sent) },
  { key: "rate", icon: "fas fa-check", tone: "green", label: t.kpis.successRate, value: ebxmlStats.successRate },
  { key: "queue", icon: "far fa-clock", tone: "blue", label: t.kpis.queue, value: count("retry") + count("waitAck") },
  { key: "err", icon: "fas fa-triangle-exclamation", tone: "red", label: t.kpis.errors, value: `${count("error")} / ${count("retry")}` },
]);

// ---------- ตัวกรอง (มีผลทันที) ----------
const filters = reactive({ q: "", type: null, direction: null, status: null, date: ebxmlToday });
const typeItems = [{ title: t.filters.allTypes, value: null }, ...docTypes.map((d) => ({ title: d, value: d }))];
const directionItems = [
  { title: t.filters.allDirections, value: null },
  ...Object.entries(directions).map(([value, d]) => ({ title: d.label, value })),
];
const statusItems = [
  { title: t.filters.allStatuses, value: null },
  ...Object.entries(t.statusFilter).map(([value, title]) => ({ title, value })),
];
const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase();
  return list.value.filter(
    (m) =>
      (!q || [m.id, m.reference, m.docType].some((v) => v.toLowerCase().includes(q))) &&
      (!filters.type || m.docType === filters.type) &&
      (!filters.direction || m.direction === filters.direction) &&
      (!filters.status || m.status === filters.status) &&
      (!filters.date || m.date === filters.date)
  );
});

const statusBadge = (m) =>
  ({
    success: { tone: "success", label: t.status.success },
    retry: { tone: "warning", label: t.status.retry(m.retry, maxRetry) },
    waitAck: { tone: "info", label: t.status.waitAck },
    error: { tone: "danger", label: t.status.error },
  })[m.status];

// ---------- ข้อความที่เลือก ----------
const selectedId = ref(messages.find((m) => m.status === "retry")?.id);
const selected = computed(() => list.value.find((m) => m.id === selectedId.value));
const rowClass = (m) => (m.id === selectedId.value ? "pf-row-highlight" : "");
const select = (m) => (selectedId.value = m.id);

const resend = (m) => {
  const done = m.attempts.filter((a) => a.status !== "scheduled" && a.status !== "waitAck");
  m.attempts = [...done, { time: ebxmlNow.slice(11), label: t.detail.resendLabel(done.length + 1), status: "success" }];
  m.status = "success";
  m.signature = true;
  selectedId.value = m.id;
  notify(t.detail.resent(m.short));
};

const payload = reactive({ open: false, msg: null });
const openPayload = (m) => Object.assign(payload, { open: true, msg: m });
const copyPayload = async () => {
  const text = buildPayloadXml(payload.msg)
    .map((l) => `${"  ".repeat(l.indent ?? 0)}${l.text}`)
    .join("\n");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* Prototype — ไม่มีสิทธิ์ clipboard ก็แจ้งผลเหมือนเดิม */
  }
  notify(t.payload.copied);
};

const cpaOpen = ref(false);
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton prepend-icon="fas fa-sliders" @click="cpaOpen = true">{{ t.actions.cpa }}</SecondaryButton>
        <SecondaryButton prepend-icon="fas fa-download" @click="notify(t.actions.exported(filtered.length))">
          {{ t.actions.exportLog }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <div class="kpis mb-6">
      <KpiCard v-for="k in kpis" :key="k.key" :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" />
    </div>

    <v-card class="pf-bordered">
      <v-row dense class="pa-5">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.q"
            :placeholder="t.filters.search"
            :aria-label="t.filters.search"
            prepend-inner-icon="fas fa-magnifying-glass"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md>
          <v-select v-model="filters.type" :items="typeItems" :aria-label="t.filters.allTypes" hide-details />
        </v-col>
        <v-col cols="6" sm="3" md>
          <v-select v-model="filters.direction" :items="directionItems" :aria-label="t.filters.allDirections" hide-details />
        </v-col>
        <v-col cols="6" sm="3" md>
          <v-select v-model="filters.status" :items="statusItems" :aria-label="t.filters.allStatuses" hide-details />
        </v-col>
        <v-col cols="12" sm="6" md>
          <DateField v-model="filters.date" :aria-label="t.filters.date" />
        </v-col>
      </v-row>

      <AppDataTable
        :headers="t.headers"
        :items="filtered"
        :paginate="false"
        :row-class="rowClass"
        class="ebxml-table"
        @click:row="select"
      >
        <template #item.short="{ item }">
          <span class="pf-type-body-sm">{{ item.short }}</span>
        </template>
        <template #item.direction="{ item }">
          <StatusBadge :tone="directions[item.direction].tone" dot>{{ directions[item.direction].label }}</StatusBadge>
        </template>
        <template #item.signature="{ item }">
          <StatusBadge :tone="item.signature ? 'success' : 'danger'" dot>
            {{ item.signature ? t.signature.pass : t.signature.fail }}
          </StatusBadge>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="statusBadge(item).tone" dot>{{ statusBadge(item).label }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="fas fa-code" :label="t.viewPayload" @click="openPayload(item)" />
            <TableIconButton icon="fas fa-arrows-rotate" :label="t.resend" @click="resend(item)" />
          </div>
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
        </template>
      </AppDataTable>

      <v-row v-if="selected" no-gutters class="detail">
        <v-col cols="12" lg="7">
          <CodeViewer
            :lines="buildHeaderXml(selected)"
            :title="t.detail.header(selected.short)"
            :caption="selected.routeLabel"
          />
        </v-col>
        <v-col cols="12" lg="5" class="pa-6">
          <RetryHistory :title="t.detail.history" :attempts="selected.attempts" />
          <div class="d-flex flex-wrap ga-3 mt-6">
            <v-btn
              color="primary"
              prepend-icon="fas fa-arrows-rotate"
              :height="size['control-md']"
              :disabled="selected.status === 'success'"
              @click="resend(selected)"
            >
              {{ t.detail.resendNow }}
            </v-btn>
            <SecondaryButton prepend-icon="fas fa-code" :height="size['control-md']" @click="openPayload(selected)">
              {{ t.detail.viewPayload }}
            </SecondaryButton>
          </div>
        </v-col>
      </v-row>
      <p v-else class="pa-6 pf-bordered-top pf-type-body-sm text-text-tertiary">{{ t.detail.selectHint }}</p>
    </v-card>

    <AppDialog
      v-model="payload.open"
      :title="`${t.payload.title} · ${payload.msg?.short ?? ''}`"
      :subtitle="payload.msg ? t.payload.subtitle(payload.msg.docType, payload.msg.reference) : ''"
      wide
    >
      <div class="rounded-lg overflow-hidden">
        <CodeViewer v-if="payload.msg" :lines="buildPayloadXml(payload.msg)" />
      </div>
      <template #actions>
        <SecondaryButton prepend-icon="far fa-copy" :height="size['control-md']" @click="copyPayload">{{ t.payload.copy }}</SecondaryButton>
        <v-btn color="primary" :height="size['control-md']" @click="payload.open = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <CpaDialog v-model="cpaOpen" :cpa-id="selected?.header.cpaId" @saved="notify" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.kpis {
  display: grid;
  gap: var(--pf-space-16);
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--pf-space-120) + var(--pf-space-64)), 1fr));
}
.ebxml-table :deep(td) {
  white-space: nowrap;
}
.ebxml-table :deep(th),
.ebxml-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.ebxml-table :deep(tbody tr) {
  cursor: pointer;
}
.detail {
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
</style>
