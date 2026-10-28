<script setup>
// ลิงก์ลัด (Figma D01: การ์ดแนวนอน + ลูกศร · S01: tile สี่เหลี่ยม ไอคอนด้านบน)
// tile = รูปแบบมือถือ
import IconTile from "@/components/IconTile.vue";

defineProps({
  icon: { type: String, required: true },
  tone: { type: String, default: "teal" },
  title: { type: String, required: true },
  caption: { type: String, default: "" },
  to: { type: [String, Object], required: true },
  tile: { type: Boolean, default: false },
});
</script>

<template>
  <v-card :to="to" class="quick pf-bordered h-100" :class="tile ? 'pa-4' : 'px-5 py-4'" :ripple="false">
    <template v-if="tile">
      <IconTile :icon="icon" :tone="tone" />
      <div class="pf-type-label-lg text-text-primary mt-4">{{ title }}</div>
    </template>
    <div v-else class="d-flex align-center ga-4">
      <IconTile :icon="icon" :tone="tone" />
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-label-md text-text-primary">{{ title }}</div>
        <div v-if="caption" class="pf-type-caption text-text-tertiary">{{ caption }}</div>
      </div>
      <v-icon icon="fas fa-chevron-right" size="x-small" color="icon-default" />
    </div>
  </v-card>
</template>

<style scoped>
.quick {
  transition: border-color var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.quick:hover {
  border-color: rgb(var(--v-theme-border-focus));
}
</style>
