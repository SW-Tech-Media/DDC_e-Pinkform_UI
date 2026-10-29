<script setup>
// P-04 · รายละเอียดข่าว (route portal-news-detail · params id) — ยังไม่มีดีไซน์ใน Figma
// รองรับ id แบบ "N001" และเลขลำดับ "1" · ไม่พบข่าว → EmptyState · ไฟล์แนบจำลองการดาวน์โหลดด้วย snackbar
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import NewsCover from "@/components/portal-pages/NewsCover.vue";
import FileItem from "@/components/portal-pages/FileItem.vue";
import RelatedNewsItem from "@/components/portal-pages/RelatedNewsItem.vue";
import { newsDetailText as t, newsText } from "@/content/portal-pages.js";
import { newsList } from "@/mocks/portal-pages.js";
import { formatNumber, formatThaiDate } from "@/utils/format.js";

const route = useRoute();

const item = computed(() => {
  const id = String(route.params.id ?? "").toUpperCase();
  return newsList.find((n) => n.id === id || String(Number(n.id.slice(1))) === id) ?? null;
});

// ข่าวหมวดเดียวกันก่อน แล้วตามด้วยข่าวล่าสุด (สูงสุด 4 ข่าว)
const related = computed(() => {
  if (!item.value) return [];
  const others = newsList.filter((n) => n.id !== item.value.id);
  const same = others.filter((n) => n.category === item.value.category);
  return [...same, ...others.filter((n) => n.category !== item.value.category)].slice(0, 4);
});

const crumbs = computed(() => t.breadcrumb(item.value ? item.value.category : t.notFound.title));

const snackbar = ref(false);
const snackText = ref("");
function download(file) {
  snackText.value = t.downloaded(file.name);
  snackbar.value = true;
}
const fileIcon = (name) => (name.endsWith(".pdf") ? ["far fa-file-pdf", "red"] : ["far fa-file-word", "blue"]);
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.heroTitle" :breadcrumb="crumbs" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <!-- ไม่พบข่าว -->
      <v-card v-if="!item" class="pf-bordered pf-elevation-card">
        <EmptyState v-bind="t.notFound">
          <template #actions>
            <v-btn color="primary" prepend-icon="fas fa-arrow-left" :to="{ name: 'portal-news' }">{{ t.back }}</v-btn>
          </template>
        </EmptyState>
      </v-card>

      <v-row v-else>
        <!-- เนื้อหาข่าว -->
        <v-col cols="12" md="8">
          <v-card class="pf-bordered pf-elevation-card pa-4 pa-md-8">
            <NewsCover :icon="item.icon" :cover="item.cover" />

            <div class="d-flex align-center flex-wrap ga-3 mt-6">
              <StatusBadge tone="accent">{{ item.category }}</StatusBadge>
              <span class="d-inline-flex align-center ga-2 pf-type-caption text-text-tertiary">
                <v-icon icon="far fa-calendar" size="x-small" />
                {{ t.published }} {{ formatThaiDate(item.date) }}
              </span>
              <span class="d-inline-flex align-center ga-2 pf-type-caption text-text-tertiary">
                <v-icon icon="far fa-eye" size="x-small" />
                {{ t.views(formatNumber(item.views)) }}
              </span>
            </div>

            <h2 class="pf-type-h2 text-text-primary mt-3">{{ item.title }}</h2>

            <div class="d-flex flex-column ga-4 mt-6">
              <p v-for="(p, i) in item.body" :key="i" class="pf-type-body-lg text-text-secondary">{{ p }}</p>
            </div>
            <p class="pf-type-caption text-text-tertiary mt-6">{{ t.source }}</p>

            <!-- ไฟล์แนบ -->
            <template v-if="item.attachments.length">
              <v-divider class="my-6" />
              <h3 class="pf-type-h4 text-text-primary mb-4">{{ t.attachments }} ({{ item.attachments.length }})</h3>
              <div class="d-flex flex-column ga-3">
                <FileItem
                  v-for="f in item.attachments"
                  :key="f.name"
                  :title="f.name"
                  :meta="[f.size]"
                  :icon="fileIcon(f.name)[0]"
                  :tone="fileIcon(f.name)[1]"
                  :action="t.download"
                  class="pa-4 rounded-lg pf-bordered"
                  @download="download(f)"
                />
              </div>
            </template>

            <v-divider class="my-6" />
            <SecondaryButton icon="fas fa-arrow-left" :to="{ name: 'portal-news' }">{{ t.back }}</SecondaryButton>
          </v-card>
        </v-col>

        <!-- ข่าวอื่น ๆ -->
        <v-col cols="12" md="4">
          <SectionCard :title="t.related" class="related-card">
            <div class="d-flex flex-column ga-1 mx-n3 my-n3">
              <RelatedNewsItem v-for="n in related" :key="n.id" :item="n" />
            </div>
            <template #footer>
              <v-btn variant="text" class="text-text-brand px-0" append-icon="fas fa-chevron-right" :to="{ name: 'portal-news' }">
                {{ newsText.title }}
              </v-btn>
            </template>
          </SectionCard>
        </v-col>
      </v-row>
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
.related-card {
  position: sticky;
  top: calc(var(--pf-size-portal-header) + var(--pf-space-24));
}
</style>
