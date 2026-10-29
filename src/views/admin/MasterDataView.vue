<script setup>
// B-15 · ข้อมูลหลักอื่น ๆ (Figma ยังไม่มี — ออกแบบตามสไตล์ D14/D15) — TOR 4.4.8 (1)–(5), (7)–(14)
// (6) พื้นที่โรคระบาด เป็นลิงก์ไปหน้า B-14 · รองรับ query ?set=<key>
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import FilterCard from "@/components/FilterCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import MasterDataMenu from "@/components/master-data/MasterDataMenu.vue";
import MasterDataTable from "@/components/master-data/MasterDataTable.vue";
import MasterDataFormDialog from "@/components/master-data/MasterDataFormDialog.vue";
import OrgProfileCard from "@/components/master-data/OrgProfileCard.vue";
import { masterText as t } from "@/content/master-data.js";
import { ddcOrganization, masterRows } from "@/mocks/master-data.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const session = useSessionStore();
session.signInAs("thanakorn");
const { lgAndUp } = useDisplay();

// ---------- ข้อมูล (แก้ไขได้ระหว่างใช้งาน Prototype) ----------
const org = ref({ ...ddcOrganization });
const data = reactive(Object.fromEntries(Object.entries(masterRows).map(([k, rows]) => [k, rows.map((r) => ({ ...r }))])));
const counts = computed(() => Object.fromEntries(Object.entries(data).map(([k, rows]) => [k, rows.length])));

const active = ref(t.datasets.some((d) => d.key === route.query.set && d.kind !== "link") ? route.query.set : "org");
const dataset = computed(() => t.datasets.find((d) => d.key === active.value));

// สิทธิ์: รหัสข้อความตอบกลับ เพิ่ม/ลบ ได้เฉพาะ Admin
const isAdmin = computed(() => /admin/i.test(session.user?.role ?? ""));
const canAddRemove = computed(() => !dataset.value?.adminOnly || isAdmin.value);

// ---------- ค้นหา (กดปุ่มค้นหาจึงมีผล — รีเซ็ตเมื่อเปลี่ยนชุดข้อมูล) ----------
const form = reactive({});
const applied = ref({});
const resetSearch = () => {
  Object.keys(form).forEach((k) => delete form[k]);
  (dataset.value?.search ?? []).forEach((s) => (form[s.id] = ""));
  applied.value = { ...form };
};
watch(active, resetSearch, { immediate: true });
const search = () => (applied.value = { ...form });

const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
const rows = computed(() => {
  const d = dataset.value;
  if (d.kind) return [];
  return data[d.key].filter((r) =>
    d.search.every((s) => {
      const term = norm(applied.value[s.id]);
      if (!term) return true;
      const keys = s.keys === "*" ? Object.keys(r).filter((k) => k !== "id") : s.keys;
      return keys.some((k) => norm(r[k]).includes(term));
    })
  );
});

// ---------- แจ้งผล ----------
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- หน่วยงาน DDC ----------
const saveOrg = (draft) => {
  org.value = { ...draft, savedAt: new Date().toISOString(), savedBy: session.user.name };
  notify(t.toast.orgSaved);
};

// ---------- เพิ่ม / แก้ไข / ลบ ----------
const editor = reactive({ open: false, item: null });
const openEditor = (item = null) => Object.assign(editor, { open: true, item });
const nameOf = (r) => r[dataset.value.nameKey];
const saveRow = (draft) => {
  const list = data[active.value];
  if (editor.item) {
    Object.assign(list.find((r) => r.id === editor.item.id), draft);
    notify(t.toast.saved(nameOf(draft)));
  } else {
    const id = Math.max(0, ...list.map((r) => r.id)) + 1;
    const seq = Math.max(0, ...list.map((r) => r.seq)) + 1;
    list.push({ ...draft, id, seq });
    notify(t.toast.added(nameOf(draft)));
  }
};

const removing = reactive({ open: false, item: null });
const askRemove = (item) => Object.assign(removing, { open: true, item });
const remove = () => {
  const list = data[active.value];
  list.splice(list.findIndex((r) => r.id === removing.item.id), 1);
  list.forEach((r, i) => (r.seq = i + 1));
  notify(t.toast.deleted(nameOf(removing.item)));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description" />

    <v-row>
      <v-col cols="12" lg="3">
        <div :class="{ 'master__menu': lgAndUp }">
          <MasterDataMenu v-model="active" :datasets="t.datasets" :counts="counts" />
        </div>
      </v-col>

      <v-col cols="12" lg="9" class="min-w-0">
        <OrgProfileCard v-if="dataset.kind === 'form'" :org="org" @save="saveOrg" />

        <template v-else>
          <FilterCard @search="search" @reset="resetSearch">
            <v-col v-for="s in dataset.search" :key="`${active}-${s.id}`" cols="12" sm="6" md>
              <FieldLabel :label="s.label" :for="`mds-${s.id}`" />
              <v-text-field
                :id="`mds-${s.id}`"
                v-model="form[s.id]"
                :placeholder="s.placeholder"
                prepend-inner-icon="fas fa-magnifying-glass"
                hide-details
              />
            </v-col>
          </FilterCard>

          <AlertBox v-if="dataset.adminOnly" tone="info" icon="fas fa-user-shield" :title="t.adminOnlyBadge" class="mb-6">
            {{ t.adminOnlyInfo }}
          </AlertBox>

          <SectionCard flush>
            <template #header>
              <div class="d-flex align-center ga-3 min-w-0">
                <v-icon :icon="dataset.icon" color="icon-brand" size="small" />
                <div class="min-w-0">
                  <h2 class="pf-type-h4 text-text-primary">
                    {{ dataset.label }}
                    <span class="pf-type-body-sm text-text-tertiary">{{ t.torNo(dataset.no) }}</span>
                  </h2>
                  <p class="pf-type-caption text-text-tertiary">{{ dataset.description }} · {{ t.count(rows.length) }}</p>
                </div>
              </div>
            </template>
            <template #actions>
              <StatusBadge v-if="dataset.adminOnly" tone="accent" dot>{{ t.adminOnlyBadge }}</StatusBadge>
              <v-btn
                color="primary"
                prepend-icon="fas fa-plus"
                :height="size['control-md']"
                :disabled="!canAddRemove"
                @click="openEditor()"
              >
                {{ t.add }}
              </v-btn>
            </template>
            <MasterDataTable
              :key="active"
              :dataset="dataset"
              :items="rows"
              :can-remove="canAddRemove"
              @edit="openEditor"
              @remove="askRemove"
            />
          </SectionCard>

          <MasterDataFormDialog
            v-model="editor.open"
            :dataset="dataset"
            :item="editor.item"
            :existing="data[active]"
            @save="saveRow"
          />
        </template>
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="removing.open"
      :title="t.confirmDelete.title"
      :message="removing.item ? t.confirmDelete.message(dataset.label, nameOf(removing.item)) : ''"
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
.master__menu {
  position: sticky;
  top: calc(var(--pf-size-topbar) + var(--pf-space-24));
}
</style>
