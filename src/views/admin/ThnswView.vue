<script setup>
// B-04 · พิจารณาอนุมัติ THNSW (Figma ยังไม่มี — ออกแบบตามสไตล์ D08) — TOR 4.4.1 (2), Flow 2 ขึ้นทะเบียนผู้ใช้บริการ
// รองรับ query: ?tab=pending|approved|rejected
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import KpiCard from "@/components/KpiCard.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import ThnswRequestTable from "@/components/thnsw/ThnswRequestTable.vue";
import ThnswDetailDialog from "@/components/thnsw/ThnswDetailDialog.vue";
import ThnswApproveDialog from "@/components/thnsw/ThnswApproveDialog.vue";
import ThnswRejectDialog from "@/components/thnsw/ThnswRejectDialog.vue";
import { thnswText as t } from "@/content/thnsw.js";
import { operatorTypes } from "@/mocks/operators.js";
import { thnswDecided, thnswNow, thnswRequests, thnswToday } from "@/mocks/thnsw.js";
import { formatNumber } from "@/utils/format.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const session = useSessionStore();
session.signInAs("somrudee");

const deep = (o) => JSON.parse(JSON.stringify(o));
const list = ref([...thnswRequests, ...thnswDecided].map(deep));

const tab = ref(["pending", "approved", "rejected"].includes(route.query.tab) ? route.query.tab : "pending");

// ---------- ตัวกรอง (TOR 4.4.1 (2): Profile, NSW Register ID, สิทธิ์การเข้าใช้งาน) ----------
const blank = () => ({ profile: "", nswId: "", access: "all", company: "" });
const form = reactive(blank());
const applied = ref(blank());
const search = () => (applied.value = { ...form });
const reset = () => {
  Object.assign(form, blank());
  search();
};
const isFiltered = computed(() => JSON.stringify(applied.value) !== JSON.stringify(blank()));
const accessItems = [
  { value: "all", title: t.filters.all },
  ...Object.entries(operatorTypes).map(([value, v]) => ({ value, title: v.label })),
];

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const has = (value, term) => !term || norm(value).includes(norm(term));
const matched = computed(() => {
  const f = applied.value;
  return list.value.filter(
    (o) =>
      has(o.profileId, f.profile) &&
      has(o.nswId, f.nswId) &&
      (f.access === "all" || o.type === f.access) &&
      (!f.company || [o.nameTh, o.nameEn, o.taxId].some((v) => has(v, f.company)))
  );
});
const byStatus = (status) => matched.value.filter((o) => (o.decision ?? "pending") === status);
const rows = computed(() =>
  byStatus(tab.value).sort((a, b) =>
    tab.value === "pending" ? a.receivedAt.localeCompare(b.receivedAt) : b.decidedAt.localeCompare(a.decidedAt)
  )
);
const tabs = computed(() =>
  ["pending", "approved", "rejected"].map((value) => ({ value, label: t.tabs[value], count: byStatus(value).length }))
);

// ---------- KPI (คำนวณจากรายการทั้งหมด ไม่ขึ้นกับตัวกรอง) ----------
const countOf = (fn) => list.value.filter(fn).length;
const kpis = computed(() => {
  const approved = countOf((o) => o.decision === "approved");
  return [
    { icon: "fas fa-user-clock", tone: "amber", label: t.kpi.pending.label, value: formatNumber(countOf((o) => !o.decision)), caption: t.kpi.pending.caption },
    {
      icon: "fas fa-user-check",
      tone: "green",
      label: t.kpi.approvedToday.label,
      value: formatNumber(countOf((o) => o.decision === "approved" && o.decidedAt.startsWith(thnswToday))),
      caption: t.kpi.approvedToday.caption(approved),
    },
    { icon: "fas fa-user-xmark", tone: "red", label: t.kpi.rejected.label, value: formatNumber(countOf((o) => o.decision === "rejected")), caption: t.kpi.rejected.caption },
  ];
});

// ---------- แจ้งผล ----------
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- รายละเอียด / อนุมัติ / ไม่อนุมัติ ----------
const current = ref(null);
const detailOpen = ref(false);
const approveOpen = ref(false);
const rejectOpen = ref(false);

const view = (o) => {
  current.value = o;
  detailOpen.value = true;
};
const askApprove = (o) => {
  current.value = o;
  detailOpen.value = false;
  approveOpen.value = true;
};
const askReject = (o) => {
  current.value = o;
  detailOpen.value = false;
  rejectOpen.value = true;
};
const decide = (decision, extra) => {
  Object.assign(current.value, { decision, decidedAt: thnswNow, decidedBy: session.user.name, ...extra });
};
const approve = (rights) => {
  decide("approved", rights);
  notify(t.approve.done(current.value.nameTh));
};
const reject = (reason) => {
  decide("rejected", { reason });
  notify(t.reject.done(current.value.nameTh));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="far fa-building" :to="{ name: 'admin-operators' }">{{ t.goOperators }}</SecondaryButton>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="kpi in kpis" :key="kpi.label" cols="12" sm="4">
        <KpiCard v-bind="kpi" />
      </v-col>
    </v-row>

    <FilterCard @search="search" @reset="reset">
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.profile.label" for="th-profile" />
        <v-text-field id="th-profile" v-model="form.profile" :placeholder="t.filters.profile.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.nswId.label" for="th-nsw" />
        <v-text-field id="th-nsw" v-model="form.nswId" :placeholder="t.filters.nswId.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.access.label" for="th-access" />
        <v-select id="th-access" v-model="form.access" :items="accessItems" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.company.label" for="th-company" />
        <v-text-field id="th-company" v-model="form.company" :placeholder="t.filters.company.placeholder" hide-details />
      </v-col>
    </FilterCard>

    <SectionCard flush>
      <div class="px-2 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>
      <ThnswRequestTable :key="tab" :items="rows" :mode="tab" @view="view" @approve="askApprove" @reject="askReject">
        <template #empty>
          <EmptyState
            :icon="t.empty.icon"
            tone="neutral"
            :title="isFiltered || tab !== 'pending' ? t.empty.title : t.empty.pendingTitle"
            :description="isFiltered || tab !== 'pending' ? t.empty.description : t.empty.pendingDescription"
            class="thnsw__empty"
          />
        </template>
      </ThnswRequestTable>
    </SectionCard>

    <ThnswDetailDialog v-model="detailOpen" :request="current" @approve="askApprove" @reject="askReject" />
    <ThnswApproveDialog v-model="approveOpen" :request="current" @confirm="approve" />
    <ThnswRejectDialog v-model="rejectOpen" :request="current" @confirm="reject" />

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.thnsw__empty {
  white-space: normal;
}
.thnsw__empty :deep(h1) {
  font-size: var(--pf-type-h4-size);
  line-height: var(--pf-type-h4-line);
}
</style>
