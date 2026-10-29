<script setup>
// B-22 · จัดการแบบสอบถามและผล (เสนอเพิ่ม — ยังไม่มีใน Figma) — TOR 4.5, 4.5.1 · ฟอร์มหน้าเว็บคือ P-06
import { downloadCsv } from "@/utils/csv.js";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import KpiCard from "@/components/KpiCard.vue";
import SectionCard from "@/components/SectionCard.vue";
import BarChart from "@/components/BarChart.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import QuestionFormDialog from "@/components/surveys-admin/QuestionFormDialog.vue";
import { surveysAdminText as t } from "@/content/surveys-admin.js";
import {
  questionTypes,
  surveyAspects,
  surveyPeriods,
  surveyQuestions,
  surveyResponses,
  surveySummary,
} from "@/mocks/surveys-admin.js";
import { formatDateTime, formatNumber } from "@/utils/format.js";
import { size, space } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

useSessionStore().signInAs("somrudee");
const router = useRouter();

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

const questions = ref(surveyQuestions.map((q) => ({ ...q })));
const tab = ref("results");
const tabs = computed(() => [
  { value: "results", label: t.tabs.results },
  { value: "questions", label: t.tabs.questions, count: questions.value.length },
]);

// ---------- ผลแบบสอบถาม ----------
const period = ref("month");
const summary = computed(() => surveySummary[period.value]);
const aspectKeys = Object.keys(surveyAspects);
const overallAvg = computed(() => {
  const v = Object.values(summary.value.avg);
  return v.reduce((a, b) => a + b, 0) / v.length;
});
const kpis = computed(() => [
  { key: "resp", icon: "fas fa-user-group", tone: "teal", label: t.kpis.respondents, value: formatNumber(summary.value.respondents) },
  { key: "avg", icon: "far fa-star", tone: "amber", label: t.kpis.average, value: overallAvg.value.toFixed(2), caption: t.kpis.averageCaption },
  {
    key: "sat",
    icon: "far fa-face-smile",
    tone: "green",
    label: t.kpis.satisfied,
    value: `${(summary.value.satisfied * 100).toFixed(1)}%`,
    caption: t.kpis.satisfiedCaption,
  },
  {
    key: "q",
    icon: "fas fa-list-check",
    tone: "pink",
    label: t.kpis.questions,
    value: questions.value.filter((q) => q.active).length,
    caption: t.kpis.questionsCaption(questions.value.length),
  },
]);
const chartLabels = aspectKeys.map((k) => surveyAspects[k].short);
const chartSeries = computed(() => [
  { name: t.chart.series, color: "chart-series-1", data: aspectKeys.map((k) => summary.value.avg[k]) },
]);
const scoreTone = (v) => (v >= 4 ? "success" : v >= 3 ? "warning" : "danger");
const scoreKeys = ["convenience", "speed", "accuracy", "information", "security", "overall"];

// ส่งออก CSV (ดาวน์โหลดไฟล์จริง — UTF-8 BOM ให้ Excel อ่านภาษาไทยได้)
const exportCsv = () => {
  const rows = surveyResponses.map((r) => [
    formatDateTime(r.submittedAt),
    r.respondentType,
    ...scoreKeys.map((k) => r.scores[k]),
    r.comment,
  ]);
  downloadCsv(t.csv.filename, t.csv.columns, rows);
  notify(t.actions.exported(rows.length));
};

// ---------- ตั้งค่าคำถาม ----------
const questionRows = computed(() => questions.value.map((q, i) => ({ ...q, order: i + 1 })));
const toggle = (row) => {
  const q = questions.value.find((x) => x.id === row.id);
  q.active = !q.active;
  notify(t.questions.toggled(q.active));
};
const moveUp = (row) => {
  const i = questions.value.findIndex((x) => x.id === row.id);
  if (i < 1) return;
  const list = [...questions.value];
  [list[i - 1], list[i]] = [list[i], list[i - 1]];
  questions.value = list;
};
const editor = reactive({ open: false, question: null });
const openEditor = (q = null) => Object.assign(editor, { open: true, question: q });
const save = (data) => {
  if (editor.question) {
    Object.assign(questions.value.find((q) => q.id === editor.question.id), data);
    notify(t.form.updated);
  } else {
    questions.value.push({ ...data, id: Math.max(...questions.value.map((q) => q.id)) + 1 });
    notify(t.form.added);
  }
};
const removing = reactive({ open: false, question: null });
const askRemove = (q) => Object.assign(removing, { open: true, question: q });
const remove = () => {
  questions.value = questions.value.filter((q) => q.id !== removing.question.id);
  notify(t.confirmDelete.done);
};
const previewForm = () => window.open(router.resolve({ name: "portal-survey" }).href, "_blank");
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-arrow-up-right-from-square" @click="previewForm">{{ t.actions.previewForm }}</SecondaryButton>
        <v-btn
          v-if="tab === 'results'"
          color="primary"
          prepend-icon="fas fa-file-csv"
          :height="size['control-lg']"
          @click="exportCsv"
        >
          {{ t.actions.exportCsv }}
        </v-btn>
        <v-btn v-else color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="openEditor()">
          {{ t.actions.addQuestion }}
        </v-btn>
      </template>
    </PageHeader>

    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6 pf-bordered-bottom">
      <StatusTabs v-model="tab" :tabs="tabs" />
      <SegmentedControl v-if="tab === 'results'" v-model="period" :options="surveyPeriods" :label="t.period" class="mb-2" />
    </div>

    <template v-if="tab === 'results'">
      <v-row class="mb-2">
        <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" lg="3">
          <KpiCard :icon="k.icon" :tone="k.tone" :label="k.label" :value="k.value" :caption="k.caption" />
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" lg="7">
          <SectionCard :title="t.chart.title" :subtitle="t.chart.subtitle" class="h-100">
            <BarChart :labels="chartLabels" :series="chartSeries" :max="5" :ticks="5" :axis-label="t.chart.axis" hide-legend />
          </SectionCard>
        </v-col>
        <v-col cols="12" lg="5">
          <SectionCard :title="t.scoreList" class="h-100">
            <div v-for="k in aspectKeys" :key="k" class="mb-4">
              <div class="d-flex justify-space-between ga-3 mb-1">
                <span class="pf-type-body-sm text-text-secondary">{{ surveyAspects[k].label }}</span>
                <span class="pf-type-body-sm-strong text-text-primary">{{ summary.avg[k].toFixed(2) }}</span>
              </div>
              <v-progress-linear
                :model-value="(summary.avg[k] / 5) * 100"
                :color="k === 'overall' ? 'chart-series-3' : 'chart-series-1'"
                bg-color="chart-track"
                bg-opacity="1"
                rounded
                :height="space[4]"
              />
            </div>
          </SectionCard>
        </v-col>
      </v-row>

      <SectionCard :title="t.responses.title" :subtitle="t.responses.subtitle(surveyResponses.length)" flush>
        <template #actions>
          <SecondaryButton icon="fas fa-download" height="control-md" @click="exportCsv">{{ t.actions.exportCsv }}</SecondaryButton>
        </template>
        <AppDataTable :headers="t.responses.headers" :items="surveyResponses" :per-page="6" :show-per-page="false" class="survey-table">
          <template #item.submittedAt="{ item }">
            <span class="text-no-wrap">{{ formatDateTime(item.submittedAt) }}</span>
          </template>
          <template v-for="k in scoreKeys" :key="k" #[`item.${k}`]="{ item }">
            <StatusBadge :tone="scoreTone(item.scores[k])">{{ item.scores[k] }}</StatusBadge>
          </template>
          <template #item.comment="{ item }">
            <span class="comment d-inline-block py-3" :class="item.comment ? 'text-text-primary' : 'text-text-tertiary'">
              {{ item.comment || t.responses.noComment }}
            </span>
          </template>
        </AppDataTable>
      </SectionCard>
    </template>

    <SectionCard v-else :title="t.questions.title" :subtitle="t.questions.subtitle" flush>
      <AppDataTable :headers="t.questions.headers" :items="questionRows" :paginate="false" class="survey-table">
        <template #item.order="{ item }">
          <span class="pf-type-body-sm-strong">{{ item.order }}</span>
        </template>
        <template #item.text="{ item }">
          <span class="question d-inline-block py-3" :class="item.active ? '' : 'text-text-tertiary'">{{ item.text }}</span>
        </template>
        <template #item.aspect="{ item }">{{ surveyAspects[item.aspect].label }}</template>
        <template #item.type="{ item }">
          <StatusBadge :tone="questionTypes[item.type].tone">{{ questionTypes[item.type].label }}</StatusBadge>
        </template>
        <template #item.required="{ item }">
          <span :class="item.required ? 'text-text-primary' : 'text-text-tertiary'">
            {{ item.required ? t.questions.required : t.questions.optional }}
          </span>
        </template>
        <template #item.active="{ item }">
          <div class="d-flex justify-center">
            <v-switch
              :model-value="item.active"
              :aria-label="t.questions.toggle(item.active)"
              color="success"
              inset
              hide-details
              density="compact"
              @update:model-value="toggle(item)"
            />
          </div>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="fas fa-arrow-up" :label="t.questions.moveUp" :disabled="item.order === 1" @click="moveUp(item)" />
            <TableIconButton icon="fas fa-pen" :label="t.questions.edit" @click="openEditor(questions.find((q) => q.id === item.id))" />
            <TableIconButton icon="far fa-trash-can" :label="t.questions.remove" tone="status-danger-fg" @click="askRemove(item)" />
          </div>
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-list-check" tone="neutral" :title="t.questions.title" />
        </template>
      </AppDataTable>
      <template #footer>
        <AlertBox tone="info">{{ t.questions.note }}</AlertBox>
      </template>
    </SectionCard>

    <QuestionFormDialog v-model="editor.open" :question="editor.question" @save="save" />

    <ConfirmDialog
      v-model="removing.open"
      :title="t.confirmDelete.title"
      :message="removing.question ? t.confirmDelete.message(removing.question.text) : ''"
      :confirm-text="t.confirmDelete.confirm"
      icon="far fa-trash-can"
      @confirm="remove"
    />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.survey-table :deep(th),
.survey-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.survey-table :deep(td) {
  white-space: nowrap;
}
.comment,
.question {
  white-space: normal;
  min-width: calc(var(--pf-space-120) + var(--pf-space-80));
  max-width: calc(var(--pf-space-120) * 3);
}
</style>
