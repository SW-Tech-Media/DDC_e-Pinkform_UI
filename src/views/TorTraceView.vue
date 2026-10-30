<script setup>
// หน้าเทียบ TOR กับหน้าจอ Prototype — ข้อมูลสร้างจาก docs/Traceability_TOR_Flow_Prototype.md (npm run tor-trace)
// รหัสหน้าจอ (P-xx / B-xx) จับคู่กับ route ผ่าน router/screens.js
import { computed, ref } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import KpiCard from "@/components/KpiCard.vue";
import AlertBox from "@/components/AlertBox.vue";
import SectionCard from "@/components/SectionCard.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import EmptyState from "@/components/EmptyState.vue";
import { screens } from "@/router/screens.js";
import { torTrace, torTraceSource } from "@/mocks/tor-trace.js";
import { torTraceText as t } from "@/content/tor-trace.js";

// B-08 (ยกเลิกการอนุมัติ) อยู่ในหน้า B-06 · P-04 มี 2 route ใช้หน้ารายการข่าว
const CODE_ALIASES = { "B-08": "B-06" };
const screenByCode = {};
for (const x of screens) {
  for (const code of x.code.split(" / ")) screenByCode[code] ??= x;
}
const screenOf = (code) => screenByCode[CODE_ALIASES[code] ?? code];
const target = (x) => ({ name: x.name, params: x.example ?? {} });

const mode = ref("tor");
const search = ref("");
const kind = ref("all");
const status = ref(null);
const screenCode = ref(null);

const statusOptions = Object.entries(t.statuses)
  .filter(([key]) => torTrace.some((x) => x.status === key))
  .map(([value, s]) => ({ value, title: s.label }));
const screenOptions = screens.map((x) => ({ value: x.code, title: `${x.code} ${x.title}` }));

const counts = computed(() => {
  const c = { total: torTrace.length, done: 0, partial: 0, missing: 0, na: 0 };
  for (const x of torTrace) c[x.status] += 1;
  return c;
});
const coverage = computed(() => {
  const shown = counts.value.total - counts.value.na;
  return shown ? Math.round((counts.value.done / shown) * 100) : 0;
});

const matchesScreen = (item, code) => item.codes.some((c) => screenOf(c) === screenOf(code.split(" / ")[0]));
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return torTrace.filter(
    (x) =>
      (kind.value === "all" || x.kind === kind.value) &&
      (!status.value || x.status === status.value) &&
      (!screenCode.value || matchesScreen(x, screenCode.value)) &&
      (!q || [x.id, x.tor, x.requirement, x.note, x.screenText].some((v) => v.toLowerCase().includes(q)))
  );
});

const headers = [
  { title: t.headers.id, key: "id", width: 80 },
  { title: t.headers.tor, key: "tor", width: 100 },
  { title: t.headers.requirement, key: "requirement", sortable: false },
  { title: t.headers.screens, key: "codes", sortable: false, width: 260 },
  { title: t.headers.status, key: "status", width: 100 },
  { title: t.headers.note, key: "note", sortable: false },
];
const shortHeaders = headers.filter((h) => h.key !== "codes");

// มุมมองตามหน้าจอ — หน้าจอเรียงตาม router/screens.js ตามด้วยข้อที่ไม่ผูกกับหน้าจอ
const byScreen = computed(() => {
  const groups = screens
    .filter((x) => !screenCode.value || x.code === screenCode.value)
    .map((x) => ({
      key: x.name,
      code: x.code,
      title: x.title,
      path: x.path,
      to: target(x),
      items: filtered.value.filter((item) => item.codes.some((c) => screenOf(c) === x)),
    }))
    .filter((g) => g.items.length);
  const unmapped = screenCode.value ? [] : filtered.value.filter((item) => !item.codes.some(screenOf));
  if (unmapped.length) groups.push({ key: "unmapped", code: "—", title: t.unmapped, path: t.unmappedPath, items: unmapped });
  return groups;
});
const statusCounts = (items) =>
  Object.keys(t.statuses)
    .map((key) => ({ key, n: items.filter((x) => x.status === key).length }))
    .filter((s) => s.n);
</script>

<template>
  <PortalLayout>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="[{ title: t.home, to: { name: 'home' } }, { title: t.title }]" />
    <div class="pf-container px-4 px-md-6 py-10 d-flex flex-column ga-6">
      <v-row>
        <v-col v-for="key in ['total', 'done', 'partial', 'na']" :key="key" cols="12" sm="6" lg="3">
          <KpiCard
            v-bind="t.kpis[key]"
            :value="counts[key]"
            :caption="key === 'done' ? t.coverage(coverage) : ''"
          />
        </v-col>
      </v-row>

      <AlertBox tone="info">{{ t.source(torTraceSource.file, torTraceSource.version, torTraceSource.date) }}</AlertBox>

      <v-card class="pf-bordered pa-5">
        <v-row dense align="end">
          <v-col cols="12" md="auto">
            <FieldLabel :label="t.modeLabel" />
            <SegmentedControl v-model="mode" :options="t.modes" :label="t.modeLabel" />
          </v-col>
          <v-col cols="12" sm="6" md>
            <FieldLabel :label="t.filters.search.label" for="tt-search" />
            <v-text-field id="tt-search" v-model="search" :placeholder="t.filters.search.placeholder" prepend-inner-icon="fas fa-magnifying-glass" clearable hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <FieldLabel :label="t.filters.kind.label" for="tt-kind" />
            <v-select id="tt-kind" v-model="kind" :items="t.kinds" hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <FieldLabel :label="t.filters.status.label" for="tt-status" />
            <v-select id="tt-status" v-model="status" :items="statusOptions" :placeholder="t.allStatuses" clearable hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <FieldLabel :label="t.filters.screen.label" for="tt-screen" />
            <v-autocomplete id="tt-screen" v-model="screenCode" :items="screenOptions" :placeholder="t.filters.screen.placeholder" clearable hide-details />
          </v-col>
        </v-row>
      </v-card>

      <SectionCard v-if="!filtered.length" flush>
        <EmptyState v-bind="t.empty" />
      </SectionCard>

      <SectionCard v-else-if="mode === 'tor'" flush>
        <AppDataTable :headers="headers" :items="filtered" :per-page="20">
          <template #item.id="{ item }">
            <span class="pf-type-body-sm-strong text-no-wrap">{{ item.id }}</span>
          </template>
          <template #item.tor="{ item }">
            <span class="text-no-wrap">{{ item.tor }}</span>
          </template>
          <template #item.requirement="{ item }">
            <div class="py-3">
              <div>{{ item.requirement }}</div>
              <div class="pf-type-caption text-text-tertiary mt-1">{{ item.section }}</div>
            </div>
          </template>
          <template #item.codes="{ item }">
            <div class="d-flex flex-column ga-1 py-3">
              <router-link
                v-for="code in item.codes.filter(screenOf)"
                :key="code"
                :to="target(screenOf(code))"
                class="screen-link"
                :title="t.open"
              >
                <span class="pf-type-caption-strong text-text-link">{{ code }}</span>
                <span class="pf-type-caption text-text-tertiary ms-1">{{ screenOf(code).path }}</span>
              </router-link>
              <span v-if="!item.codes.some(screenOf)" class="pf-type-caption text-text-tertiary">
                {{ item.screenText || t.noScreen }}
              </span>
            </div>
          </template>
          <template #item.status="{ item }">
            <StatusBadge :tone="t.statuses[item.status].tone">{{ t.statuses[item.status].label }}</StatusBadge>
          </template>
          <template #item.note="{ item }">
            <div class="pf-type-caption text-text-secondary py-3 note">{{ item.note }}</div>
          </template>
        </AppDataTable>
      </SectionCard>

      <v-expansion-panels v-else multiple variant="accordion" class="pf-bordered rounded-lg">
        <v-expansion-panel v-for="g in byScreen" :key="g.key" elevation="0">
          <v-expansion-panel-title>
            <div class="d-flex align-center flex-wrap ga-3 w-100 pe-4">
              <span class="code pf-type-label-sm text-text-tertiary">{{ g.code }}</span>
              <div class="flex-grow-1 min-w-0">
                <div class="pf-type-body-md-strong text-text-primary">{{ g.title }}</div>
                <div class="pf-type-caption text-text-tertiary">{{ g.path }}</div>
              </div>
              <div class="d-flex align-center flex-wrap ga-2">
                <StatusBadge v-for="s in statusCounts(g.items)" :key="s.key" :tone="t.statuses[s.key].tone">
                  {{ t.statuses[s.key].label }} {{ s.n }}
                </StatusBadge>
                <v-btn v-if="g.to" :to="g.to" size="small" variant="text" color="primary" append-icon="fas fa-arrow-right" @click.stop>
                  {{ t.open }}
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <AppDataTable :headers="shortHeaders" :items="g.items" :paginate="false">
              <template #item.id="{ item }">
                <span class="pf-type-body-sm-strong text-no-wrap">{{ item.id }}</span>
              </template>
              <template #item.tor="{ item }">
                <span class="text-no-wrap">{{ item.tor }}</span>
              </template>
              <template #item.requirement="{ item }">
                <div class="py-3">{{ item.requirement }}</div>
              </template>
              <template #item.status="{ item }">
                <StatusBadge :tone="t.statuses[item.status].tone">{{ t.statuses[item.status].label }}</StatusBadge>
              </template>
              <template #item.note="{ item }">
                <div class="pf-type-caption text-text-secondary py-3 note">{{ item.note }}</div>
              </template>
            </AppDataTable>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </PortalLayout>
</template>

<style scoped>
.code {
  min-width: var(--pf-space-64);
}
.screen-link {
  text-decoration: none;
  white-space: nowrap;
}
.screen-link:hover .text-text-link {
  text-decoration: underline;
}
.note {
  min-width: calc(var(--pf-space-120) * 2);
}
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
</style>
