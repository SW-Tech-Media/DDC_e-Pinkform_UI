<script setup>
// P-04 · ข่าวประชาสัมพันธ์ (ยังไม่มีดีไซน์ใน Figma — ใช้การ์ดข่าวแบบ D01)
// ค้นหาหัวข้อ · กรองหมวด (ทั้งหมด / ประชาสัมพันธ์ / ประกาศ / อบรม) · แบ่งหน้า 6 ข่าว/หน้า · คลิกการ์ด → รายละเอียดข่าว
import { computed, ref, watch } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import TablePagination from "@/components/TablePagination.vue";
import EmptyState from "@/components/EmptyState.vue";
import NewsCard from "@/components/portal/NewsCard.vue";
import { newsCategories, newsText as t } from "@/content/portal-pages.js";
import { newsList } from "@/mocks/portal-pages.js";

const ALL = "all";
const categoryOptions = [{ value: ALL, label: t.all }, ...newsCategories.map((c) => ({ value: c, label: c }))];

const query = ref("");
const category = ref(ALL);
const page = ref(1);
const perPage = ref(6);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return newsList.filter(
    (n) => (category.value === ALL || n.category === category.value) && (!q || n.title.toLowerCase().includes(q)),
  );
});
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage.value, page.value * perPage.value));

watch([query, category], () => (page.value = 1));

function reset() {
  query.value = "";
  category.value = ALL;
}
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="t.breadcrumb" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <!-- ค้นหา + กรองหมวด -->
      <v-card class="pf-bordered pf-elevation-card px-4 px-md-6 py-4">
        <div class="d-flex flex-column flex-md-row align-md-center ga-4">
          <v-text-field
            v-model="query"
            :placeholder="t.search"
            :aria-label="t.search"
            prepend-inner-icon="fas fa-magnifying-glass"
            density="compact"
            hide-details
            clearable
            class="search"
          />
          <div class="d-flex align-center flex-wrap ga-3 overflow-x-auto">
            <span class="pf-type-label-md text-text-primary">{{ t.category }}</span>
            <SegmentedControl v-model="category" :options="categoryOptions" :label="t.category" class="flex-wrap" />
          </div>
        </div>
      </v-card>

      <p class="pf-type-body-sm text-text-secondary mt-6" aria-live="polite">{{ t.found(filtered.length) }}</p>

      <!-- รายการข่าว -->
      <v-row v-if="paged.length" class="mt-1">
        <v-col v-for="n in paged" :key="n.id" cols="12" sm="6" md="4">
          <NewsCard :item="n" :read-more="t.readMore" />
        </v-col>
      </v-row>
      <v-card v-else class="pf-bordered mt-4">
        <EmptyState :icon="t.empty.icon" tone="neutral" :title="t.empty.title" :description="t.empty.description">
          <template #actions>
            <v-btn color="primary" prepend-icon="fas fa-rotate-left" @click="reset">{{ t.empty.reset }}</v-btn>
          </template>
        </EmptyState>
      </v-card>

      <TablePagination
        v-if="filtered.length > perPage"
        v-model:page="page"
        v-model:per-page="perPage"
        :total="filtered.length"
        :show-per-page="false"
        class="mt-8"
      />
    </div>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.search {
  flex: 1 1 auto;
  max-width: var(--pf-size-desktop-search);
}
</style>
