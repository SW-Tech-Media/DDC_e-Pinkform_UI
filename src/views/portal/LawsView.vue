<script setup>
// P-05 · กฎหมายและคู่มือที่เกี่ยวข้อง (ยังไม่มีดีไซน์ใน Figma)
// แท็บ กฎหมาย / ประกาศ / ระเบียบ / คู่มือการใช้งาน (TOR 10.4.1.1) พร้อมตัวนับ · ค้นหาชื่อเอกสาร
// ดาวน์โหลด PDF จำลองด้วย snackbar · เปิดแท็บตรงได้ด้วย ?tab=manual
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import IconTile from "@/components/IconTile.vue";
import FileItem from "@/components/portal-pages/FileItem.vue";
import { lawsText as t } from "@/content/portal-pages.js";
import { lawsContact, legalDocuments } from "@/mocks/portal-pages.js";
import { formatShortThaiDate } from "@/utils/format.js";

const route = useRoute();
const tab = ref(t.tabs.some((x) => x.value === route.query.tab) ? route.query.tab : t.tabs[0].value);
const query = ref("");

const matches = computed(() => {
  const q = (query.value ?? "").trim().toLowerCase();
  return legalDocuments.filter((d) => !q || d.title.toLowerCase().includes(q));
});
const tabs = computed(() => t.tabs.map((x) => ({ ...x, count: matches.value.filter((d) => d.type === x.value).length })));
const docs = computed(() =>
  matches.value.filter((d) => d.type === tab.value).sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.date.localeCompare(a.date)),
);

const snackbar = ref(false);
const snackText = ref("");
function download(doc) {
  snackText.value = t.downloaded(doc.title);
  snackbar.value = true;
}
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="t.breadcrumb" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <v-card class="pf-bordered pf-elevation-card">
        <!-- แท็บ + ค้นหา -->
        <div class="d-flex flex-column flex-md-row align-md-center ga-3 px-4 px-md-6 pt-3 pf-bordered-bottom">
          <StatusTabs v-model="tab" :tabs="tabs" class="flex-grow-1 tabs" />
          <v-text-field
            v-model="query"
            :placeholder="t.search"
            :aria-label="t.search"
            prepend-inner-icon="fas fa-magnifying-glass"
            density="compact"
            hide-details
            clearable
            class="search mb-3"
          />
        </div>

        <div class="pa-4 pa-md-6">
          <AlertBox v-if="tab === 'manual'" tone="info" :title="t.manualNote.title" icon="fas fa-book" class="mb-4">
            {{ t.manualNote.body }}
          </AlertBox>

          <div v-if="docs.length" class="d-flex flex-column">
            <FileItem
              v-for="(d, i) in docs"
              :key="d.id"
              :title="d.title"
              :meta="[d.issuer, `${tab === 'manual' ? t.updated : t.published} ${formatShortThaiDate(d.date)}`, d.size]"
              :action="t.download"
              class="py-4"
              :class="{ 'pf-bordered-top': i }"
              @download="download(d)"
            />
          </div>
          <EmptyState v-else :icon="t.empty.icon" tone="neutral" :title="t.empty.title" :description="t.empty.description" />
        </div>

        <div class="d-flex align-center flex-wrap ga-4 px-4 px-md-6 py-4 pf-bordered-top bg-bg-surface-muted rounded-b-lg">
          <IconTile icon="fas fa-headset" tone="pink" />
          <div class="flex-grow-1">
            <p class="pf-type-body-md-strong text-text-primary">{{ t.help.title }}</p>
            <p class="pf-type-body-sm text-text-secondary">{{ t.help.description }}</p>
          </div>
          <div class="d-flex flex-wrap align-center ga-4 pf-type-body-sm text-text-primary">
            <span v-for="c in lawsContact" :key="c.label" class="d-inline-flex align-center ga-2">
              <v-icon :icon="c.icon" size="small" color="icon-brand" />
              {{ c.label }}
            </span>
            <v-btn variant="text" class="text-text-brand" append-icon="fas fa-chevron-right" :to="t.help.surveyTo">
              {{ t.help.survey }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <v-snackbar v-model="snackbar" color="primary" :timeout="2500">
      <v-icon icon="fas fa-circle-check" start />
      {{ snackText }}
    </v-snackbar>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.tabs {
  min-width: 0;
  max-width: 100%;
}
.search {
  flex: 0 1 auto;
  width: var(--pf-size-desktop-search);
  max-width: 100%;
}
</style>
