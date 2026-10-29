<script setup>
// D07 · Admin / Home – Overview (B-02)
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import SectionCard from "@/components/SectionCard.vue";
import BarChart from "@/components/BarChart.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import StatusSummaryList from "@/components/admin-home/StatusSummaryList.vue";
import SystemStatusList from "@/components/admin-home/SystemStatusList.vue";
import { adminHomeText as t } from "@/content/admin-home.js";
import { common } from "@/content/common.js";
import {
  dailyChart,
  longWaitMinutes,
  now,
  overviewDate,
  pkiExpiring,
  systemLinks,
  todayStatusGroups,
} from "@/mocks/admin-home.js";
import { requests } from "@/mocks/requests.js";
import { certificates } from "@/mocks/certificates.js";
import { formatMonthYear, formatNumber, formatThaiDate, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";
import { useReviewStore } from "@/stores/review.js";

const router = useRouter();
const session = useSessionStore();
const review = useReviewStore();
const { lgAndUp, smAndUp } = useDisplay();

const breadcrumb = [{ title: t.breadcrumb }];
const firstName = computed(() => session.user.name.split(" ")[0]);
const weekday = new Intl.DateTimeFormat("th-TH", { weekday: "long" }).format(new Date(`${overviewDate}T00:00:00`));
const description = t.description(weekday, formatThaiDate(overviewDate));

// ----- ตัวเลขสรุป: นับจากรายการคำขอ (สถานะจาก store รวมผลที่บันทึกในรอบนี้) และใบรับรองฯ -----
const BKK = 7 * 3600 * 1000;
const dayOf = (iso) => new Date(Date.parse(iso) + BKK).toISOString().slice(0, 10); // วันที่ตามเวลาไทย
const yesterday = new Date(Date.parse(`${overviewDate}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
const submittedOn = (day) => requests.filter((r) => dayOf(r.submittedAt) === day);
const withStatus = computed(() => requests.map((r) => ({ ...r, status: review.statusOf(r.ref) })));
const ofStatus = (status) => withStatus.value.filter((r) => r.status === status);
const issuedMonth = certificates.filter((c) => c.sentAt.startsWith(overviewDate.slice(0, 7))).length;

// คำขอใหม่วันนี้เทียบเมื่อวาน (%)
const newTrend = () => {
  const today = submittedOn(overviewDate).length;
  const prev = submittedOn(yesterday).length;
  if (!prev) return null;
  const pct = Math.round(((today - prev) / prev) * 100);
  return { direction: pct < 0 ? "down" : "up", value: `${Math.abs(pct)}%`, text: t.kpi.newToday.trendText };
};

const kpiCards = computed(() => {
  const pendingList = ofStatus("pending");
  const oldest = pendingList.reduce((min, r) => Math.min(min, Date.parse(r.submittedAt)), Infinity);
  const waited = Math.max(0, Math.floor((Date.parse(now) - oldest) / 60000));
  return [
    { key: "newToday", value: submittedOn(overviewDate).length, trend: newTrend() },
    {
      key: "pending",
      value: pendingList.length,
      caption: pendingList.length ? t.kpi.pending.caption(Math.floor(waited / 60), waited % 60) : t.kpi.pending.none,
    },
    { key: "awaitingPayment", value: ofStatus("awaitingPayment").length, caption: t.kpi.awaitingPayment.caption },
    { key: "issuedMonth", value: issuedMonth, caption: t.kpi.issuedMonth.caption(formatMonthYear(overviewDate)) },
  ].map((k) => ({ ...t.kpi[k.key], ...k, value: formatNumber(k.value) }));
});

// กราฟ: วันล่าสุดใช้จำนวนที่นับจากรายการ (วันก่อนหน้าเป็นยอดสรุปย้อนหลังใน mocks/admin-home.js)
const issuedToday = certificates.filter((c) => c.sentAt.startsWith(overviewDate)).length;
const series = [
  { name: t.chart.requests, color: "chart-series-1", data: [...dailyChart.requests.slice(0, -1), submittedOn(overviewDate).length] },
  { name: t.chart.issued, color: "chart-series-2", data: [...dailyChart.issued.slice(0, -1), issuedToday] },
];

// สถานะคำขอวันนี้ — นับเฉพาะคำขอที่ยื่นวันนี้ตามสถานะปัจจุบัน
const statusItems = computed(() => {
  const today = withStatus.value.filter((r) => dayOf(r.submittedAt) === overviewDate);
  return todayStatusGroups.map((g) => ({
    key: g.key,
    color: g.color,
    label: t.todayStatus.labels[g.key],
    count: g.statuses ? today.filter((r) => g.statuses.includes(r.status)).length : today.length,
  }));
});
const systemItems = systemLinks.map((s) => ({ ...s, ...t.systems.states[s.state] }));

const h = t.pendingTable.headers;
const headers = [
  { title: h.ref, key: "ref", sortable: false },
  { title: h.company, key: "company", sortable: false },
  { title: h.country, key: "country", sortable: false },
  { title: h.items, key: "items", align: "end", sortable: false },
  { title: h.submittedAt, key: "submittedAt", sortable: false },
];
const pending = computed(() =>
  requests
    .filter((r) => review.statusOf(r.ref) === "pending")
    .slice(0, 5)
    .map((r) => {
      const waited = Math.floor((new Date(now) - new Date(r.submittedAt)) / 60000);
      return { ...r, time: formatTime(r.submittedAt), waitedHours: Math.floor(waited / 60), long: waited >= longWaitMinutes };
    })
);

const openRequest = (item) => router.push({ name: "admin-request-review", params: { ref: item.ref } });
</script>

<template>
  <AdminLayout :breadcrumb="breadcrumb">
    <PageHeader :title="t.greeting(firstName)" :description="description">
      <template #actions>
        <v-btn
          variant="outlined"
          color="text-text-primary"
          :height="size['control-lg']"
          prepend-icon="fas fa-download"
          class="pf-type-label-lg bg-surface report-btn"
        >
          {{ t.dailyReport }}
        </v-btn>
        <v-btn
          color="bg-bg-inverse"
          :height="size['control-lg']"
          prepend-icon="far fa-file-lines"
          class="pf-type-label-lg"
          :to="{ name: 'admin-requests' }"
        >
          {{ t.goPending }}
        </v-btn>
      </template>
    </PageHeader>

    <div class="grid mb-4" :class="lgAndUp ? 'grid--4' : smAndUp ? 'grid--2' : ''">
      <KpiCard
        v-for="k in kpiCards"
        :key="k.key"
        :icon="k.icon"
        :tone="k.tone"
        :label="k.label"
        :value="k.value"
        :caption="k.caption"
        :trend="k.trend"
      />
    </div>

    <div class="grid align-start" :class="{ 'grid--aside': lgAndUp }">
      <div class="d-flex flex-column ga-4 min-w-0">
        <SectionCard :title="t.chart.title">
          <BarChart :labels="dailyChart.labels" :series="series" :max="dailyChart.max" />
        </SectionCard>

        <SectionCard :title="t.pendingTable.title" flush>
          <template #header>
            <StatusBadge tone="neutral">{{ t.pendingTable.sort }}</StatusBadge>
          </template>
          <template #actions>
            <v-btn
              :to="{ name: 'admin-requests' }"
              variant="text"
              color="text-text-link"
              append-icon="fas fa-chevron-right"
              class="pf-type-label-md px-2"
            >
              {{ common.actions.viewAll }}
            </v-btn>
          </template>
          <div class="table-scroll">
            <AppDataTable
              :headers="headers"
              :items="pending"
              item-value="ref"
              :paginate="false"
              class="pending-table"
              @click:row="openRequest"
            >
              <template #item.ref="{ item }">
                <router-link
                  :to="{ name: 'admin-request-review', params: { ref: item.ref } }"
                  class="pf-type-body-sm-strong text-text-link text-decoration-none"
                  @click.stop
                >
                  {{ item.ref }}
                </router-link>
              </template>
              <template #item.company="{ item }">
                <span class="text-no-wrap">{{ item.company }}</span>
              </template>
              <template #item.items="{ item }">
                <span class="pf-type-body-sm-strong">{{ formatNumber(item.items) }}</span>
              </template>
              <template #item.submittedAt="{ item }">
                <StatusBadge v-if="item.long" tone="warning" dot>
                  {{ t.pendingTable.waited(item.time, item.waitedHours) }}
                </StatusBadge>
                <span v-else>{{ item.time }}</span>
              </template>
            </AppDataTable>
          </div>
        </SectionCard>
      </div>

      <div class="d-flex flex-column ga-4 min-w-0">
        <SectionCard :title="t.todayStatus.title">
          <StatusSummaryList :items="statusItems" />
        </SectionCard>
        <SectionCard :title="t.systems.title" flush>
          <SystemStatusList :items="systemItems" class="py-2" />
        </SectionCard>
        <AlertBox tone="warning" :title="t.pki.title(pkiExpiring.count)">
          {{ t.pki.body(pkiExpiring.daysLeft) }}
        </AlertBox>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--pf-space-16);
  grid-template-columns: minmax(0, 1fr);
}
.grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid--aside {
  grid-template-columns: minmax(0, 1fr) calc(var(--pf-space-120) * 3);
}
.report-btn {
  border-color: rgb(var(--v-theme-border-default));
}
.table-scroll {
  overflow-x: auto;
}
.pending-table :deep(tbody tr) {
  cursor: pointer;
}
</style>
