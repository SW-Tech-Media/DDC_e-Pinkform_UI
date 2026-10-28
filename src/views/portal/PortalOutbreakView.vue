<script setup>
// D03 · Portal / Outbreak Check – Result Found (มือถือ S02) — Figma 26:7464 · 27:218
// เลือก จังหวัด → อำเภอ → ตำบล แล้วกด "ตรวจสอบ" → แสดงผล พบ / ไม่พบ ในพื้นที่โรคระบาด จาก mock
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import BarChart from "@/components/BarChart.vue";
import SegmentedControl from "@/components/portal/SegmentedControl.vue";
import OutbreakResult from "@/components/portal/OutbreakResult.vue";
import OutbreakAreaList from "@/components/portal/OutbreakAreaList.vue";
import { outbreakText as t, rangeOptions } from "@/content/portal.js";
import {
  areas,
  monthLabels,
  outbreakAsOf,
  outbreakDefault,
  outbreakFiveYears,
  outbreakFreeDays,
  outbreakMonthly,
  quarterLabels,
} from "@/mocks/portal.js";
import { formatDate } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const { smAndDown } = useDisplay();

const DAY = 24 * 60 * 60 * 1000;
const asOf = new Date(`${outbreakAsOf}T00:00:00`);
const addDays = (iso, n) => new Date(new Date(`${iso}T00:00:00`).getTime() + n * DAY);
const daysLeft = (date) => Math.ceil((date - asOf) / DAY);

// ---------- ค้นหาแบบต่อเนื่อง ----------
const province = ref(outbreakDefault.province);
const district = ref(outbreakDefault.district);
const subdistrict = ref(outbreakDefault.subdistrict);

const provinceItems = areas.map((p) => p.name);
const districtItems = computed(() => areas.find((p) => p.name === province.value)?.districts ?? []);
const subdistrictItems = computed(() => districtItems.value.find((d) => d.name === district.value)?.subdistricts ?? []);

function onProvince() {
  district.value = null;
  subdistrict.value = null;
  result.value = null;
}
function onDistrict() {
  subdistrict.value = null;
  result.value = null;
}

function evaluate() {
  const sub = subdistrictItems.value.find((s) => s.name === subdistrict.value);
  if (!sub) return null;
  const place = t.place(sub.name, district.value, province.value);
  if (!sub.outbreak) return { found: false, place };
  const free = addDays(sub.outbreak, outbreakFreeDays);
  const days = daysLeft(free);
  if (days <= 0) return { found: false, place };
  return { found: true, place, reported: formatDate(sub.outbreak), free: formatDate(free), days };
}
const result = ref(evaluate());
const canCheck = computed(() => Boolean(province.value && district.value && subdistrict.value));
function check() {
  result.value = evaluate();
}

// ---------- พื้นที่ที่ยังไม่ปลอดโรค ----------
const activeAreas = areas
  .flatMap((p) =>
    p.districts.flatMap((d) =>
      d.subdistricts
        .filter((s) => s.outbreak)
        .map((s) => ({ province: p.name, district: d.name, subdistrict: s.name, outbreak: s.outbreak }))
    )
  )
  .map((a) => {
    const free = addDays(a.outbreak, outbreakFreeDays);
    return { ...a, reportedAt: formatDate(a.outbreak), freeAt: formatDate(free), days: daysLeft(free) };
  })
  .filter((a) => a.days > 0)
  .map((a, i) => ({ ...a, id: `${a.province}-${a.subdistrict}`, no: i + 1 }));

// ---------- สถิติ ----------
const range = ref("monthly");
const years = Object.keys(outbreakMonthly).map(Number).sort((a, b) => b - a);
const chart = computed(() => {
  if (range.value === "fiveYears") {
    return {
      labels: outbreakFiveYears.map((x) => String(x.year)),
      series: [{ name: t.stats.total, color: "chart-series-3", data: outbreakFiveYears.map((x) => x.value) }],
    };
  }
  const quarter = (arr) => [0, 1, 2, 3].map((i) => arr.slice(i * 3, i * 3 + 3).reduce((a, b) => a + b, 0));
  const pick = (y) => (range.value === "yearly" ? quarter(outbreakMonthly[y]) : outbreakMonthly[y]);
  return {
    labels: range.value === "yearly" ? quarterLabels : monthLabels,
    series: years.map((y, i) => ({ name: t.stats.year(y), color: i === 0 ? "chart-series-3" : "chart-series-muted", data: pick(y) })),
  };
});
const chartMax = computed(() => {
  const n = Math.max(1, ...chart.value.series.flatMap((s) => s.data)) / 4;
  const mag = 10 ** Math.floor(Math.log10(n));
  return Math.max(8, [1, 2, 5, 10].find((x) => n / mag <= x) * mag * 4);
});
</script>

<template>
  <PortalLayout portal>
    <PageHero v-if="!smAndDown" :title="t.title" :description="t.description" :breadcrumb="t.breadcrumb" overlap />
    <div v-else class="pf-container px-4 pt-4">
      <v-breadcrumbs :items="t.breadcrumb" class="pa-0 pf-type-caption text-text-secondary">
        <template #divider>/</template>
      </v-breadcrumbs>
      <h1 class="pf-type-h3 text-text-primary mt-2">{{ t.titleMobile }}</h1>
    </div>

    <div class="pf-container px-4 px-md-6 pb-14" :class="smAndDown ? 'pt-4' : 'content'">
      <!-- ค้นหา + ผลลัพธ์ -->
      <v-card :class="smAndDown ? 'bg-transparent overflow-visible' : 'pf-bordered pf-elevation-card pa-6'">
        <v-form @submit.prevent="check">
          <v-row :dense="smAndDown">
            <v-col cols="12" md>
              <FieldLabel :label="t.form.province" for="ob-province" />
              <v-select
                id="ob-province"
                v-model="province"
                :items="provinceItems"
                :placeholder="t.form.provincePlaceholder"
                prepend-inner-icon="fas fa-location-dot"
                density="comfortable"
                hide-details
                @update:model-value="onProvince"
              />
            </v-col>
            <v-col cols="12" md>
              <FieldLabel :label="t.form.district" for="ob-district" />
              <v-select
                id="ob-district"
                v-model="district"
                :items="districtItems"
                item-title="name"
                item-value="name"
                :placeholder="t.form.districtPlaceholder"
                :disabled="!province"
                density="comfortable"
                hide-details
                @update:model-value="onDistrict"
              />
            </v-col>
            <v-col cols="12" md>
              <FieldLabel :label="t.form.subdistrict" for="ob-subdistrict" />
              <v-select
                id="ob-subdistrict"
                v-model="subdistrict"
                :items="subdistrictItems"
                item-title="name"
                item-value="name"
                :placeholder="t.form.subdistrictPlaceholder"
                :disabled="!district"
                density="comfortable"
                hide-details
                @update:model-value="result = null"
              />
            </v-col>
            <v-col cols="12" md="auto" class="d-flex align-end" :class="smAndDown ? 'mt-3' : ''">
              <v-btn
                type="submit"
                variant="flat"
                class="bg-bg-inverse px-6"
                prepend-icon="fas fa-magnifying-glass"
                :height="size['control-lg']"
                :block="smAndDown"
                :disabled="!canCheck"
              >
                {{ t.form.submit }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <div class="mt-6">
          <OutbreakResult v-if="result" :result="result" :text="t" :free-days="outbreakFreeDays" :compact="smAndDown" />
          <p v-else class="pf-type-body-sm text-text-tertiary">{{ t.form.hint }}</p>
        </div>
      </v-card>

      <!-- มือถือ: รายการพื้นที่ -->
      <section v-if="smAndDown" class="mt-8">
        <h2 class="pf-type-h4 text-text-primary">{{ t.table.titleMobile(activeAreas.length) }}</h2>
        <OutbreakAreaList :items="activeAreas" :text="t.table" class="mt-2" />
      </section>

      <!-- เดสก์ท็อป: ตาราง + สถิติ -->
      <v-row v-else class="mt-4">
        <v-col cols="12" lg="7">
          <SectionCard :title="t.table.title" flush class="h-100">
            <template #header>
              <StatusBadge tone="danger" dot>{{ t.table.count(activeAreas.length) }}</StatusBadge>
            </template>
            <AppDataTable :headers="t.table.headers" :items="activeAreas" :paginate="false" :hover="false" class="area-table">
              <template #item.freeAt="{ item }">
                <span class="pf-type-body-sm-strong">{{ item.freeAt }}</span>
              </template>
              <template #item.status="{ item }">
                <StatusBadge tone="danger" dot>{{ t.table.remaining(item.days) }}</StatusBadge>
              </template>
            </AppDataTable>
            <template #footer>
              <p class="pf-type-caption text-text-tertiary">{{ t.table.note }}</p>
            </template>
          </SectionCard>
        </v-col>
        <v-col cols="12" lg="5">
          <SectionCard :title="t.stats.title" class="h-100">
            <template #actions>
              <SegmentedControl v-model="range" :options="rangeOptions" :label="t.stats.title" />
            </template>
            <BarChart :labels="chart.labels" :series="chart.series" :max="chartMax" />
          </SectionCard>
        </v-col>
      </v-row>
    </div>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.area-table :deep(th),
.area-table :deep(td) {
  padding-inline: var(--pf-space-10) !important;
  white-space: nowrap;
}
.area-table :deep(th:first-child),
.area-table :deep(td:first-child) {
  padding-inline-start: var(--pf-space-24) !important;
}
.area-table :deep(th:last-child),
.area-table :deep(td:last-child) {
  padding-inline-end: var(--pf-space-24) !important;
}
</style>
