<script setup>
// D14 · Admin / Outbreak Areas – Manage (B-14) — Figma node 20:3753
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import DateField from "@/components/DateField.vue";
import OutbreakAreaForm from "@/components/outbreak/OutbreakAreaForm.vue";
import { addDays, daysBetween } from "@/components/outbreak/outbreak-utils.js";
import { outbreakText as t } from "@/content/outbreak-areas.js";
import {
  diseaseFreeDays,
  geography,
  outbreakAreas,
  outbreakDraft,
  outbreakFilterRange,
  outbreakNow,
  outbreakToday,
} from "@/mocks/outbreak-areas.js";
import { formatDate, formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";
import { useDisplay } from "vuetify";

// สัดส่วนคอลัมน์ตาม Figma (ฟอร์ม 30% / รายการ 70%) บนจอใหญ่
const { lgAndUp } = useDisplay();
const colStyle = (pct) => (lgAndUp.value ? { flex: `0 0 ${pct}%`, maxWidth: `${pct}%` } : undefined);

const session = useSessionStore();
session.signInAs("somchai");

// ---------- ข้อมูลหลัก ----------
const provinceOf = (code) => geography.find((p) => p.code === code);
const districtOf = (p, code) => provinceOf(p)?.districts.find((d) => d.code === code);
const subdistrictOf = (p, d, code) => districtOf(p, d)?.subdistricts.find((s) => s.code === code);
const opt = (x) => ({ title: t.option(x.name, x.code), value: x.code });
const withAll = (list) => [{ title: t.filters.all, value: null }, ...list];

// ---------- รายการ ----------
const rows = ref(outbreakAreas.map((a) => ({ ...a })));
let nextId = Math.max(...outbreakAreas.map((a) => a.id)) + 1;

const decorate = (a) => {
  const freeOn = addDays(a.occurredOn, diseaseFreeDays);
  const daysLeft = daysBetween(outbreakToday, freeOn);
  const p = provinceOf(a.province);
  const d = districtOf(a.province, a.district);
  const s = subdistrictOf(a.province, a.district, a.subdistrict);
  return {
    ...a,
    freeOn,
    daysLeft,
    isFree: daysLeft <= 0,
    areaName: t.area(s?.name, d?.name),
    areaCaption: t.areaCaption(p?.name, a.summary),
  };
};
const items = computed(() => rows.value.map(decorate));

// ---------- ตัวกรอง (กดปุ่มค้นหาจึงมีผล) ----------
const blankFilter = () => ({ province: null, district: null, subdistrict: null, range: [...outbreakFilterRange] });
const draft = reactive(blankFilter());
const applied = ref(blankFilter());
const fProvinces = withAll(geography.map(opt));
const fDistricts = computed(() => withAll(provinceOf(draft.province)?.districts.map(opt) ?? []));
const fSubdistricts = computed(() =>
  withAll(districtOf(draft.province, draft.district)?.subdistricts.map(opt) ?? [])
);
const pickFilterProvince = (v) => Object.assign(draft, { province: v, district: null, subdistrict: null });
const pickFilterDistrict = (v) => Object.assign(draft, { district: v, subdistrict: null });
const search = () => (applied.value = { ...draft, range: draft.range ? [...draft.range] : null });

const matched = computed(() => {
  const f = applied.value;
  return items.value.filter(
    (a) =>
      (!f.province || a.province === f.province) &&
      (!f.district || a.district === f.district) &&
      (!f.subdistrict || a.subdistrict === f.subdistrict) &&
      (!f.range || (a.occurredOn >= f.range[0] && a.occurredOn <= f.range[1]))
  );
});

const tab = ref("all");
const tabs = computed(() => [
  { value: "all", label: t.tabs.all, count: matched.value.length },
  { value: "active", label: t.tabs.active, count: matched.value.filter((a) => !a.isFree).length },
  { value: "free", label: t.tabs.free, count: matched.value.filter((a) => a.isFree).length },
]);
const visible = computed(() =>
  matched.value.filter((a) => tab.value === "all" || (tab.value === "free") === a.isFree)
);

// ---------- ฟอร์ม ----------
const blankForm = () => ({ province: null, district: null, subdistrict: null, description: "", occurredOn: null });
const form = ref({ ...outbreakDraft });
const editingId = ref(null);
const formKey = ref(0);

const shortName = (name) => {
  const [first, last = ""] = name.split(" ");
  return last ? `${first} ${last[0]}.` : first;
};
const recorderLine = computed(() => t.form.recorder(session.user.name, formatDateTime(outbreakNow)));

// แถวที่กำลังแก้ไข หรืออยู่ในตำบลเดียวกับที่เลือกในฟอร์ม → ไฮไลต์
const rowClass = (item) =>
  item.id === editingId.value || (!editingId.value && item.subdistrict === form.value.subdistrict)
    ? "pf-row-highlight"
    : "";

const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

const clearForm = () => {
  form.value = blankForm();
  editingId.value = null;
  formKey.value++;
};

// ข้อความสั้นใต้ชื่อพื้นที่: ตัดคำนำ "รายงานผู้ป่วย" และวงเล็บแหล่งข้อมูลออก
const summarize = (text) => text.replace(/\s*\(.*?\)\s*/g, " ").replace(/^รายงานผู้ป่วย/, "").trim();

const save = () => {
  const data = {
    ...form.value,
    summary: summarize(form.value.description),
    recorder: shortName(session.user.name),
    recordedAt: outbreakNow,
  };
  if (editingId.value) {
    const i = rows.value.findIndex((r) => r.id === editingId.value);
    const old = rows.value[i];
    rows.value[i] = { ...old, ...data, summary: data.description === old.description ? old.summary : data.summary };
    notify(t.form.updated);
  } else {
    rows.value.unshift({ id: nextId++, ...data });
    notify(t.form.saved);
  }
  clearForm();
};

const edit = (item) => {
  const { province, district, subdistrict, description, occurredOn } = item;
  form.value = { province, district, subdistrict, description, occurredOn };
  editingId.value = item.id;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const removing = reactive({ open: false, item: null });
const askRemove = (item) => Object.assign(removing, { open: true, item });
const remove = () => {
  rows.value = rows.value.filter((r) => r.id !== removing.item.id);
  if (editingId.value === removing.item.id) clearForm();
  notify(t.confirmDelete.done);
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton prepend-icon="fas fa-download" @click="notify(t.exported(visible.length))">{{ t.export }}</SecondaryButton>
      </template>
    </PageHeader>

    <v-row>
      <v-col cols="12" lg="4" :style="colStyle(30)">
        <OutbreakAreaForm
          :key="formKey"
          v-model="form"
          :editing="!!editingId"
          :recorder="recorderLine"
          @save="save"
          @clear="clearForm"
        />
      </v-col>

      <v-col cols="12" lg="8" :style="colStyle(70)">
        <v-card class="pf-bordered">
          <v-form class="px-6 pt-6 pb-2" @submit.prevent="search">
            <v-row dense align="end">
              <v-col cols="12" sm="6" md>
                <FieldLabel :label="t.filters.province" for="obf-province" />
                <v-autocomplete
                  id="obf-province"
                  :model-value="draft.province"
                  :items="fProvinces"
                  hide-details
                  @update:model-value="pickFilterProvince"
                />
              </v-col>
              <v-col cols="12" sm="6" md>
                <FieldLabel :label="t.filters.district" for="obf-district" />
                <v-autocomplete
                  id="obf-district"
                  :model-value="draft.district"
                  :items="fDistricts"
                  hide-details
                  @update:model-value="pickFilterDistrict"
                />
              </v-col>
              <v-col cols="12" sm="6" md>
                <FieldLabel :label="t.filters.subdistrict" for="obf-subdistrict" />
                <v-autocomplete id="obf-subdistrict" v-model="draft.subdistrict" :items="fSubdistricts" hide-details />
              </v-col>
              <v-col cols="10" sm="5" md>
                <FieldLabel :label="t.filters.date" for="obf-date" />
                <DateField id="obf-date" v-model="draft.range" range clearable />
              </v-col>
              <v-col cols="2" sm="1" md="auto">
                <v-btn
                  type="submit"
                  color="primary"
                  icon="fas fa-magnifying-glass"
                  rounded="lg"
                  :width="size['control-lg']"
                  :height="size['control-lg']"
                  :aria-label="t.filters.search"
                />
              </v-col>
            </v-row>
          </v-form>

          <div class="px-4 pf-bordered-bottom">
            <StatusTabs v-model="tab" :tabs="tabs" />
          </div>

          <AppDataTable :headers="t.headers" :items="visible" :row-class="rowClass" :per-page="20" class="outbreak-table">
            <template #item.area="{ item }">
              <div class="py-3 area">
                <div class="pf-type-body-sm-strong text-truncate">{{ item.areaName }}</div>
                <div class="pf-type-caption text-text-tertiary">{{ item.areaCaption }}</div>
              </div>
            </template>
            <template #item.occurredOn="{ item }">{{ formatDate(item.occurredOn) }}</template>
            <template #item.freeOn="{ item }">
              <span class="pf-type-body-sm-strong">{{ formatDate(item.freeOn) }}</span>
            </template>
            <template #item.status="{ item }">
              <StatusBadge v-if="item.isFree" tone="success" dot>{{ t.status.free }}</StatusBadge>
              <StatusBadge v-else tone="danger" dot>{{ t.status.active(item.daysLeft) }}</StatusBadge>
            </template>
            <template #item.recorder="{ item }">
              <div class="pf-type-body-sm-strong">{{ item.recorder }}</div>
              <div class="pf-type-caption text-text-tertiary">{{ formatDate(item.recordedAt) }}</div>
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex justify-center ga-2">
                <TableIconButton icon="fas fa-pen" :label="t.edit" @click="edit(item)" />
                <TableIconButton icon="far fa-trash-can" :label="t.remove" @click="askRemove(item)" />
              </div>
            </template>
            <template #no-data>
              <EmptyState icon="fas fa-magnifying-glass" tone="neutral" :title="t.noData" />
            </template>
          </AppDataTable>
        </v-card>
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="removing.open"
      :title="t.confirmDelete.title"
      :message="removing.item ? t.confirmDelete.message(removing.item.areaName) : ''"
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
.outbreak-table :deep(td) {
  white-space: nowrap;
}
.outbreak-table :deep(th),
.outbreak-table :deep(td) {
  padding-inline: var(--pf-space-8) !important;
}
.outbreak-table :deep(th:first-child),
.outbreak-table :deep(td:first-child) {
  padding-inline-start: var(--pf-space-12) !important;
}
.area {
  white-space: normal;
  min-width: var(--pf-space-120);
  max-width: calc(var(--pf-space-120) + var(--pf-space-24));
}
</style>
