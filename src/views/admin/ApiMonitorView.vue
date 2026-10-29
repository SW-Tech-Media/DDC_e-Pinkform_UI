<script setup>
// B-24 · ติดตามการเชื่อมโยง API (เสนอเพิ่ม — ยังไม่มีใน Figma) — TOR 4.6.1 ส่วน API
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AppDialog from "@/components/AppDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import ClientFormDialog from "@/components/api/ClientFormDialog.vue";
import KeyRevealDialog from "@/components/api/KeyRevealDialog.vue";
import { apiMonitorText as t, buildApiSample, toJsonText } from "@/content/api-monitor.js";
import { common } from "@/content/common.js";
import {
  apiClients,
  apiLogs,
  apiStats,
  clientStatuses,
  clientTypes,
  httpClass,
  httpClasses,
  httpMethods,
} from "@/mocks/api-monitor.js";
import { formatDate, formatDateTime, formatNumber, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("thanakorn");

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

const kpis = [
  { key: "calls", icon: "fas fa-arrow-right-arrow-left", tone: "teal", label: t.kpis.calls, value: formatNumber(apiStats.calls) },
  { key: "rate", icon: "fas fa-check", tone: "green", label: t.kpis.successRate, value: apiStats.successRate },
  { key: "avg", icon: "fas fa-gauge-high", tone: "blue", label: t.kpis.avg, value: t.kpis.avgValue(apiStats.avgMs), caption: t.kpis.avgCaption },
  { key: "err", icon: "fas fa-triangle-exclamation", tone: "red", label: t.kpis.errors, value: formatNumber(apiStats.errors), caption: t.kpis.errorsCaption },
];

const clients = ref(apiClients.map((c) => ({ ...c, scopes: [...c.scopes] })));
const tab = ref("logs");
const tabs = computed(() => [
  { value: "logs", label: t.tabs.logs, count: apiLogs.length },
  { value: "clients", label: t.tabs.clients, count: clients.value.length },
]);

// ---------- Log ----------
const filters = reactive({ q: "", method: null, status: null });
const methodItems = [{ title: t.filters.allMethods, value: null }, ...httpMethods.map((m) => ({ title: m, value: m }))];
const statusItems = [
  { title: t.filters.allStatuses, value: null },
  ...Object.entries(httpClasses).map(([value, c]) => ({ title: c.label, value })),
];
const logs = computed(() => {
  const q = filters.q.trim().toLowerCase();
  return apiLogs.filter(
    (l) =>
      (!q || [l.endpoint, l.client, l.errorCode].some((v) => v.toLowerCase().includes(q))) &&
      (!filters.method || l.method === filters.method) &&
      (!filters.status || httpClass(l.status) === filters.status)
  );
});
const methodTone = { GET: "info", POST: "accent", PUT: "warning" };
const isSlow = (l) => l.ms >= 1000;
const rowClass = (l) => (l.status >= 500 ? "pf-row-highlight" : "");

const sample = reactive({ open: false, log: null, lines: null });
const openSample = (l) => Object.assign(sample, { open: true, log: l, lines: buildApiSample(l) });
const copySample = async () => {
  try {
    await navigator.clipboard.writeText(`${toJsonText(sample.lines.request)}\n\n${toJsonText(sample.lines.response)}`);
  } catch {
    /* Prototype — ไม่มีสิทธิ์ clipboard ก็แจ้งผลเหมือนเดิม */
  }
  notify(t.sample.copied);
};

// ---------- Client ----------
const randomHex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, "0")).join("");
const reveal = reactive({ open: false, secret: null });
const showSecret = (mode, c, key) => Object.assign(reveal, { open: true, secret: { mode, name: c.name, type: c.type, clientId: c.clientId, key } });
const maskKey = (key) => `${key.slice(0, 12)}••••${key.slice(-4)}`;

const createOpen = ref(false);
const createClient = (data) => {
  const id = Math.max(...clients.value.map((c) => c.id)) + 1;
  const key = data.type === "oauth" ? `cs_${randomHex(24)}` : `pk_live_${randomHex(20)}`;
  const clientId = data.type === "oauth" ? `client-${randomHex(4)}` : maskKey(key);
  const client = { ...data, id, clientId, status: "active", lastUsed: null };
  clients.value.unshift(client);
  tab.value = "clients";
  showSecret("new", client, key);
};
const regenerate = (c) => {
  const key = c.type === "oauth" ? `cs_${randomHex(24)}` : `pk_live_${randomHex(20)}`;
  if (c.type === "apiKey") c.clientId = maskKey(key);
  c.status = "active";
  showSecret("regen", c, key);
};
const revoking = reactive({ open: false, client: null });
const askRevoke = (c) => Object.assign(revoking, { open: true, client: c });
const revoke = () => {
  revoking.client.status = "revoked";
  notify(t.confirmRevoke.done(revoking.client.name));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="far fa-file-lines" @click="notify(t.actions.specOpened)">{{ t.actions.spec }}</SecondaryButton>
        <SecondaryButton v-if="tab === 'logs'" icon="fas fa-download" @click="notify(t.actions.exported(logs.length))">
          {{ t.actions.exportLog }}
        </SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="createOpen = true">
          {{ t.actions.addClient }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
      </v-col>
    </v-row>

    <AlertBox tone="info" icon="fas fa-lock" :title="t.security.title" class="mb-6">{{ t.security.body }}</AlertBox>

    <v-card class="pf-bordered">
      <div class="px-4 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>

      <template v-if="tab === 'logs'">
        <v-row dense class="pa-5">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filters.q"
              :placeholder="t.filters.search"
              :aria-label="t.filters.search"
              prepend-inner-icon="fas fa-magnifying-glass"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-select v-model="filters.method" :items="methodItems" :aria-label="t.filters.allMethods" hide-details />
          </v-col>
          <v-col cols="6" md="3">
            <v-select v-model="filters.status" :items="statusItems" :aria-label="t.filters.allStatuses" hide-details />
          </v-col>
        </v-row>

        <AppDataTable :headers="t.logHeaders" :items="logs" :per-page="10" :show-per-page="false" :row-class="rowClass" class="api-table">
          <template #item.at="{ item }">
            <div class="pf-type-body-sm-strong">{{ formatTime(item.at) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatDate(item.at) }}</div>
          </template>
          <template #item.method="{ item }">
            <StatusBadge :tone="methodTone[item.method]">{{ item.method }}</StatusBadge>
          </template>
          <template #item.endpoint="{ item }">
            <span class="pf-type-body-sm-strong">{{ item.endpoint }}</span>
          </template>
          <template #item.status="{ item }">
            <StatusBadge :tone="httpClasses[httpClass(item.status)].tone" dot>{{ item.status }}</StatusBadge>
          </template>
          <template #item.errorCode="{ item }">
            <span :class="item.errorCode ? 'text-status-danger-fg' : 'text-text-tertiary'">{{ item.errorCode || "–" }}</span>
          </template>
          <template #item.ms="{ item }">
            <span :class="isSlow(item) ? 'text-status-warning-fg pf-type-body-sm-strong' : ''">{{ t.ms(item.ms) }}</span>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <TableIconButton icon="fas fa-code" :label="t.viewSample" @click="openSample(item)" />
            </div>
          </template>
          <template #no-data>
            <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
          </template>
        </AppDataTable>
      </template>

      <AppDataTable v-else :headers="t.clientHeaders" :items="clients" :paginate="false" class="api-table">
        <template #item.name="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong">{{ item.name }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ item.clientId }}</div>
          </div>
        </template>
        <template #item.type="{ item }">
          <StatusBadge :tone="clientTypes[item.type].tone">{{ clientTypes[item.type].label }}</StatusBadge>
        </template>
        <template #item.scopes="{ item }">
          <div class="scopes d-flex flex-wrap ga-1 py-2">
            <span v-for="s in item.scopes" :key="s" class="scope pf-type-caption bg-bg-subtle text-text-secondary px-2">{{ s }}</span>
          </div>
        </template>
        <template #item.expiresOn="{ item }">{{ formatDate(item.expiresOn) }}</template>
        <template #item.lastUsed="{ item }">
          <span :class="item.lastUsed ? '' : 'text-text-tertiary'">{{ item.lastUsed ? formatDateTime(item.lastUsed) : "–" }}</span>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="clientStatuses[item.status].tone" dot>{{ clientStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="fas fa-key" :label="t.regenerate" @click="regenerate(item)" />
            <TableIconButton
              icon="fas fa-ban"
              :label="t.revoke"
              tone="status-danger-fg"
              :disabled="item.status === 'revoked'"
              @click="askRevoke(item)"
            />
          </div>
        </template>
      </AppDataTable>
    </v-card>

    <AppDialog
      v-model="sample.open"
      :title="t.sample.title"
      :subtitle="sample.log ? t.sample.subtitle(sample.log.method, sample.log.endpoint) : ''"
      wide
    >
      <div v-if="sample.lines" class="d-flex flex-column ga-4">
        <div class="rounded-lg overflow-hidden">
          <CodeViewer :lines="sample.lines.request" :title="t.sample.request" :caption="sample.log.client" />
        </div>
        <div class="rounded-lg overflow-hidden">
          <CodeViewer :lines="sample.lines.response" :title="t.sample.response(sample.log.status, t.ms(sample.log.ms))" />
        </div>
      </div>
      <template #actions>
        <SecondaryButton icon="far fa-copy" height="control-md" @click="copySample">{{ t.sample.copy }}</SecondaryButton>
        <v-btn color="primary" :height="size['control-md']" @click="sample.open = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <ClientFormDialog v-model="createOpen" @create="createClient" />
    <KeyRevealDialog v-model="reveal.open" :secret="reveal.secret" @copied="notify" />

    <ConfirmDialog
      v-model="revoking.open"
      :title="t.confirmRevoke.title"
      :message="revoking.client ? t.confirmRevoke.message(revoking.client.name) : ''"
      :confirm-text="t.confirmRevoke.confirm"
      icon="fas fa-ban"
      @confirm="revoke"
    />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.api-table :deep(td) {
  white-space: nowrap;
}
.api-table :deep(th),
.api-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.scopes {
  white-space: normal;
  min-width: calc(var(--pf-space-120) + var(--pf-space-40));
  max-width: calc(var(--pf-space-120) * 2);
}
.scope {
  border-radius: var(--pf-radius-xs);
}
</style>
