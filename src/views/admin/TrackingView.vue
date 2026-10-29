<script setup>
// D12 ติดตามสถานะคำขอ — Figma 19:2790
// ไม่ระบุคำขอ = ตารางรายการติดตามสถานะ (TOR 4.4.2 (8)) · ?ref=<Reference No.> = รายละเอียดคำขอ
import { downloadCsv } from "@/utils/csv.js";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SectionCard from "@/components/SectionCard.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import EmptyState from "@/components/EmptyState.vue";
import StatusHistoryTable from "@/components/tracking/StatusHistoryTable.vue";
import ApplicantCard from "@/components/tracking/ApplicantCard.vue";
import IssuedDocuments from "@/components/tracking/IssuedDocuments.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import { trackingText as t } from "@/content/tracking.js";
import { reviewText } from "@/content/review.js";
import { requestDetails, requestStatuses, requestSteps, requests } from "@/mocks/requests.js";
import { issuedDocuments, simpleHistory, trackingExtras } from "@/mocks/review.js";
import { useReviewStore } from "@/stores/review.js";
import { useSessionStore } from "@/stores/session.js";
import { formatDate, formatDateTimeSec, formatNumber, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const route = useRoute();
const router = useRouter();
const store = useReviewStore();
// ปุ่มดูข้อความ ebXML ของคำขอ (B-17 ?ref=) แสดงเฉพาะผู้มีสิทธิ์เมนู ebXML — backend เป็นผู้ตรวจจริง
const canViewEbxml = computed(() => useSessionStore().can("ebxml"));

const breadcrumb = [{ title: t.breadcrumb.group }, { title: t.breadcrumb.title }];

// ----- ข้อมูลรายการ -----
// สถานะจาก store เท่านั้น (ผลที่บันทึกในรอบนี้ → สถานะในข้อมูลจำลอง) ให้ตรงกับหน้ารายการคำขอ / การชำระเงิน / ใบรับรองฯ
const statusKeyOf = (r) => store.statusOf(r.ref);
const rows = computed(() =>
  requests.map((r) => ({
    ...r,
    bankCode: trackingExtras[r.ref]?.bankCode ?? "",
    certificate: trackingExtras[r.ref]?.certificate ?? "",
    taxId: requestDetails[r.ref]?.exporter.taxId ?? "",
    nameEn: requestDetails[r.ref]?.exporter.nameEn ?? "",
    statusKey: statusKeyOf(r),
  }))
);

// ----- ค้นหา -----
const emptyFilters = () => ({ query: "", taxId: "", company: "", date: "" });
const filters = reactive(emptyFilters());
const applied = ref(emptyFilters());
const norm = (v) => v.toLowerCase().replace(/\s+/g, "");
const matches = (r, f) => {
  const q = norm(f.query);
  if (q && ![r.ref, r.certificate, r.invoice].some((v) => norm(v).includes(q))) return false;
  if (f.taxId && !r.taxId.includes(f.taxId.trim())) return false;
  if (f.company && ![r.company, r.nameEn].some((v) => v.toLowerCase().includes(f.company.trim().toLowerCase()))) return false;
  if (f.date && formatDate(r.submittedAt) !== f.date.trim()) return false;
  return true;
};
// รายการล่าสุดอยู่ด้านบน
const filtered = computed(() =>
  rows.value.filter((r) => matches(r, applied.value)).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
);

const search = () => {
  const f = { ...filters };
  const found = rows.value.filter((r) => matches(r, f));
  if (f.query.trim() && found.length === 1) {
    router.push({ query: { ref: found[0].ref } });
    return;
  }
  applied.value = f;
  if (detailRef.value) router.push({ query: {} });
};
const reset = () => {
  Object.assign(filters, emptyFilters());
  applied.value = emptyFilters();
};

// ----- รายละเอียด -----
const detailRef = computed(() => route.query.ref?.toString().trim() ?? "");
const req = computed(() => rows.value.find((r) => r.ref === detailRef.value) ?? null);
const full = computed(() => (req.value ? requestDetails[req.value.ref] : null));

watch(
  detailRef,
  (v) => {
    if (!v) return;
    const r = rows.value.find((x) => x.ref === v);
    Object.assign(filters, emptyFilters(), { query: v, date: r ? formatDate(r.submittedAt) : "" });
  },
  { immediate: true }
);

const statusOf = (key) => requestStatuses[key];
const current = computed(() => statusOf(req.value.statusKey));

const steps = computed(() => {
  if (full.value?.stepTimes) return requestSteps.map((label, i) => ({ label, caption: full.value.stepTimes[i] }));
  const h = simpleHistory(req.value);
  const times = [h[2].at, h[1].at, h[0].at];
  return requestSteps.map((label, i) => ({ label, caption: times[i] ? formatTime(times[i]) : "" }));
});
const stepIndex = computed(() => current.value.step ?? current.value.atStep ?? 2);
const currentLabel = computed(() =>
  !full.value?.history && req.value.statusKey === "pending" ? requestSteps[2] : current.value.label
);
const currentTone = computed(() => (current.value.final ? current.value.tone : "accent"));

const history = computed(() => {
  if (full.value?.history) return full.value.history;
  return [...(store.record(req.value.ref)?.events ?? []), ...simpleHistory(req.value)];
});

const applicant = computed(() => ({
  ref: req.value.ref,
  businessType: full.value?.exporter.businessType ?? t.applicant.defaultBusinessType,
  taxId: full.value?.exporter.taxId ?? "",
  branch: full.value?.exporter.branch ?? "",
  company: req.value.company,
}));
const docs = computed(() => issuedDocuments[req.value.ref] ?? []);

// ----- ดาวน์โหลด (จำลอง) -----
const snack = ref({ show: false, text: "" });
const notify = (text) => (snack.value = { show: true, text });
const downloadHistory = () => {
  const rows = history.value.map((e) => {
    const base = e.event ? reviewText.history.events[e.event] : requestStatuses[e.status];
    return [e.label ?? base.label, e.detail, formatDateTimeSec(e.at), e.by];
  });
  const name = `${req.value.ref}-history.csv`;
  downloadCsv(name, Object.values(t.history.headers), rows);
  notify(t.downloaded(name));
};

// ----- ตารางรายการ -----
const h = t.list.headers;
const headers = [
  { title: h.ref, key: "ref" },
  { title: h.submittedAt, key: "submittedAt" },
  { title: h.invoice, key: "invoice" },
  { title: h.company, key: "company" },
  { title: h.bankCode, key: "bankCode", sortable: false },
  { title: h.certificate, key: "certificate" },
  { title: h.brand, key: "brand" },
  { title: h.country, key: "country" },
  { title: h.items, key: "items", align: "end" },
  { title: h.status, key: "statusKey", sortable: false },
  { title: h.view, key: "view", sortable: false, align: "center" },
];
const open = (item) => router.push({ query: { ref: item.ref } });
</script>

<template>
  <AdminLayout :breadcrumb="breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template v-if="detailRef" #actions>
        <SecondaryButton
          prepend-icon="fas fa-chevron-left"
          @click="reset(), router.push({ query: {} })"
        >
          {{ t.backToList }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <FilterCard :show-reset="!detailRef" @search="search" @reset="reset">
      <v-col cols="12" sm="6" lg="4">
        <FieldLabel :label="t.filters.query" for="trk-query" />
        <v-text-field
          id="trk-query"
          v-model="filters.query"
          :placeholder="t.filters.queryPlaceholder"
          prepend-inner-icon="fas fa-magnifying-glass"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6" lg>
        <FieldLabel :label="t.filters.taxId" for="trk-tax" />
        <v-text-field id="trk-tax" v-model="filters.taxId" :placeholder="t.filters.taxIdPlaceholder" inputmode="numeric" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg>
        <FieldLabel :label="t.filters.company" for="trk-company" />
        <v-text-field id="trk-company" v-model="filters.company" :placeholder="t.filters.companyPlaceholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg>
        <FieldLabel :label="t.filters.date" for="trk-date" />
        <v-text-field
          id="trk-date"
          v-model="filters.date"
          :placeholder="t.filters.datePlaceholder"
          prepend-inner-icon="far fa-calendar"
          hide-details
        />
      </v-col>
    </FilterCard>

    <!-- รายละเอียดคำขอ -->
    <template v-if="detailRef">
      <v-card v-if="!req" class="pf-bordered">
        <EmptyState icon="fas fa-magnifying-glass" tone="amber" :title="t.notFound.title" :description="t.notFound.description(detailRef)" />
      </v-card>

      <v-row v-else>
        <v-col cols="12" lg="8" class="d-flex flex-column ga-6 min-w-0">
          <SectionCard :title="t.steps.title(req.ref)">
            <template #actions>
              <StatusBadge :tone="currentTone" dot>{{ currentLabel }}</StatusBadge>
            </template>
            <div class="steps-scroll">
              <StepIndicator :steps="steps" :current="stepIndex" :complete="req.statusKey === 'completed'" class="steps-inner" />
            </div>
          </SectionCard>

          <SectionCard :title="t.history.title" flush>
            <template #actions>
              <v-btn variant="text" color="primary" prepend-icon="fas fa-download" @click="downloadHistory">
                {{ t.history.download }}
              </v-btn>
            </template>
            <StatusHistoryTable :entries="history" />
          </SectionCard>
        </v-col>

        <v-col cols="12" lg="4" class="d-flex flex-column ga-6 min-w-0">
          <ApplicantCard :applicant="applicant" :agent="full?.agent ?? null" />
          <IssuedDocuments :documents="docs" @download="(n) => notify(t.downloaded(n))" />
          <v-btn
            v-if="!full || req.statusKey === 'pending'"
            variant="outlined"
            color="primary"
            prepend-icon="fas fa-clipboard-check"
            :to="{ name: 'admin-request-review', params: { ref: req.ref } }"
          >
            {{ t.openReview }}
          </v-btn>
          <v-btn
            v-if="canViewEbxml"
            variant="outlined"
            color="primary"
            prepend-icon="fas fa-server"
            :to="{ name: 'admin-ebxml', query: { ref: req.ref } }"
          >
            {{ t.openEbxml }}
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <!-- รายการติดตามสถานะ (TOR 4.4.2 (8)) -->
    <SectionCard v-else :title="t.list.title" :subtitle="t.list.subtitle" flush>
      <AppDataTable :headers="headers" :items="filtered" item-value="ref" class="list-table" @click:row="open">
        <template #item.ref="{ item }">
          <span class="pf-type-body-sm-strong text-text-link">{{ item.ref }}</span>
        </template>
        <template #item.submittedAt="{ item }">
          <div class="text-no-wrap">
            <div>{{ formatDate(item.submittedAt) }}</div>
            <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.submittedAt) }}</div>
          </div>
        </template>
        <template #item.company="{ item }">
          <div class="py-2 company">{{ item.company }}</div>
        </template>
        <template #item.bankCode="{ item }">{{ item.bankCode || t.list.empty }}</template>
        <template #item.certificate="{ item }">
          <span class="text-no-wrap">{{ item.certificate || t.list.empty }}</span>
        </template>
        <template #item.items="{ item }">{{ formatNumber(item.items) }}</template>
        <template #item.statusKey="{ item }">
          <StatusBadge :tone="statusOf(item.statusKey).tone" dot>{{ statusOf(item.statusKey).label }}</StatusBadge>
        </template>
        <template #item.view="{ item }">
          <TableIconButton icon="far fa-eye" :label="h.view" @click="open(item)" />
        </template>
        <template #no-data>
          <EmptyState icon="fas fa-magnifying-glass" tone="amber" :title="t.list.noResult.title" :description="t.list.noResult.description" />
        </template>
      </AppDataTable>
    </SectionCard>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" timeout="3000">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" color="text-text-on-inverse-accent" @click="snack.show = false">{{ t.snackClose }}</v-btn>
      </template>
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.steps-scroll {
  overflow-x: auto;
}
.steps-inner {
  min-width: calc(var(--pf-size-control-lg) * 13);
}
/* 9 ขั้นในการ์ดแคบ: ลดสัดส่วนเส้นเชื่อมให้ป้ายชื่อขั้นกว้างขึ้นตาม Figma */
.steps-inner :deep(.connector) {
  flex-grow: 0.3;
  min-width: var(--pf-space-8);
}
.company {
  min-width: calc(var(--pf-size-control-lg) * 4);
}
.list-table :deep(tbody tr) {
  cursor: pointer;
}
</style>
