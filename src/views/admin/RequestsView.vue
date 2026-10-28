<script setup>
// D09 · Admin / Requests – Pending List (B-05) และ D18 · No Results (Empty state ของหน้าเดียวกัน)
// รองรับ query สำหรับลิงก์ / ทดสอบ: ?ref= &taxId= &company= &invoice= &cert= &from=YYYY-MM-DD &to= &tab= &sort=asc|desc
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import EmptyState from "@/components/EmptyState.vue";
import DateRangeField from "@/components/requests/DateRangeField.vue";
import RequestTable from "@/components/requests/RequestTable.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { requestsText as t } from "@/content/requests.js";
import { common } from "@/content/common.js";
import { requestDetails, requestTabCounts, requests } from "@/mocks/requests.js";
import { operators } from "@/mocks/operators.js";
import { formatDate } from "@/utils/format.js";

const route = useRoute();
const router = useRouter();

// ช่วงวันที่เริ่มต้นตาม Figma (01/10/2569 – 26/10/2569)
const DEFAULT_RANGE = ["2026-10-01", "2026-10-26"];
const TEXT_KEYS = ["ref", "taxId", "company", "invoice", "cert"];

const blank = () => ({ ref: "", taxId: "", company: "", invoice: "", cert: "", range: [...DEFAULT_RANGE] });
const fromQuery = (q) => {
  const f = blank();
  TEXT_KEYS.forEach((k) => typeof q[k] === "string" && (f[k] = q[k]));
  if (q.from) f.range = [q.from, q.to || q.from];
  return f;
};

const form = reactive(fromQuery(route.query));
const applied = ref({ ...form, range: [...form.range] });
const tab = ref(t.tabs.some((x) => x.value === route.query.tab) ? route.query.tab : "pending");
const sort = ref(route.query.sort === "desc" ? "desc" : "asc");
const toast = ref(false);

// ข้อมูลเสริมสำหรับค้นหา: เลขผู้เสียภาษี / ชื่ออังกฤษ (จากทะเบียนผู้ประกอบการ) และเลขที่ใบรับรอง (จากรายละเอียดคำขอ)
const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));
const searchable = requests.map((r) => {
  const op = operatorByName[r.company];
  const issued = requestDetails[r.ref]?.issued;
  return {
    ...r,
    taxId: op?.taxId ?? requestDetails[r.ref]?.exporter?.taxId ?? "",
    companyEn: op?.nameEn ?? "",
    certNos: issued ? [issued.certificate, r.ref] : [r.ref],
  };
});

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const has = (value, term) => norm(value).includes(norm(term));

const isFiltered = computed(() => {
  const f = applied.value;
  return TEXT_KEYS.some((k) => f[k].trim()) || f.range.join() !== DEFAULT_RANGE.join();
});

const matched = computed(() => {
  const f = applied.value;
  const [from, to] = f.range;
  return searchable.filter((r) => {
    const day = r.submittedAt.slice(0, 10);
    return (
      (!f.ref || has(r.ref, f.ref)) &&
      (!f.taxId || has(r.taxId, f.taxId)) &&
      (!f.company || has(r.company, f.company) || has(r.companyEn, f.company)) &&
      (!f.invoice || has(r.invoice, f.invoice)) &&
      (!f.cert || r.certNos.some((n) => has(n, f.cert))) &&
      (!from || day >= from) &&
      (!to || day <= to)
    );
  });
});

const inTab = (r, value) => {
  const def = t.tabs.find((x) => x.value === value);
  return !def.statuses || def.statuses.includes(r.status);
};

// ตัวนับแท็บ: ยังไม่ค้นหา = จำนวนทั้งระบบ (requestTabCounts) · ค้นหาแล้ว = จำนวนตามผลค้นหา
const tabs = computed(() =>
  t.tabs.map((x) => ({
    value: x.value,
    label: x.label,
    count: isFiltered.value ? matched.value.filter((r) => inTab(r, x.value)).length : requestTabCounts[x.value],
  }))
);

const rows = computed(() => {
  const list = matched.value.filter((r) => inTab(r, tab.value));
  return [...list].sort((a, b) =>
    sort.value === "asc" ? a.submittedAt.localeCompare(b.submittedAt) : b.submittedAt.localeCompare(a.submittedAt)
  );
});

// คำขอที่ยื่นก่อนสุด (ต้องพิจารณาเป็นลำดับแรก)
const oldestRef = computed(
  () => rows.value.reduce((min, r) => (!min || r.submittedAt < min.submittedAt ? r : min), null)?.ref ?? null
);

const emptyDescription = computed(() => {
  const f = applied.value;
  const term = ["company", "ref", "taxId", "invoice", "cert"].map((k) => f[k].trim()).find(Boolean);
  const [from, to] = f.range;
  const range = from ? `${formatDate(from)} – ${formatDate(to || from)}` : "";
  return t.empty.description(term, range);
});

const syncQuery = () => {
  const f = applied.value;
  const query = {};
  TEXT_KEYS.forEach((k) => f[k].trim() && (query[k] = f[k].trim()));
  if (f.range.join() !== DEFAULT_RANGE.join() && f.range[0]) Object.assign(query, { from: f.range[0], to: f.range[1] });
  if (tab.value !== "pending") query.tab = tab.value;
  if (sort.value !== "asc") query.sort = sort.value;
  router.replace({ query });
};

const search = () => {
  applied.value = { ...form, range: [...form.range] };
  syncQuery();
};
const reset = () => {
  Object.assign(form, blank());
  search();
};

const open = (item) => router.push({ name: "admin-request-review", params: { ref: item.ref } });
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-download" :disabled="!rows.length" @click="toast = true">
          {{ common.actions.exportExcel }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <FilterCard @search="search" @reset="reset">
      <v-col cols="12" sm="6" lg="2">
        <FieldLabel :label="t.filters.ref.label" for="f-ref" />
        <v-text-field id="f-ref" v-model="form.ref" :placeholder="t.filters.ref.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg="2">
        <FieldLabel :label="t.filters.taxId.label" for="f-tax" />
        <v-text-field id="f-tax" v-model="form.taxId" :placeholder="t.filters.taxId.placeholder" inputmode="numeric" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <FieldLabel :label="t.filters.company.label" for="f-company" />
        <v-text-field id="f-company" v-model="form.company" :placeholder="t.filters.company.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg="2">
        <FieldLabel :label="t.filters.invoice.label" for="f-invoice" />
        <v-text-field id="f-invoice" v-model="form.invoice" :placeholder="t.filters.invoice.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <FieldLabel :label="t.filters.dateRange.label" for="f-range" />
        <DateRangeField id="f-range" v-model="form.range" :placeholder="t.filters.dateRange.placeholder" />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <FieldLabel :label="t.filters.certificate.label" for="f-cert" />
        <v-text-field id="f-cert" v-model="form.cert" :placeholder="t.filters.certificate.placeholder" hide-details />
      </v-col>
    </FilterCard>

    <SectionCard flush>
      <div class="d-flex flex-wrap align-center justify-space-between column-gap-4 px-2 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" class="requests__tabs" @update:model-value="syncQuery" />
        <div class="d-flex align-center ga-3 px-4 py-2">
          <span class="pf-type-body-sm text-text-secondary text-no-wrap">{{ t.sort.label }}</span>
          <v-select
            v-model="sort"
            :items="t.sort.options"
            density="compact"
            hide-details
            class="requests__sort"
            @update:model-value="syncQuery"
          />
        </div>
      </div>

      <RequestTable :items="rows" :highlight="oldestRef" @open="open">
        <template #empty>
          <EmptyState
            v-if="isFiltered"
            :icon="t.empty.icon"
            :title="t.empty.title"
            :description="emptyDescription"
            class="requests__empty"
          >
            <template #actions>
              <SecondaryButton icon="fas fa-rotate" height="control-md" @click="reset">{{ t.empty.clear }}</SecondaryButton>
            </template>
          </EmptyState>
          <EmptyState
            v-else
            :icon="t.empty.icon"
            :title="t.empty.tabTitle"
            :description="t.empty.tabDescription(tabs.find((x) => x.value === tab).label)"
            class="requests__empty"
          />
        </template>
      </RequestTable>
    </SectionCard>

    <v-snackbar v-model="toast" location="bottom right">{{ t.exported }}</v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.requests__tabs {
  min-width: 0;
  max-width: 100%;
}
.requests__sort {
  min-width: calc(var(--pf-size-desktop-search) / 2);
}
.requests__empty {
  white-space: normal;
}
.requests__empty :deep(p) {
  font-size: var(--pf-type-body-sm-size);
  line-height: var(--pf-type-body-sm-line);
  max-width: calc(var(--pf-size-dialog-md) - var(--pf-space-80) * 3);
  margin-inline: auto;
}
.requests__empty :deep(h1) {
  font-size: var(--pf-type-h4-size);
  line-height: var(--pf-type-h4-line);
}
</style>
