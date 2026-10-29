<script setup>
// B-23 · ตั้งค่า CPA / การเชื่อมต่อ ebMS (เสนอเพิ่ม — ยังไม่มีใน Figma) — TOR 4.6.1 (1), 8.6
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AppDialog from "@/components/AppDialog.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import CpaFormDialog from "@/components/cpa/CpaFormDialog.vue";
import ConnectionTestDialog from "@/components/cpa/ConnectionTestDialog.vue";
import { buildCpaXml, cpaText as t } from "@/content/cpa.js";
import { common } from "@/content/common.js";
import { cpaList, cpaNow, cpaStatuses, ownPartyId } from "@/mocks/cpa.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

const session = useSessionStore();
session.signInAs("thanakorn");

// lastTest = ผลการทดสอบอัตโนมัติรอบล่าสุด
const list = ref(
  cpaList.map((c) => ({ ...c, lastTest: c.testResult, actions: [...c.actions], history: c.history.map((h) => ({ ...h })) }))
);
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

const kpis = computed(() => [
  { key: "total", icon: "fas fa-handshake", tone: "teal", label: t.kpis.total, value: list.value.length },
  { key: "active", icon: "fas fa-circle-check", tone: "green", label: t.kpis.active, value: list.value.filter((c) => c.status === "active").length },
  { key: "testing", icon: "fas fa-flask", tone: "blue", label: t.kpis.testing, value: list.value.filter((c) => c.status === "testing").length },
  {
    key: "failed",
    icon: "fas fa-plug-circle-xmark",
    tone: "red",
    label: t.kpis.failed,
    value: list.value.filter((c) => c.lastTest === "fail").length,
    caption: t.kpis.failedCaption,
  },
]);

// ---------- ตัวกรอง ----------
const filters = reactive({ q: "", status: null });
const statusItems = [
  { title: t.filters.allStatuses, value: null },
  ...Object.entries(cpaStatuses).map(([value, s]) => ({ title: s.label, value })),
];
const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase();
  return list.value.filter(
    (c) =>
      (!q || [c.id, c.partner, c.partyId].some((v) => v.toLowerCase().includes(q))) && (!filters.status || c.status === filters.status)
  );
});
const rowClass = (c) => (c.lastTest === "fail" ? "pf-row-highlight" : "");

// ---------- แก้ไข ----------
const editor = reactive({ open: false, cpa: null });
const openEditor = (c) => Object.assign(editor, { open: true, cpa: c });
const save = (data, note) => {
  const target = list.value.find((c) => c.id === editor.cpa.id);
  Object.assign(target, data);
  target.history.unshift({ version: data.version, at: cpaNow, by: session.user.name, note });
  notify(t.form.saved(target.id, data.version));
};

// ---------- ทดสอบการเชื่อมต่อ ----------
const tester = reactive({ open: false, cpa: null });
const openTest = (c) => Object.assign(tester, { open: true, cpa: c });
const setResult = (result) => (tester.cpa.lastTest = result);
const testAll = () => {
  list.value.forEach((c) => (c.lastTest = c.testResult));
  notify(t.testedAll(list.value.filter((c) => c.lastTest === "success").length, list.value.length));
};

// ---------- XML / ประวัติ ----------
const xml = reactive({ open: false, cpa: null });
const openXml = (c) => Object.assign(xml, { open: true, cpa: c });
const copyXml = async () => {
  const text = buildCpaXml(xml.cpa, ownPartyId)
    .map((l) => `${"  ".repeat(l.indent ?? 0)}${l.text}`)
    .join("\n");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* Prototype — ไม่มีสิทธิ์ clipboard ก็แจ้งผลเหมือนเดิม */
  }
  notify(t.xmlDialog.copied);
};
const history = reactive({ open: false, cpa: null });
const openHistory = (c) => Object.assign(history, { open: true, cpa: c });
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-tower-broadcast" :to="{ name: 'admin-ebxml' }">{{ t.actions.monitor }}</SecondaryButton>
        <SecondaryButton icon="fas fa-plug-circle-check" @click="testAll">{{ t.actions.testAll }}</SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-file-import" :height="size['control-lg']" @click="notify(t.actions.imported)">
          {{ t.actions.import }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
        <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
      </v-col>
    </v-row>

    <v-card class="pf-bordered">
      <v-row dense class="pa-5">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="filters.q"
            :placeholder="t.filters.search"
            :aria-label="t.filters.search"
            prepend-inner-icon="fas fa-magnifying-glass"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="filters.status" :items="statusItems" :aria-label="t.filters.allStatuses" hide-details />
        </v-col>
      </v-row>

      <AppDataTable :headers="t.headers" :items="filtered" :paginate="false" :row-class="rowClass" class="cpa-table">
        <template #item.id="{ item }">
          <div class="py-3">
            <div class="pf-type-body-sm-strong">{{ item.id }}</div>
            <div v-if="item.lastTest" class="pf-type-caption" :class="item.lastTest === 'fail' ? 'text-status-danger-fg' : 'text-status-success-fg'">
              <v-icon :icon="item.lastTest === 'fail' ? 'fas fa-circle-xmark' : 'fas fa-circle-check'" size="x-small" class="me-1" />
              {{ t.lastTest[item.lastTest] }}
            </div>
          </div>
        </template>
        <template #item.service="{ item }">
          <div>{{ item.service }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ item.actions.join(" · ") }}</div>
        </template>
        <template #item.version="{ item }">
          <StatusBadge tone="neutral">v{{ item.version }}</StatusBadge>
        </template>
        <template #item.endpoint="{ item }">
          <span class="endpoint d-inline-block text-text-secondary">{{ item.endpoint }}</span>
        </template>
        <template #item.certificate="{ item }">
          <span class="d-inline-flex align-center ga-1">
            <v-icon icon="fas fa-shield-halved" color="icon-brand" size="x-small" />{{ item.certificate.replace("CN=", "") }}
          </span>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="cpaStatuses[item.status].tone" dot>{{ cpaStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="fas fa-pen" :label="t.edit" @click="openEditor(item)" />
            <TableIconButton icon="fas fa-plug" :label="t.test" @click="openTest(item)" />
            <TableIconButton icon="fas fa-code" :label="t.viewXml" @click="openXml(item)" />
            <TableIconButton icon="fas fa-clock-rotate-left" :label="t.history" @click="openHistory(item)" />
          </div>
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
        </template>
      </AppDataTable>
      <div class="pa-4 pf-bordered-top">
        <AlertBox tone="info">{{ t.standards }}</AlertBox>
      </div>
    </v-card>

    <CpaFormDialog v-model="editor.open" :cpa="editor.cpa" @save="save" />
    <ConnectionTestDialog v-model="tester.open" :cpa="tester.cpa" @result="setResult" />

    <AppDialog
      v-model="xml.open"
      :title="t.xmlDialog.title"
      :subtitle="xml.cpa ? t.xmlDialog.subtitle(xml.cpa.id, xml.cpa.version) : ''"
      wide
    >
      <div class="rounded-lg overflow-hidden">
        <CodeViewer v-if="xml.cpa" :lines="buildCpaXml(xml.cpa, ownPartyId)" />
      </div>
      <template #actions>
        <SecondaryButton icon="far fa-copy" height="control-md" @click="copyXml">{{ t.xmlDialog.copy }}</SecondaryButton>
        <v-btn color="primary" :height="size['control-md']" @click="xml.open = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <AppDialog v-model="history.open" :title="t.historyDialog.title" :subtitle="history.cpa ? `${history.cpa.id} · ${history.cpa.partner}` : ''" wide>
      <v-card v-if="history.cpa" class="pf-bordered">
        <AppDataTable :headers="t.historyDialog.headers" :items="history.cpa.history" item-value="at" :paginate="false" :hover="false" class="cpa-table">
          <template #item.version="{ item, index }">
            <div class="d-flex align-center ga-2">
              <StatusBadge :tone="index === 0 ? 'success' : 'neutral'">v{{ item.version }}</StatusBadge>
              <span v-if="index === 0" class="pf-type-caption text-status-success-fg">{{ t.historyDialog.current }}</span>
            </div>
          </template>
          <template #item.at="{ item }">{{ formatDateTime(item.at) }}</template>
          <template #item.note="{ item }">
            <span class="note d-inline-block py-3">{{ item.note }}</span>
          </template>
        </AppDataTable>
      </v-card>
      <template #actions>
        <v-btn color="primary" :height="size['control-md']" @click="history.open = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.cpa-table :deep(td) {
  white-space: nowrap;
}
.cpa-table :deep(th),
.cpa-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.endpoint {
  max-width: calc(var(--pf-space-120) + var(--pf-space-80));
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.note {
  white-space: normal;
  min-width: calc(var(--pf-space-120) + var(--pf-space-80));
}
</style>
