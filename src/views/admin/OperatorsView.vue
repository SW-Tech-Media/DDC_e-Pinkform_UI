<script setup>
// D08 · Admin / Operators – List (B-03) + แท็บรอพิจารณาอนุมัติ THNSW (B-04) และประวัติการแก้ไข
// รองรับ query: ?tab=operators|thnsw|history
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
import OperatorTable from "@/components/operators/OperatorTable.vue";
import ThnswTable from "@/components/operators/ThnswTable.vue";
import OperatorHistoryTable from "@/components/operators/OperatorHistoryTable.vue";
import OperatorDetailDialog from "@/components/operators/OperatorDetailDialog.vue";
import OperatorFormDialog from "@/components/operators/OperatorFormDialog.vue";
import ConfirmDialog from "@/components/operators/ConfirmDialog.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { operatorsText as t } from "@/content/operators.js";
import { common } from "@/content/common.js";
import {
  operatorAccess,
  operatorHistory,
  operatorKpis,
  operatorServices,
  operatorTabCounts,
  operatorTypes,
  operators,
  thnswPending,
} from "@/mocks/operators.js";
import { size } from "@/design/tokens.js";
import { formatNumber } from "@/utils/format.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const session = useSessionStore();

// ข้อมูลในหน้า (แก้ไขได้ระหว่างใช้งาน Prototype)
const list = ref(operators.map((o) => ({ ...o })));
const thnsw = ref(thnswPending.map((o) => ({ ...o })));
const history = ref(operatorHistory.map((h) => ({ ...h })));

const tab = ref(["operators", "thnsw", "history"].includes(route.query.tab) ? route.query.tab : "operators");

// ---------- ตัวกรอง ----------
const blank = () => ({ taxId: "", branch: "", company: "", access: "all", service: "all", keyword: "" });
const form = reactive(blank());
const applied = ref(blank());
const search = () => (applied.value = { ...form });
const reset = () => {
  Object.assign(form, blank());
  search();
};
const isFiltered = computed(() => JSON.stringify(applied.value) !== JSON.stringify(blank()));

const all = { value: "all", title: t.filters.all };
const accessItems = [all, ...Object.entries(operatorAccess).map(([value, v]) => ({ value, title: v.label }))];
const serviceItems = [all, ...Object.entries(operatorServices).map(([value, v]) => ({ value, title: v.label }))];

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const has = (value, term) => !term || norm(value).includes(norm(term));
const hasAny = (values, term) => !term || values.some((v) => has(v, term));

const operatorRows = computed(() => {
  const f = applied.value;
  return list.value.filter(
    (o) =>
      has(o.taxId, f.taxId) &&
      has(o.branch, f.branch) &&
      hasAny([o.nameTh, o.nameEn], f.company) &&
      (f.access === "all" || o.access === f.access) &&
      (f.service === "all" || o.service === f.service)
  );
});
const thnswRows = computed(() => {
  const f = applied.value;
  return thnsw.value.filter(
    (o) => hasAny([o.profileId, o.nswId], f.keyword) && has(o.taxId, f.taxId) && hasAny([o.nameTh, o.nameEn], f.company)
  );
});
const historyRows = computed(() => {
  const f = applied.value;
  return history.value.filter((h) => has(h.taxId, f.taxId) && has(h.company, f.company));
});

const pendingCount = computed(() => thnsw.value.filter((o) => !o.decision).length);
const tabs = computed(() => [
  { value: "operators", label: t.tabs.operators, count: formatNumber(operatorTabCounts.operators + list.value.length - operators.length) },
  { value: "thnsw", label: t.tabs.thnsw, count: pendingCount.value },
  { value: "history", label: t.tabs.history },
]);

const k = t.kpi;
const kpis = computed(() => [
  { icon: "far fa-building", tone: "teal", label: k.registered.label, value: formatNumber(operatorKpis.registered.value), caption: k.registered.caption(operatorKpis.registered.exporters) },
  { icon: "fas fa-truck", tone: "blue", label: k.agents.label, value: formatNumber(operatorKpis.agents.value), caption: k.agents.caption(operatorKpis.agents.pairs) },
  { icon: "fas fa-user-check", tone: "amber", label: k.pendingThnsw.label, value: formatNumber(pendingCount.value), caption: k.pendingThnsw.caption },
  { icon: "fas fa-lock", tone: "red", label: k.suspended.label, value: formatNumber(operatorKpis.suspended.value) },
]);

// ---------- แจ้งผล ----------
const toast = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(toast, { show: true, text });

const logChange = (o, field, from, to) =>
  history.value.unshift({
    id: `h${Date.now()}${field}`,
    at: new Date().toISOString(),
    taxId: o.taxId,
    company: o.nameTh,
    field,
    from,
    to,
    by: session.user?.name ?? t.historyBy,
  });

// ---------- ดู / เพิ่ม / แก้ไข / ลบ ----------
const viewing = ref(null);
const viewOpen = ref(false);
const editing = ref(null);
const formOpen = ref(false);
const removing = ref(null);
const removeOpen = ref(false);

const view = (o) => {
  viewing.value = o;
  viewOpen.value = true;
};
const edit = (o) => {
  viewOpen.value = false;
  editing.value = o;
  formOpen.value = true;
};
const add = () => edit(null);

const fieldLabels = {
  branch: [t.filters.branch.label],
  nameTh: [t.dialogs.nameTh],
  nameEn: [t.dialogs.nameEn],
  nswId: [t.columns.nswId],
  type: [t.columns.type, operatorTypes],
  service: [t.columns.service, operatorServices],
  access: [t.columns.access, operatorAccess],
};
const display = (map, v) => (map ? map[v].label : v);

const save = (data) => {
  if (editing.value) {
    const target = list.value.find((o) => o.id === editing.value.id);
    Object.entries(fieldLabels).forEach(([key, [label, map]]) => {
      if (target[key] !== data[key]) logChange(data, label, display(map, target[key]), display(map, data[key]));
    });
    Object.assign(target, data);
    notify(t.toast.saved(data.nameTh));
  } else {
    list.value.unshift({ ...data, id: `${data.taxId}-${data.branch}` });
    notify(t.toast.added(data.nameTh));
  }
  formOpen.value = false;
};

const askRemove = (o) => {
  removing.value = o;
  removeOpen.value = true;
};
const confirmRemove = () => {
  list.value = list.value.filter((o) => o.id !== removing.value.id);
  notify(t.toast.deleted(removing.value.nameTh));
  removeOpen.value = false;
};

// ---------- อนุมัติ / ไม่อนุมัติ THNSW ----------
const deciding = ref(null);
const decision = ref("approved");
const decideOpen = ref(false);
const reason = ref("");

const askDecision = (o, value) => {
  deciding.value = o;
  decision.value = value;
  reason.value = "";
  decideOpen.value = true;
};
const confirmDecision = () => {
  const o = deciding.value;
  o.decision = decision.value;
  const th = t.thnsw;
  logChange(o, t.tabs.thnsw, th.pending.label, th[decision.value].label);
  if (decision.value === "approved") {
    list.value.unshift({ ...o, id: `${o.taxId}-${o.branch}`, service: o.type === "exporter" ? "certificate" : "onBehalf", access: "active", lastRequestAt: null });
    notify(th.approvedToast(o.nameTh));
  } else {
    notify(th.rejectedToast(o.nameTh));
  }
  decideOpen.value = false;
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-download" :disabled="!operatorRows.length" @click="notify(t.toast.exported)">
          {{ common.actions.exportExcel }}
        </SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="add">
          {{ t.addOperator }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mb-2">
      <v-col v-for="kpi in kpis" :key="kpi.label" cols="12" sm="6" lg="3">
        <KpiCard v-bind="kpi" />
      </v-col>
    </v-row>

    <FilterCard @search="search" @reset="reset">
      <v-col v-if="tab !== 'operators'" cols="12" sm="6" md>
        <FieldLabel :label="t.filters.keyword.label" for="op-keyword" />
        <v-text-field id="op-keyword" v-model="form.keyword" :placeholder="t.filters.keyword.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.taxId.label" for="op-tax" />
        <v-text-field id="op-tax" v-model="form.taxId" :placeholder="t.filters.taxId.placeholder" inputmode="numeric" hide-details />
      </v-col>
      <v-col v-if="tab === 'operators'" cols="12" sm="6" md="2" lg="1">
        <FieldLabel :label="t.filters.branch.label" for="op-branch" />
        <v-text-field id="op-branch" v-model="form.branch" :placeholder="t.filters.branch.placeholder" hide-details />
      </v-col>
      <v-col cols="12" sm="6" md>
        <FieldLabel :label="t.filters.company.label" for="op-company" />
        <v-text-field id="op-company" v-model="form.company" :placeholder="t.filters.company.placeholder" hide-details />
      </v-col>
      <template v-if="tab === 'operators'">
        <v-col cols="12" sm="6" md>
          <FieldLabel :label="t.filters.access.label" for="op-access" />
          <v-select id="op-access" v-model="form.access" :items="accessItems" hide-details />
        </v-col>
        <v-col cols="12" sm="6" md>
          <FieldLabel :label="t.filters.service.label" for="op-service" />
          <v-select id="op-service" v-model="form.service" :items="serviceItems" hide-details />
        </v-col>
      </template>
    </FilterCard>

    <SectionCard flush>
      <div class="px-2 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>

      <OperatorTable v-if="tab === 'operators'" :items="operatorRows" @view="view" @edit="edit" @remove="askRemove">
        <template #empty>
          <EmptyState :icon="t.empty.icon" :title="t.empty.title" :description="t.empty.description" class="operators__empty">
            <template v-if="isFiltered" #actions>
              <SecondaryButton icon="fas fa-rotate" height="control-md" @click="reset">{{ t.empty.clear }}</SecondaryButton>
            </template>
          </EmptyState>
        </template>
      </OperatorTable>

      <ThnswTable
        v-else-if="tab === 'thnsw'"
        :items="thnswRows"
        @approve="(o) => askDecision(o, 'approved')"
        @reject="(o) => askDecision(o, 'rejected')"
      >
        <template #empty>
          <EmptyState
            :icon="t.empty.icon"
            :title="isFiltered ? t.empty.title : t.empty.thnswTitle"
            :description="isFiltered ? t.empty.description : t.empty.thnswDescription"
            class="operators__empty"
          />
        </template>
      </ThnswTable>

      <OperatorHistoryTable v-else :items="historyRows">
        <template #empty>
          <EmptyState :icon="t.empty.icon" :title="t.empty.historyTitle" :description="t.empty.description" class="operators__empty" />
        </template>
      </OperatorHistoryTable>
    </SectionCard>

    <OperatorDetailDialog v-model="viewOpen" :operator="viewing" @edit="edit" />
    <OperatorFormDialog v-model="formOpen" :operator="editing" @save="save" />
    <ConfirmDialog
      v-model="removeOpen"
      :title="t.dialogs.deleteTitle"
      :message="removing ? t.dialogs.deleteBody(removing.nameTh) : ''"
      :confirm-text="t.dialogs.deleteConfirm"
      icon="far fa-trash-can"
      tone="error"
      @confirm="confirmRemove"
    />
    <ConfirmDialog
      v-model="decideOpen"
      :title="decision === 'approved' ? t.thnsw.approveTitle : t.thnsw.rejectTitle"
      :message="deciding ? t.thnsw[decision === 'approved' ? 'approveBody' : 'rejectBody'](deciding.nameTh) : ''"
      :confirm-text="decision === 'approved' ? t.thnsw.approve : t.thnsw.reject"
      :icon="decision === 'approved' ? 'fas fa-user-check' : 'fas fa-user-xmark'"
      :tone="decision === 'approved' ? 'primary' : 'error'"
      :disabled="decision === 'rejected' && !reason.trim()"
      @confirm="confirmDecision"
    >
      <template v-if="decision === 'rejected'" #default>
        <FieldLabel :label="t.thnsw.reasonLabel" for="thnsw-reason" required />
        <v-textarea id="thnsw-reason" v-model="reason" :placeholder="t.thnsw.reasonPlaceholder" rows="3" auto-grow hide-details />
      </template>
    </ConfirmDialog>

    <v-snackbar v-model="toast.show" location="bottom right">{{ toast.text }}</v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.operators__empty {
  white-space: normal;
}
.operators__empty :deep(h1) {
  font-size: var(--pf-type-h4-size);
  line-height: var(--pf-type-h4-line);
}
</style>
