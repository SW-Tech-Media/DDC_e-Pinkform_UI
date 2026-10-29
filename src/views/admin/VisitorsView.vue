<script setup>
// B-20 · รายงานผู้เข้าชมเว็บไซต์ — TOR 4.1.13 (Figma ยังไม่มี — ออกแบบตามสไตล์ D03/D13)
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import SectionCard from "@/components/SectionCard.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import BarChart from "@/components/BarChart.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AlertBox from "@/components/AlertBox.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import DeviceShare from "@/components/visitors/DeviceShare.vue";
import { downloadCsv } from "@/utils/csv.js";
import { visitorsText as t } from "@/content/visitors.js";
import { dailyVisits, deviceShare, monthlyVisits, topPages, visitorTotals, visitorsNow } from "@/mocks/visitors.js";
import { formatDate, formatDateTime, formatNumber, formatShortThaiDate } from "@/utils/format.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("thanakorn");

const sum = (list) => list.reduce((a, b) => a + b, 0);
const dayIso = (i) => `${dailyVisits.month}-${String(i + 1).padStart(2, "0")}`;
const monthName = (m) => formatShortThaiDate(`${m}-01`).split(" ")[1]; // "1 ต.ค. 2569" → "ต.ค."

// ---------- KPI ----------
const days = dailyVisits.visits.length;
const monthTotal = sum(dailyVisits.visits);
const average = Math.round(monthTotal / days);
const prevMonth = monthlyVisits.visits.at(-2);
const prevDays = new Date(Number(monthlyVisits.months.at(-2).slice(0, 4)), Number(monthlyVisits.months.at(-2).slice(5, 7)), 0).getDate();
const change = ((average - prevMonth / prevDays) / (prevMonth / prevDays)) * 100;

const kpis = [
  { icon: "fas fa-users", tone: "teal", label: t.kpi.total.label, value: formatNumber(visitorTotals.total), caption: t.kpi.total.caption },
  { icon: "far fa-eye", tone: "pink", label: t.kpi.today.label, value: formatNumber(visitorTotals.today), caption: t.kpi.today.caption(formatDateTime(visitorsNow)) },
  {
    icon: "far fa-calendar",
    tone: "blue",
    label: t.kpi.month.label,
    value: formatNumber(monthTotal),
    caption: t.kpi.month.caption(formatDate(dayIso(0)), formatDate(dayIso(days - 1))),
  },
  {
    icon: "fas fa-chart-line",
    tone: "green",
    label: t.kpi.average.label,
    value: formatNumber(average),
    trend: { direction: change < 0 ? "down" : "up", value: `${Math.abs(change).toFixed(1)}%`, text: t.kpi.trendText },
  },
];

// ---------- กราฟ (รายวัน = 14 วันล่าสุด / รายเดือน = 12 เดือนย้อนหลัง) ----------
const mode = ref("daily");
const DAILY_WINDOW = 14;
const chart = computed(() => {
  if (mode.value === "daily") {
    const from = days - DAILY_WINDOW;
    return {
      labels: dailyVisits.visits.slice(from).map((_, i) => String(from + i + 1)),
      visits: dailyVisits.visits.slice(from),
      unique: dailyVisits.unique.slice(from),
      subtitle: t.chart.dailySubtitle(formatShortThaiDate(dayIso(from)), formatShortThaiDate(dayIso(days - 1))),
      axis: t.chart.dailyAxis,
    };
  }
  const m = monthlyVisits.months;
  const range = (x) => formatShortThaiDate(`${x}-01`).split(" ").slice(1).join(" ");
  return {
    labels: m.map(monthName),
    visits: monthlyVisits.visits,
    unique: monthlyVisits.unique,
    subtitle: t.chart.monthlySubtitle(range(m[0]), range(m.at(-1))),
    axis: "",
  };
});
const series = computed(() => [
  { name: t.chart.visits, color: "chart-series-1", data: chart.value.visits },
  { name: t.chart.unique, color: "chart-series-2", data: chart.value.unique },
]);

// ---------- หน้าที่เข้าชมมากที่สุด / อุปกรณ์ ----------
const pageTotal = sum(topPages.map((p) => p.views));
const pages = topPages.map((p, i) => ({ ...p, rank: i + 1, share: Math.round((p.views / pageTotal) * 1000) / 10 }));
const devices = deviceShare.map((d) => ({
  ...d,
  ...t.devices.items[d.key],
  visits: Math.round((monthTotal * d.share) / 100),
}));

// ---------- ส่งออก CSV (ตามมุมมองกราฟ) ----------
const snack = reactive({ show: false, text: "" });
const exportCsv = () => {
  const rows =
    mode.value === "daily"
      ? dailyVisits.visits.map((v, i) => [formatDate(dayIso(i)), v, dailyVisits.unique[i]])
      : monthlyVisits.months.map((m, i) => [formatShortThaiDate(`${m}-01`).split(" ").slice(1).join(" "), monthlyVisits.visits[i], monthlyVisits.unique[i]]);
  downloadCsv(t.csvFile(mode.value), t.csvHeaders(mode.value), rows);
  Object.assign(snack, { show: true, text: t.exported });
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-file-csv" @click="exportCsv">{{ t.exportCsv }}</SecondaryButton>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="k in kpis" :key="k.label" cols="12" sm="6" lg="3">
        <KpiCard v-bind="k" />
      </v-col>
    </v-row>

    <SectionCard :title="t.chart.title" :subtitle="chart.subtitle" class="mb-6">
      <template #actions>
        <SegmentedControl v-model="mode" :options="t.chart.modes" :label="t.chart.modeLabel" />
      </template>
      <div class="visitors__chart">
        <div class="visitors__chart-inner">
          <BarChart :labels="chart.labels" :series="series" :axis-label="chart.axis" />
        </div>
      </div>
    </SectionCard>

    <v-row>
      <v-col cols="12" lg="8">
        <SectionCard :title="t.pages.title" :subtitle="t.pages.subtitle" flush class="h-100">
          <AppDataTable :headers="t.pages.headers" :items="pages" :paginate="false" class="visitors__pages">
            <template #item.rank="{ item }">
              <span class="pf-type-body-sm-strong text-text-tertiary">{{ item.rank }}</span>
            </template>
            <template #item.title="{ item }">
              <div class="py-3 visitors__page">
                <div class="pf-type-body-sm-strong">{{ item.title }}</div>
                <div class="pf-type-caption text-text-link">{{ item.path }}</div>
              </div>
            </template>
            <template #item.views="{ item }">
              <span class="pf-type-body-sm-strong">{{ formatNumber(item.views) }}</span>
            </template>
            <template #item.share="{ item }">
              <div class="d-flex align-center ga-2 visitors__share">
                <v-progress-linear :model-value="(item.views / pages[0].views) * 100" color="chart-series-1" bg-color="chart-track" bg-opacity="1" rounded />
                <span class="pf-type-caption text-text-secondary">{{ item.share }}%</span>
              </div>
            </template>
            <template #item.avg="{ item }">
              <span class="text-no-wrap">{{ t.pages.duration(item.avgSeconds) }}</span>
            </template>
          </AppDataTable>
        </SectionCard>
      </v-col>
      <v-col cols="12" lg="4">
        <SectionCard :title="t.devices.title" :subtitle="t.devices.subtitle" class="h-100">
          <DeviceShare :items="devices" :visits-text="t.devices.visits" />
          <AlertBox tone="neutral" class="mt-6">{{ t.devices.note }}</AlertBox>
        </SectionCard>
      </v-col>
    </v-row>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.visitors__chart {
  overflow-x: auto;
}
.visitors__chart-inner {
  min-width: calc(var(--pf-space-120) * 3);
}
.visitors__pages :deep(th),
.visitors__pages :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.visitors__page {
  min-width: calc(var(--pf-space-120) + var(--pf-space-64));
}
.visitors__share {
  min-width: var(--pf-space-120);
}
</style>
