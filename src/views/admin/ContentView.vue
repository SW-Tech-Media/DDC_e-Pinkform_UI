<script setup>
// B-21 · จัดการเนื้อหาเว็บไซต์ (เสนอเพิ่ม — ยังไม่มีใน Figma) — TOR 4.5, 4.5.1
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import AlertBox from "@/components/AlertBox.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ContentFormDialog from "@/components/content-admin/ContentFormDialog.vue";
import { contentAdminText as t } from "@/content/content-admin.js";
import { contentCategories, contentItems, contentNow, contentSections, contentStatuses } from "@/mocks/content-admin.js";
import { formatDate, formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

const session = useSessionStore();
session.signInAs("somrudee");
const router = useRouter();

const list = ref(contentItems.map((c) => ({ ...c, attachments: [...c.attachments] })));
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });

// ---------- แท็บ / ตัวกรอง ----------
const tab = ref("news");
const tabs = computed(() =>
  contentSections.map((s) => ({ value: s, label: t.tabs[s], count: list.value.filter((c) => c.section === s).length }))
);
const filters = reactive({ q: "", category: null, status: null });
watch(tab, () => (filters.category = null));
const categoryItems = computed(() => [
  { title: t.filters.allCategories, value: null },
  ...contentCategories[tab.value].map((c) => ({ title: c, value: c })),
]);
const statusItems = [
  { title: t.filters.allStatuses, value: null },
  ...Object.entries(contentStatuses).map(([value, s]) => ({ title: s.label, value })),
];
const visible = computed(() => {
  const q = filters.q.trim().toLowerCase();
  return list.value
    .filter(
      (c) =>
        c.section === tab.value &&
        (!q || c.title.toLowerCase().includes(q)) &&
        (!filters.category || c.category === filters.category) &&
        (!filters.status || c.status === filters.status)
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
});
const isScheduled = (c) => c.status === "published" && c.publishedOn > contentNow.slice(0, 10);

// ---------- ดูตัวอย่างบนเว็บ ----------
const previewTo = (c) =>
  c?.section === "news" ? { name: "portal-news-detail", params: { id: c.newsId ?? String(c.id) } } : { name: "portal-laws" };
const preview = (c) => window.open(router.resolve(previewTo(c)).href, "_blank");

// ---------- เพิ่ม / แก้ไข / ลบ ----------
const editor = reactive({ open: false, item: null });
const openEditor = (item = null) => Object.assign(editor, { open: true, item });
const save = (data) => {
  const stamp = { editor: session.user.name, updatedAt: contentNow };
  if (editor.item) {
    Object.assign(list.value.find((c) => c.id === editor.item.id), data, stamp);
    notify(t.form.updated(data.title));
  } else {
    const id = Math.max(...list.value.map((c) => c.id)) + 1;
    list.value.unshift({ ...data, ...stamp, id, section: tab.value, newsId: `N${String(id).padStart(3, "0")}` });
    filters.status = null;
    notify(t.form.added(data.title));
  }
};
const removing = reactive({ open: false, item: null });
const askRemove = (item) => Object.assign(removing, { open: true, item });
const remove = () => {
  list.value = list.value.filter((c) => c.id !== removing.item.id);
  notify(t.confirmDelete.done(removing.item.title));
};
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton icon="fas fa-arrow-up-right-from-square" @click="preview(tab === 'news' ? visible[0] : { section: tab })">
          {{ t.actions.previewSite }}
        </SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="openEditor()">
          {{ t.actions.add }}
        </v-btn>
      </template>
    </PageHeader>

    <v-card class="pf-bordered">
      <div class="px-4 pf-bordered-bottom">
        <StatusTabs v-model="tab" :tabs="tabs" />
      </div>

      <v-row dense class="pa-5">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="filters.q"
            :placeholder="t.filters.search"
            :aria-label="t.filters.search"
            prepend-inner-icon="fas fa-magnifying-glass"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select v-model="filters.category" :items="categoryItems" :aria-label="t.filters.allCategories" hide-details />
        </v-col>
        <v-col cols="6" md="3">
          <v-select v-model="filters.status" :items="statusItems" :aria-label="t.filters.allStatuses" hide-details />
        </v-col>
      </v-row>

      <AppDataTable :headers="t.headers" :items="visible" :per-page="10" :show-per-page="false" class="content-table">
        <template #item.title="{ item }">
          <div class="title-cell py-3">
            <div class="pf-type-body-sm-strong">{{ item.title }}</div>
            <div v-if="item.attachments.length" class="pf-type-caption text-text-tertiary">
              <v-icon icon="fas fa-paperclip" size="x-small" class="me-1" />{{ t.attachments(item.attachments.length) }}
            </div>
          </div>
        </template>
        <template #item.publishedOn="{ item }">
          <div class="text-no-wrap">{{ formatDate(item.publishedOn) }}</div>
          <div v-if="isScheduled(item)" class="pf-type-caption text-status-info-fg">{{ t.scheduled }}</div>
        </template>
        <template #item.status="{ item }">
          <StatusBadge :tone="contentStatuses[item.status].tone" dot>{{ contentStatuses[item.status].label }}</StatusBadge>
        </template>
        <template #item.editor="{ item }">
          <div class="text-no-wrap">{{ item.editor }}</div>
          <div class="pf-type-caption text-text-tertiary text-no-wrap">{{ formatDateTime(item.updatedAt) }}</div>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center ga-2">
            <TableIconButton icon="far fa-eye" :label="t.preview" @click="preview(item)" />
            <TableIconButton icon="far fa-pen-to-square" :label="t.edit" @click="openEditor(item)" />
            <TableIconButton icon="far fa-trash-can" :label="t.remove" tone="status-danger-fg" @click="askRemove(item)" />
          </div>
        </template>
        <template #no-data>
          <EmptyState icon="far fa-folder-open" tone="neutral" :title="t.noData" />
        </template>
      </AppDataTable>

      <div class="pa-4 pf-bordered-top">
        <AlertBox tone="info">{{ t.info }}</AlertBox>
      </div>
    </v-card>

    <ContentFormDialog v-model="editor.open" :section="tab" :item="editor.item" @save="save" />

    <ConfirmDialog
      v-model="removing.open"
      :title="t.confirmDelete.title"
      :message="removing.item ? t.confirmDelete.message(removing.item.title) : ''"
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
.content-table :deep(th),
.content-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.content-table :deep(td) {
  white-space: nowrap;
}
.title-cell {
  white-space: normal;
  min-width: calc(var(--pf-space-120) * 2);
  max-width: calc(var(--pf-space-120) * 4);
}
</style>
