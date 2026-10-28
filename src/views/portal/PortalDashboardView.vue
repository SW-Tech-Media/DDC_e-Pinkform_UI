<script setup>
// D02 · Portal / Dashboard – Monthly — Figma 26:6812
// สลับ รายเดือน / รายปี (รายไตรมาส) / ย้อนหลัง 5 ปี · เลือกปี · เลือกประเภทสินค้า → ข้อมูลกราฟและ KPI เปลี่ยนตาม mock
import { computed, ref } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import KpiCard from "@/components/KpiCard.vue";
import BarChart from "@/components/BarChart.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import SegmentedControl from "@/components/portal/SegmentedControl.vue";
import RankingList from "@/components/portal/RankingList.vue";
import DonutChart from "@/components/portal/DonutChart.vue";
import { dashboardText as t, rangeOptions } from "@/content/portal.js";
import {
  countryRanking,
  dashboardUpdatedAt,
  dashboardYears,
  fiveYearSummary,
  monthLabels,
  monthlyStats,
  outbreakFiveYears,
  productRanking,
  quarterLabels,
  yearSummary,
  yearlyTotals,
} from "@/mocks/portal.js";
import { formatNumber, formatThaiDate, formatTime } from "@/utils/format.js";

const range = ref("monthly");
const year = ref(dashboardYears[0]);
const product = ref(null);
const downloaded = ref(false);

const yearItems = dashboardYears.map((y) => ({ title: t.filter.year(y), value: y }));
const productItems = [{ title: t.filter.allProducts, value: null }, ...productRanking.map((p) => ({ title: p.name, value: p.name }))];

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const totalCerts = sum(productRanking.map((p) => p.value));
// สัดส่วนของสินค้าที่เลือก (ทุกประเภท = 1)
const share = computed(() => (product.value ? productRanking.find((p) => p.name === product.value).value / totalCerts : 1));
const scale = (arr) => arr.map((v) => Math.round(v * share.value));

// ข้อมูลกราฟตามช่วงข้อมูล
const chart = computed(() => {
  if (range.value === "fiveYears") {
    return {
      labels: yearlyTotals.map((x) => String(x.year)),
      requests: scale(yearlyTotals.map((x) => x.requests)),
      certificates: scale(yearlyTotals.map((x) => x.certificates)),
    };
  }
  const m = monthlyStats[year.value];
  if (range.value === "yearly") {
    const q = (arr) => [0, 1, 2, 3].map((i) => sum(arr.slice(i * 3, i * 3 + 3)));
    return { labels: quarterLabels, requests: scale(q(m.requests)), certificates: scale(q(m.certificates)) };
  }
  return {
    labels: monthLabels.slice(0, m.requests.length),
    requests: scale(m.requests),
    certificates: scale(m.certificates),
  };
});
const series = computed(() => [
  { name: t.requestsChart.requests, color: "chart-series-1", data: chart.value.requests },
  { name: t.requestsChart.certificates, color: "chart-series-2", data: chart.value.certificates },
]);
// สเกลแกนให้เป็นเลขกลม 4 ช่อง
const chartMax = computed(() => {
  const n = Math.max(1, ...chart.value.requests) / 4;
  const mag = 10 ** Math.floor(Math.log10(n));
  const nice = [1, 2, 5, 10].find((x) => n / mag <= x);
  return nice * mag * 4;
});
const chartTitle = computed(() => t.requestsChart.title[range.value](year.value));

// KPI
const summary = computed(() => (range.value === "fiveYears" ? fiveYearSummary : yearSummary[year.value]));
const totals = computed(() => ({ requests: sum(chart.value.requests), certificates: sum(chart.value.certificates) }));
const kpis = computed(() => {
  const k = t.kpi;
  const s = summary.value;
  const pct = totals.value.requests ? ((totals.value.certificates / totals.value.requests) * 100).toFixed(1) : "0";
  return [
    {
      ...k.requests,
      value: formatNumber(totals.value.requests),
      trend: { direction: s.trend < 0 ? "down" : "up", value: `${Math.abs(s.trend)}%`, text: k.requests.trendText },
    },
    { ...k.certificates, value: formatNumber(totals.value.certificates), caption: k.certificates.caption(pct) },
    { ...k.operators, value: formatNumber(s.direct + s.agent), caption: k.operators.caption(formatNumber(s.direct)) },
    { ...k.countries, value: formatNumber(s.countries) },
  ];
});

// อันดับประเทศ ปรับตามช่วงข้อมูล/สินค้า (สัดส่วนจากยอดใบรับรองฯ)
const countries = computed(() => {
  const f = totals.value.certificates / sum(monthlyStats[2569].certificates);
  return countryRanking.map((c) => ({ ...c, value: Math.round(c.value * f) }));
});
const products = computed(() => {
  const f = (range.value === "fiveYears" ? sum(yearlyTotals.map((x) => x.certificates)) : sum(monthlyStats[year.value].certificates)) /
    sum(monthlyStats[2569].certificates);
  return productRanking.map((p) => ({ ...p, value: Math.round(p.value * f) }));
});
const operators = computed(() => [
  { label: t.operators.direct, value: summary.value.direct, color: "chart-series-1" },
  { label: t.operators.agent, value: summary.value.agent, color: "chart-series-2" },
]);
const outbreakSeries = [{ name: t.outbreak.series, color: "chart-series-3", data: outbreakFiveYears.map((x) => x.value) }];
const outbreakLabels = outbreakFiveYears.map((x) => String(x.year));

const updated = `${formatThaiDate(dashboardUpdatedAt)} ${formatTime(dashboardUpdatedAt)}`;
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.title" :description="t.description(updated)" :breadcrumb="t.breadcrumb" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <!-- ตัวกรอง -->
      <v-card class="pf-bordered pf-elevation-card px-6 py-4">
        <div class="d-flex flex-wrap align-center ga-4">
          <div class="d-flex flex-wrap align-center ga-3">
            <span class="pf-type-label-md text-text-primary">{{ t.filter.range }}</span>
            <SegmentedControl v-model="range" :options="rangeOptions" :label="t.filter.range" />
          </div>
          <v-select
            v-model="year"
            :items="yearItems"
            :disabled="range === 'fiveYears'"
            density="compact"
            hide-details
            class="filter-select"
            :aria-label="t.filter.year('')"
          />
          <v-select
            v-model="product"
            :items="productItems"
            density="compact"
            hide-details
            class="filter-select"
            :aria-label="t.filter.allProducts"
          />
          <v-spacer class="d-none d-md-block" />
          <v-btn variant="outlined" class="outline-btn text-text-primary" prepend-icon="fas fa-download" @click="downloaded = true">
            {{ t.filter.download }}
          </v-btn>
        </div>
      </v-card>

      <!-- KPI -->
      <v-row class="mt-4">
        <v-col v-for="k in kpis" :key="k.label" cols="12" sm="6" lg="3">
          <KpiCard v-bind="k" />
        </v-col>
      </v-row>

      <!-- กราฟคำขอ + อันดับประเทศ -->
      <v-row class="mt-2">
        <v-col cols="12" lg="8">
          <SectionCard :title="chartTitle" class="h-100">
            <BarChart :labels="chart.labels" :series="series" :max="chartMax" />
          </SectionCard>
        </v-col>
        <v-col cols="12" lg="4">
          <SectionCard :title="t.countries.title" class="h-100">
            <RankingList :items="countries" />
          </SectionCard>
        </v-col>
      </v-row>

      <!-- สินค้า · ผู้ประกอบการ · พื้นที่โรคระบาด -->
      <v-row class="mt-2">
        <v-col cols="12" md="6" lg="4">
          <SectionCard :title="t.products.title" class="h-100">
            <template #header>
              <StatusBadge tone="neutral">{{ t.products.chip }}</StatusBadge>
            </template>
            <RankingList :items="products" color="chart-series-3" :highlight="product || ''" />
          </SectionCard>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <SectionCard :title="t.operators.title" class="h-100">
            <DonutChart :segments="operators" :unit="t.operators.unit" />
          </SectionCard>
        </v-col>
        <v-col cols="12" lg="4">
          <SectionCard :title="t.outbreak.title" class="h-100">
            <template #actions>
              <v-btn variant="text" class="text-text-link" size="small" :to="t.outbreak.to">{{ t.outbreak.more }}</v-btn>
            </template>
            <BarChart :labels="outbreakLabels" :series="outbreakSeries" :max="40" :axis-label="t.outbreak.axis" />
          </SectionCard>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="downloaded" color="primary" :timeout="2500">
      <v-icon icon="fas fa-circle-check" start />
      {{ t.filter.downloaded }}
    </v-snackbar>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.filter-select {
  flex: 0 1 calc(var(--pf-space-120) * 2);
  min-width: calc(var(--pf-space-120) + var(--pf-space-40));
}
.outline-btn {
  border-color: rgb(var(--v-theme-border-strong));
}
</style>
