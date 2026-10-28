<script setup>
// การ์ดเลือกปลายทาง (Figma: Card/Quick Link) — ทั้งการ์ดกดได้
import IconTile from "./IconTile.vue";

defineProps({
  icon: { type: String, required: true },
  tone: { type: String, default: "teal" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  cta: { type: String, default: "" },
  to: { type: [String, Object], required: true },
});
</script>

<template>
  <v-card :to="to" class="entry-card pf-bordered pf-elevation-card d-flex flex-column pa-8 h-100" :ripple="false">
    <IconTile :icon="icon" :tone="tone" size="lg" />
    <h2 class="pf-type-h3 text-text-primary mt-6">{{ title }}</h2>
    <p class="pf-type-body-md text-text-secondary mt-2 flex-grow-1">{{ description }}</p>
    <div v-if="cta" class="d-flex align-center ga-2 mt-6 pf-type-label-lg text-text-link">
      {{ cta }}
      <v-icon icon="fas fa-arrow-right" size="small" class="entry-card__arrow" />
    </div>
  </v-card>
</template>

<style scoped>
.entry-card {
  transition:
    border-color var(--pf-motion-duration-base) var(--pf-motion-easing),
    transform var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.entry-card:hover {
  border-color: rgb(var(--v-theme-border-focus));
  transform: translateY(calc(-1 * var(--pf-space-2)));
}
.entry-card__arrow {
  transition: transform var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.entry-card:hover .entry-card__arrow {
  transform: translateX(var(--pf-space-4));
}
</style>
