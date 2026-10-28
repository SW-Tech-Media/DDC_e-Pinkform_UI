<script setup>
// ขั้นตอนการขอใบรับรองฯ (Figma D01: การ์ด 4 ใบ · S01: รายการแนวตั้ง)
// steps: [{ no, icon, tone, title, description, mobileTitle?, mobileDescription? }] · compact = แบบรายการ (มือถือ)
import IconTile from "@/components/IconTile.vue";

defineProps({
  steps: { type: Array, required: true },
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <div v-if="compact">
    <div v-for="(s, i) in steps" :key="s.no" class="d-flex align-center ga-3 py-4 pf-bordered-bottom">
      <IconTile :icon="s.icon" tone="teal" />
      <div class="min-w-0">
        <div class="pf-type-label-md text-text-primary">{{ i + 1 }}. {{ s.mobileTitle || s.title }}</div>
        <div class="pf-type-caption text-text-secondary">{{ s.mobileDescription || s.description }}</div>
      </div>
    </div>
  </div>
  <v-row v-else>
    <v-col v-for="s in steps" :key="s.no" cols="12" sm="6" md="3">
      <v-card class="pf-bordered pa-6 h-100">
        <div class="d-flex align-start justify-space-between">
          <IconTile :icon="s.icon" :tone="s.tone" />
          <span class="pf-type-h2 text-border-default">{{ s.no }}</span>
        </div>
        <h3 class="pf-type-h4 text-text-primary mt-6">{{ s.title }}</h3>
        <p class="pf-type-body-sm text-text-secondary mt-2">{{ s.description }}</p>
      </v-card>
    </v-col>
  </v-row>
</template>

