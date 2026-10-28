<script setup>
// การ์ดเนื้อหามีหัวข้อ (Figma: Card/Header) — flush = เนื้อหาชิดขอบ (ใช้กับตาราง)
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  flush: { type: Boolean, default: false },
});
</script>

<template>
  <v-card class="pf-bordered d-flex flex-column">
    <div v-if="title || $slots.header || $slots.actions" class="d-flex align-center flex-wrap ga-3 px-6 py-5 pf-bordered-bottom">
      <div class="flex-grow-1 d-flex align-center flex-wrap ga-3">
        <div>
          <h2 v-if="title" class="pf-type-h4 text-text-primary">{{ title }}</h2>
          <p v-if="subtitle" class="pf-type-caption text-text-tertiary">{{ subtitle }}</p>
        </div>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="d-flex align-center ga-2">
        <slot name="actions" />
      </div>
    </div>
    <div class="flex-grow-1" :class="flush ? '' : 'pa-6'">
      <slot />
    </div>
    <div v-if="$slots.footer" class="pf-bordered-top px-6 py-4">
      <slot name="footer" />
    </div>
  </v-card>
</template>
