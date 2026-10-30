<script setup>
// D16 · Admin / ebXML Monitor – Retry Detail (B-17) — Figma node 22:4793
// รองรับ query สำหรับลิงก์: ?ref=<Reference No.> (ข้อความทั้งหมดของคำขอ / ทะเบียนนั้น ทุกวันที่) &q= &type=<key ใน messageTypes> &direction= &status= &date=YYYY-MM-DD|all
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import AlertBox from "@/components/AlertBox.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import AppDialog from "@/components/AppDialog.vue";
import DateField from "@/components/DateField.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import RetryHistory from "@/components/ebxml/RetryHistory.vue";
import CpaDialog from "@/components/ebxml/CpaDialog.vue";
import { buildHeaderXml, buildPayloadXml, ebxmlText as t } from "@/content/ebxml.js";
import { common } from "@/content/common.js";
import { directions, ebxmlNow, ebxmlToday, maxRetry, messages, messageTypes, sessionMessages } from "@/mocks/ebxml.js";
import { pendingCodeNote } from "@/mocks/message-types.js";
import { formatDate, formatNumber } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";
import { usePaymentsStore } from "@/stores/payments.js";
import { useReviewStore } from "@/stores/review.js";

const session = useSessionStore();
session.signInAs("thanakorn");
const route = useRoute();
const router = useRouter();

const list = ref(messages.map((m) => ({ ...m, attempts: m.attempts.map((a) => ({ ...a })) })));

// ข้อความจากการอนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติในรอบนี้ (B-06) — เพิ่มเข้า list ครั้งเดียวต่อข้อความ
// เพื่อให้ผลการ "ส่งใหม่" ที่แก้ใน list ไม่หายเมื่อ store เปลี่ยน · ชั่วคราวจนกว่าจะมี API (backend อ่านจาก Transaction Log)
const paymentsStore = usePaymentsStore();
const reviewStore = useReviewStore();
const fresh = computed(() => sessionMessages(paymentsStore.orders, reviewStore.records));
watch(
  fresh,
  (msgs) => {
    const ids = new Set(list.value.map((m) => m.id));
    const added = msgs.filter((m) => !ids.has(m.id));
    if (added.length) list.value = [...added, ...list.value].sort((a, b) => b.at.localeCompare(a.at));
  },
  { immediate: true }
);
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- KPI (คำนวณจากรายการจริง — รับ / ส่ง / อัตราสำเร็จ นับเฉพาะวันนี้) ----------
const count = (status) => list.value.filter((m) => m.status === status).length;
const todayList = computed(() => list.value.filter((m) => m.date === ebxmlToday));
const todayCount = (direction) => todayList.value.filter((m) => m.direction === direction).length;
const successRate = computed(() => {
  const n = todayList.value.length;
  const ok = todayList.value.filter((m) => m.status === "success").length;
  return n ? `${formatNumber(Math.round((ok / n) * 1000) / 10)}%` : "–";
});
const kpis = computed(() => [
  { key: "in", icon: "fas fa-download", tone: "teal", label: t.kpis.received, value: formatNumber(todayCount("in")) },
  { key: "out", icon: "far fa-paper-plane", tone: "pink", label: t.kpis.sent, value: formatNumber(todayCount("out")) },
  { key: "rate", icon: "fas fa-check", tone: "green", label: t.kpis.successRate, value: successRate.value },
  { key: "queue", icon: "far fa-clock", tone: "blue", label: t.kpis.queue, value: count("retry") + count("waitAck") },
  { key: "err", icon: "fas fa-triangle-exclamation", tone: "red", label: t.kpis.errors, value: `${count("error")} / ${count("retry")}` },
]);

// ---------- ตัวกรอง (มีผลทันที และเก็บใน query string ให้ลิงก์ / รีเฟรชกลับมาที่ผลเดิม) ----------
const initial = route.query;
const str = (v) => (typeof v === "string" ? v : "");
const pick = (v, keys) => (keys.includes(v) ? v : null);
// ?ref= เปิดดูข้อความของคำขอเดียว — ไม่จำกัดวันที่ (ข้อความของคำขออาจข้ามวัน) เว้นแต่ระบุ date มาเอง
const requestRef = ref(str(initial.ref).trim());
const defaultDate = () => (requestRef.value ? null : ebxmlToday);
const filters = reactive({
  q: str(initial.q),
  type: pick(initial.type, Object.keys(messageTypes)),
  direction: pick(initial.direction, Object.keys(directions)),
  status: pick(initial.status, Object.keys(t.statusFilter)),
  date: initial.date === "all" ? null : /^\d{4}-\d{2}-\d{2}$/.test(str(initial.date)) ? initial.date : defaultDate(),
});
const syncQuery = () => {
  const query = {};
  if (requestRef.value) query.ref = requestRef.value;
  if (filters.q?.trim()) query.q = filters.q.trim();
  ["type", "direction", "status"].forEach((k) => filters[k] && (query[k] = filters[k]));
  if (filters.date !== defaultDate()) query.date = filters.date ?? "all";
  router.replace({ query });
};
watch(filters, syncQuery);
const clearRequest = () => {
  requestRef.value = "";
  filters.date = ebxmlToday;
  syncQuery();
};
const typeLabel = (key) => messageTypes[key].code ?? `${messageTypes[key].label}*`;
const typeItems = [
  { title: t.filters.allTypes, value: null },
  ...Object.keys(messageTypes).map((key) => ({ title: typeLabel(key), value: key })),
];
const directionItems = [
  { title: t.filters.allDirections, value: null },
  ...Object.entries(directions).map(([value, d]) => ({ title: d.label, value })),
];
const statusItems = [
  { title: t.filters.allStatuses, value: null },
  ...Object.entries(t.statusFilter).map(([value, title]) => ({ title, value })),
];
const filtered = computed(() => {
  const q = (filters.q ?? "").trim().toLowerCase();
  return list.value.filter(
    (m) =>
      (!requestRef.value || m.requestRef === requestRef.value) &&
      (!q || [m.id, m.reference, m.requestRef, m.docType, m.note].some((v) => v.toLowerCase().includes(q))) &&
      (!filters.type || m.type === filters.type) &&
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
// เปิดจากคำขอ = ข้อความล่าสุดของคำขอนั้น · ปกติ = ข้อความที่รอส่งซ้ำ (ตาม Figma)
const selectedId = ref((requestRef.value ? filtered.value[0] : messages.find((m) => m.status === "retry"))?.id);
const requestCount = computed(() => list.value.filter((m) => m.requestRef === requestRef.value).length);
// ลิงก์กลับไปหน้าติดตามสถานะ — เฉพาะคำขอใบรับรองฯ และผู้ใช้ที่มีสิทธิ์เมนูนั้น (backend เป็นผู้ตรวจจริง)
const canTrack = computed(() => /^PF\d+$/.test(requestRef.value) && session.can("tracking"));
const selected = computed(() => list.value.find((m) => m.id === selectedId.value));
// ข้อความในรอบนี้ที่ไม่อยู่ในวันที่ที่กรอง (วันที่จริงต่างจากวันที่ของข้อมูลจำลอง) — แจ้งให้เปิดดูทุกวันที่
const freshHidden = computed(() => (filters.date ? fresh.value.filter((m) => m.date !== filters.date).length : 0));
const showFresh = () => {
  filters.date = null;
  selectedId.value = fresh.value[0]?.id ?? selectedId.value;
};
const rowClass = (m) => (m.id === selectedId.value ? "pf-row-highlight" : "");
const select = (m) => (selectedId.value = m.id);

const resend = (m) => {
  const done = m.attempts.filter((a) => a.status !== "scheduled" && a.status !== "waitAck");
  m.attempts = [...done, { time: ebxmlNow.slice(11, 19), label: t.detail.resendLabel(done.length + 1), status: "success" }];
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

    <AlertBox v-if="requestRef" tone="info" :title="t.byRequest.title(requestRef)" class="mb-6">
      {{ t.byRequest.body(requestCount) }}
      <template #aside>
        <div class="d-flex flex-wrap justify-end ga-2">
          <SecondaryButton
            v-if="canTrack"
            height="control-md"
            prepend-icon="fas fa-list-check"
            :to="{ name: 'admin-tracking', query: { ref: requestRef } }"
          >
            {{ t.byRequest.openTracking }}
          </SecondaryButton>
          <SecondaryButton height="control-md" prepend-icon="fas fa-xmark" @click="clearRequest">{{ t.byRequest.clear }}</SecondaryButton>
        </div>
      </template>
    </AlertBox>

    <AlertBox v-if="freshHidden" tone="info" icon="fas fa-bell" :title="t.fresh.title(freshHidden)" class="mb-6">
      {{ t.fresh.body }}
      <template #aside>
        <SecondaryButton height="control-md" prepend-icon="far fa-calendar" @click="showFresh">{{ t.fresh.show }}</SecondaryButton>
      </template>
    </AlertBox>

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
      <p class="px-5 pb-4 pf-type-caption text-text-tertiary">{{ t.viaNsw }}</p>

      <AppDataTable
        :headers="t.headers"
        :items="filtered"
        :row-class="rowClass"
        class="ebxml-table"
        @click:row="select"
      >
        <template #item.time="{ item }">
          <div>{{ item.time }}</div>
          <div v-if="!filters.date" class="pf-type-caption text-text-tertiary">{{ formatDate(item.at) }}</div>
        </template>
        <template #item.docType="{ item }">
          <div class="py-2 msg">
            <div class="pf-type-body-sm-strong">
              {{ item.step ? `${item.step}. ` : "" }}{{ item.code ?? `${messageTypes[item.type].label}*` }}
            </div>
            <div class="pf-type-caption text-text-tertiary">
              {{ item.code ? messageTypes[item.type].label : pendingCodeNote[item.type] }}{{ item.note ? ` · ${item.note}` : "" }}
            </div>
          </div>
        </template>
        <template #item.reference="{ item }">
          <div class="py-2">
            <div class="pf-type-body-sm">{{ item.reference }}</div>
            <div v-if="item.reference !== item.requestRef" class="pf-type-caption text-text-tertiary">{{ item.requestRef }}</div>
          </div>
        </template>
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
        <template #item.route="{ item }">
          <div class="route py-2">{{ item.route }}</div>
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
/* ชื่อข้อความ + สถานะที่แจ้ง ตัดบรรทัดได้ ให้ตารางไม่กว้างเกินการ์ด */
.msg {
  white-space: normal;
  min-width: calc(var(--pf-space-120) + var(--pf-space-40));
  max-width: calc(var(--pf-space-120) + var(--pf-space-64));
}
/* ต้นทาง → ปลายทาง ตัดบรรทัดได้ ให้คอลัมน์สถานะ (เช่น "Retry 3 / 5") ไม่ถูกคอลัมน์จัดการที่ sticky บัง */
.route {
  white-space: normal;
  text-wrap: balance;
  min-width: var(--pf-space-120);
  max-width: calc(var(--pf-space-120) + var(--pf-space-24));
}
.detail {
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
</style>
