<script setup>
// การ์ดข่าวประชาสัมพันธ์ (Figma D01 › ข่าวประชาสัมพันธ์)
// item: { category, date, title, icon, cover: 'primary' | 'accent' | 'info' }
import StatusBadge from "@/components/StatusBadge.vue";
import { formatThaiDate } from "@/utils/format.js";

defineProps({
  item: { type: Object, required: true },
  readMore: { type: String, required: true },
  to: { type: [String, Object], required: true },
});

</script>

<template>
  <v-card :to="to" class="news pf-bordered h-100 d-flex flex-column" :ripple="false">
    <div class="news__cover position-relative d-flex align-center justify-center" :class="`bg-${item.cover}`">
      <span class="news__circle news__circle--a" />
      <span class="news__circle news__circle--b" />
      <v-icon :icon="item.icon" size="x-large" class="news__icon text-text-on-inverse" />
    </div>
    <div class="pa-5 d-flex flex-column flex-grow-1">
      <div class="d-flex align-center justify-space-between ga-2">
        <StatusBadge tone="accent">{{ item.category }}</StatusBadge>
        <span class="pf-type-caption text-text-tertiary">{{ formatThaiDate(item.date) }}</span>
      </div>
      <h3 class="pf-type-body-md-strong text-text-primary mt-3 flex-grow-1">{{ item.title }}</h3>
      <div class="d-flex align-center ga-2 mt-3 pf-type-label-md text-text-link">
        {{ readMore }}
        <v-icon icon="fas fa-chevron-right" size="x-small" />
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.news {
  transition: border-color var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.news:hover {
  border-color: rgb(var(--v-theme-border-focus));
}
.news__cover {
  height: calc(var(--pf-space-120) + var(--pf-space-40));
  overflow: hidden;
}
.news__circle {
  position: absolute;
  border-radius: var(--pf-radius-full);
  background: rgb(var(--v-theme-surface));
  opacity: 0.1;
}
.news__circle--a {
  width: calc(var(--pf-space-120) + var(--pf-space-32));
  height: calc(var(--pf-space-120) + var(--pf-space-32));
  top: calc(-1 * var(--pf-space-40));
  right: calc(-1 * var(--pf-space-40));
}
.news__circle--b {
  width: calc(var(--pf-space-120) + var(--pf-space-32));
  height: calc(var(--pf-space-120) + var(--pf-space-32));
  bottom: calc(-1 * var(--pf-space-80));
  left: calc(-1 * var(--pf-space-24));
}
.news__icon {
  opacity: 0.9;
}
</style>
