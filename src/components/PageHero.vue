<script setup>
// แถบหัวหน้าฝั่ง Portal (Figma: Web/Page Hero) — breadcrumb: [{ title, to? }]
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  breadcrumb: { type: Array, default: () => [] },
  overlap: { type: Boolean, default: false },
});
</script>

<template>
  <section class="bg-bg-inverse" :class="overlap ? 'hero--overlap' : 'pb-12'">
    <div class="pf-container px-4 px-md-6 pt-10">
      <v-breadcrumbs v-if="breadcrumb.length" :items="breadcrumb" class="pa-0 mb-3 pf-type-caption hero-crumbs">
        <template #divider>/</template>
      </v-breadcrumbs>
      <h1 class="pf-type-h1 text-text-on-inverse">{{ title }}</h1>
      <p v-if="description" class="pf-type-body-md text-text-on-inverse-muted mt-2">{{ description }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero--overlap {
  padding-bottom: var(--pf-space-80);
}
.hero-crumbs {
  color: rgb(var(--v-theme-text-on-inverse-muted));
}
.hero-crumbs :deep(a) {
  color: inherit;
}
</style>
