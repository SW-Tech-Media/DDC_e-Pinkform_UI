<script setup>
// B-13 · รายงานสรุป (TOR 4.4.6) — ยังไม่มีใน Figma ใช้สไตล์ D09 / D13
// เลือกประเภทรายงาน + ช่วงวันที่ → ตัวอย่างรายงาน (สรุปยอด + กราฟ + ตาราง) → ส่งออก Excel (จำลอง) / CSV (ดาวน์โหลดจริง)
// รายงานที่บันทึกไว้: เปิด / เพิ่ม / แก้ไข / ลบ · query ?type= สำหรับเปิดประเภทรายงาน
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import BarChart from "@/components/BarChart.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import IconTile from "@/components/IconTile.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ReportTypePicker from "@/components/reports/ReportTypePicker.vue";
import SavedReportList from "@/components/reports/SavedReportList.vue";
import SavedReportDialog from "@/components/reports/SavedReportDialog.vue";
import { downloadCsv } from "@/utils/csv.js";
import { reportsText as t } from "@/content/reports.js";
import { buildReport, chartBuckets, defaultReportRange, reportToday, savedReports } from "@/mocks/reports.js";
import { formatDate, formatDateTime, formatMoney, formatNumber, formatShortThaiDate, formatThaiDate } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const route = useRoute();
const { smAndDown } = useDisplay();

const typeOptions = Object.entries(t.types).map(([value, x]) => ({ value, ...x }));
const initialType = t.types[route.query.type] ? route.query.type : "fees";

// ---------- ตั้งค่ารายงาน (draft) → รายงานที่แสดง (applied) ----------
const draft = reactive({ type: initialType, range: [...defaultReportRange] });
const applied = ref({ type: initialType, range: [...defaultReportRange] });
const activeSavedId = ref(null);

const show = () => {
  const range = draft.range?.length ? [draft.range[0], draft.range[1] ?? draft.range[0]] : [...defaultReportRange];
  draft.range = range;
  applied.value = { type: draft.type, range: [...range] };
  activeSavedId.value = null;
};

const def = computed(() => t.types[applied.value.type]);
const rows = computed(() => buildReport(applied.value.type, applied.value.range));
const headers = computed(() => def.value.headers);

// ---------- จัดรูปแบบ ----------
const fmt = (value, format) => {
  if (format === "money") return formatMoney(value);
  if (format === "number") return formatNumber(value);
  if (format === "percent") return formatMoney(value);
  if (format === "date") return formatDate(value);
  if (format === "status") return t.statuses[value].label;
  return value;
};

const totals = computed(() =>
  def.value.totals.map((key) => {
    const h = headers.value.find((x) => x.key === key);
    const sum = rows.value.reduce((a, r) => a + r[key], 0);
    return { label: h.title, value: fmt(sum, h.format) };
  })
);

// ---------- กราฟ ----------
const seriesColors = ["chart-series-1", "chart-series-2", "chart-series-3"];
const chart = computed(() => {
  const c = def.value.chart;
  if (!c || !rows.value.length) return null;
  const keys = c.series.map((s) => s.key);
  let labels;
  let data;
  if (c.labelKey) {
    labels = rows.value.map((r) => r[c.labelKey]);
    data = keys.map((k) => rows.value.map((r) => r[k]));
  } else {
    const { monthly, buckets } = chartBuckets(rows.value, keys);
    const crossMonth = new Set(buckets.map((b) => b.bucket.slice(0, 7))).size > 1;
    labels = buckets.map(({ bucket }) => {
      if (monthly) return formatShortThaiDate(`${bucket}-01`).split(" ").slice(1).join(" ");
      const [, m, d] = bucket.split("-").map(Number);
      return crossMonth ? `${d}/${m}` : String(d);
    });
    data = keys.map((k) => buckets.map((b) => b.values[k]));
  }
  return {
    labels,
    series: c.series.map((s, i) => ({ name: s.name, color: seriesColors[i], data: data[i] })),
  };
});

// ---------- ส่งออก ----------
const fileName = computed(() => `report-${def.value.file}_${applied.value.range[0]}_${applied.value.range[1]}`);
const csvCell = (row, h) => {
  if (h.format === "date") return formatDate(row[h.key]);
  if (h.format === "status") return t.statuses[row[h.key]].label;
  if (h.format === "percent") return row[h.key].toFixed(2);
  return row[h.key];
};
const exportCsv = () => {
  downloadCsv(
    `${fileName.value}.csv`,
    headers.value.map((h) => h.title),
    rows.value.map((r) => headers.value.map((h) => csvCell(r, h)))
  );
  notify(t.actions.csvDone(fileName.value));
};
const exportExcel = () => notify(t.actions.excelDone(fileName.value));

// ---------- รายงานที่บันทึกไว้ ----------
const saved = ref(savedReports.map((r) => ({ ...r, range: [...r.range] })));
const nowIso = () => `${reportToday}T${new Date().toTimeString().slice(0, 8)}`;

const openSaved = (r) => {
  Object.assign(draft, { type: r.type, range: [...r.range] });
  applied.value = { type: r.type, range: [...r.range] };
  activeSavedId.value = r.id;
  notify(t.saved.loaded(r.name));
};

const form = reactive({ open: false, mode: "add", report: null, id: null });
const addSaved = () =>
  Object.assign(form, { open: true, mode: "add", id: null, report: { name: "", type: applied.value.type, range: [...applied.value.range] } });
const editSaved = (r) => Object.assign(form, { open: true, mode: "edit", id: r.id, report: r });
const onSave = (data) => {
  if (form.mode === "edit") {
    const r = saved.value.find((x) => x.id === form.id);
    Object.assign(r, data, { updatedAt: nowIso() });
    if (activeSavedId.value === r.id) openSaved(r);
    notify(t.saved.edited(data.name));
    return;
  }
  const id = Math.max(0, ...saved.value.map((x) => x.id)) + 1;
  saved.value.unshift({ id, ...data, updatedAt: nowIso() });
  activeSavedId.value = id;
  notify(t.saved.added(data.name));
};

const removing = reactive({ open: false, report: null });
const askDelete = (r) => Object.assign(removing, { open: true, report: r });
const confirmDelete = () => {
  const r = removing.report;
  saved.value = saved.value.filter((x) => x.id !== r.id);
  if (activeSavedId.value === r.id) activeSavedId.value = null;
  notify(t.saved.deleted(r.name));
};

// ---------- snackbar ----------
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="far fa-bookmark" @click="addSaved">{{ t.actions.save }}</SecondaryButton>
        <SecondaryButton icon="fas fa-file-csv" :disabled="!rows.length" @click="exportCsv">{{ t.actions.csv }}</SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-file-excel" :height="size['control-lg']" :disabled="!rows.length" @click="exportExcel">
          {{ t.actions.excel }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row>
      <v-col cols="12" lg="4" class="d-flex flex-column ga-6">
        <SectionCard :title="t.settings.title">
          <v-form @submit.prevent="show">
            <FieldLabel :label="t.settings.type" />
            <ReportTypePicker v-model="draft.type" :options="typeOptions" :label="t.settings.type" class="mb-5" />
            <FieldLabel :label="t.settings.range" for="rp-range" />
            <DateField id="rp-range" v-model="draft.range" range :placeholder="t.settings.rangePlaceholder" class="mb-5" />
            <v-btn type="submit" color="primary" block prepend-icon="fas fa-chart-column" :height="size['control-lg']">
              {{ t.settings.submit }}
            </v-btn>
          </v-form>
        </SectionCard>

        <SectionCard :title="t.saved.title" :subtitle="t.saved.subtitle(saved.length)" flush>
          <template #actions>
            <v-btn variant="text" color="primary" size="small" prepend-icon="fas fa-plus" @click="addSaved">
              {{ t.actions.save }}
            </v-btn>
          </template>
          <SavedReportList :items="saved" :active-id="activeSavedId" @open="openSaved" @edit="editSaved" @delete="askDelete" />
        </SectionCard>
      </v-col>

      <v-col cols="12" lg="8">
        <SectionCard flush>
          <template #header>
            <div class="d-flex align-center ga-4 min-w-0">
              <IconTile :icon="def.icon" :tone="def.tone" />
              <div class="min-w-0">
                <h2 class="pf-type-h4 text-text-primary">{{ def.label }}</h2>
                <p class="pf-type-body-sm text-text-secondary">
                  {{ t.preview.range(formatThaiDate(applied.range[0]), formatThaiDate(applied.range[1])) }}
                </p>
              </div>
            </div>
          </template>
          <template #actions>
            <StatusBadge tone="neutral">{{ t.preview.rows(formatNumber(rows.length)) }}</StatusBadge>
          </template>

          <template v-if="rows.length">
            <div class="pa-6 pf-bordered-bottom">
              <KeyValueList :items="totals" :columns="smAndDown ? 2 : totals.length" class="pa-4 rounded-lg bg-bg-surface-muted" />
              <p class="pf-type-caption text-text-tertiary mt-2">
                {{ t.preview.total }} · {{ t.preview.generatedAt(formatDateTime(`${reportToday}T11:20:00`)) }}
              </p>
            </div>

            <div v-if="chart" class="pa-6 pf-bordered-bottom chart-wrap">
              <div class="pf-type-label-md text-text-primary mb-3">{{ t.preview.chartTitle }}</div>
              <BarChart :labels="chart.labels" :series="chart.series" :style="{ minWidth: `calc(var(--pf-space-32) * ${chart.labels.length})` }" />
            </div>

            <AppDataTable :headers="headers" :items="rows" :per-page="10" class="report-table">
              <template v-for="h in headers" #[`item.${h.key}`]="{ item }">
                <StatusBadge v-if="h.format === 'status'" :tone="t.statuses[item[h.key]].tone" dot>
                  {{ fmt(item[h.key], h.format) }}
                </StatusBadge>
                <span
                  v-else
                  :class="{
                    'pf-type-body-sm-strong': h.format === 'money',
                    'text-status-danger-fg': h.key === 'diff' && item[h.key] !== 0,
                  }"
                >
                  {{ fmt(item[h.key], h.format) }}
                </span>
              </template>
            </AppDataTable>
          </template>

          <EmptyState
            v-else
            icon="far fa-calendar-xmark"
            tone="neutral"
            :title="t.preview.emptyTitle"
            :description="t.preview.emptyDescription"
            class="py-12"
          />
        </SectionCard>
      </v-col>
    </v-row>

    <SavedReportDialog v-model="form.open" :report="form.report" :mode="form.mode" @save="onSave" />
    <ConfirmDialog
      v-model="removing.open"
      :title="t.saved.deleteTitle"
      :message="removing.report ? t.saved.deleteMessage(removing.report.name) : ''"
      :confirm-text="t.saved.delete"
      icon="far fa-trash-can"
      @confirm="confirmDelete"
    />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.report-table :deep(td) {
  white-space: nowrap;
}
.chart-wrap {
  overflow-x: auto;
}
</style>
