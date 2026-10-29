<script setup>
// รายการข่าวแบบย่อ (ข่าวอื่น ๆ ที่เกี่ยวข้อง · P-04)
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { formatShortThaiDate } from "@/utils/format.js";

defineProps({
  item: { type: Object, required: true },
});

const tones = { primary: "teal", accent: "pink", info: "blue" };
</script>

<template>
  <router-link :to="{ name: 'portal-news-detail', params: { id: item.id } }" class="related d-flex ga-3 pa-3 rounded-lg">
    <IconTile :icon="item.icon" :tone="tones[item.cover] || 'teal'" />
    <div class="flex-grow-1 min-w-0">
      <div class="d-flex align-center flex-wrap ga-2">
        <StatusBadge tone="accent">{{ item.category }}</StatusBadge>
        <span class="pf-type-caption text-text-tertiary">{{ formatShortThaiDate(item.date) }}</span>
      </div>
      <p class="pf-type-body-sm-strong text-text-primary mt-1 related__title">{{ item.title }}</p>
    </div>
  </router-link>
</template>

<style scoped>
.related {
  text-decoration: none;
  transition: background-color var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.related:hover,
.related:focus-visible {
  background: rgb(var(--v-theme-bg-surface-muted));
}
.related__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
