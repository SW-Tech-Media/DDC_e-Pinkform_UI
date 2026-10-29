<script setup>
// หัวข้อเนื้อหานโยบาย (P-07) — section: { id, title, body?: [], items?: [], steps?: [{ title, text }], rights?: [{ icon, label }], note? }
// slot default แสดงต่อท้ายเนื้อหา (เช่น การตั้งค่าคุกกี้)
import { useDisplay } from "vuetify";
import AlertBox from "@/components/AlertBox.vue";

defineProps({
  section: { type: Object, required: true },
  no: { type: Number, required: true },
});
const { xs } = useDisplay();
</script>

<template>
  <section :id="section.id" class="policy-section">
    <h2 class="pf-type-h4 text-text-primary d-flex align-start ga-3">
      <span class="policy-section__no bg-accent-teal-subtle text-text-brand pf-type-label-md rounded-circle d-inline-flex align-center justify-center flex-shrink-0">
        {{ no }}
      </span>
      <span>{{ section.title }}</span>
    </h2>
    <div class="mt-3 d-flex flex-column ga-3" :class="{ 'policy-section__body': !xs }">
      <p v-for="(p, i) in section.body || []" :key="i" class="pf-type-body-md text-text-secondary">{{ p }}</p>
      <ul v-if="section.items" class="d-flex flex-column ga-2 policy-section__list">
        <li v-for="item in section.items" :key="item" class="d-flex align-start ga-3 pf-type-body-md text-text-secondary">
          <v-icon icon="fas fa-check" size="x-small" color="icon-brand" class="mt-2" />
          <span>{{ item }}</span>
        </li>
      </ul>
      <v-row v-if="section.rights" dense>
        <v-col v-for="r in section.rights" :key="r.label" cols="12" sm="6">
          <div class="d-flex align-center ga-3 pa-3 rounded-lg bg-bg-surface-muted h-100">
            <v-icon :icon="r.icon" size="small" color="icon-brand" />
            <span class="pf-type-body-sm text-text-primary">{{ r.label }}</span>
          </div>
        </v-col>
      </v-row>
      <div v-if="section.steps" class="d-flex flex-column ga-2">
        <div v-for="s in section.steps" :key="s.title" class="pa-4 rounded-lg pf-bordered">
          <p class="pf-type-body-sm-strong text-text-primary">{{ s.title }}</p>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ s.text }}</p>
        </div>
      </div>
      <AlertBox v-if="section.note" tone="warning">{{ section.note }}</AlertBox>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.policy-section {
  scroll-margin-top: calc(var(--pf-size-portal-header) + var(--pf-space-16));
}
.policy-section__no {
  width: var(--pf-size-control-sm);
  height: var(--pf-size-control-sm);
  margin-top: calc(-1 * var(--pf-space-2));
}
.policy-section__body {
  padding-inline-start: calc(var(--pf-size-control-sm) + var(--pf-space-12));
}
.policy-section__list {
  list-style: none;
}
</style>
