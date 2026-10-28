<script setup>
// โครง Dialog มาตรฐาน (หัวข้อ + ปุ่มปิด / เนื้อหา / แถบปุ่มด้านล่าง) — ใช้ร่วมในหน้า D13 – D17
// wide = กว้างกว่า dialog-md (ใช้กับ XML / ตาราง)
import { common } from "@/content/common.js";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  wide: { type: Boolean, default: false },
});
const open = defineModel({ type: Boolean, default: false });
</script>

<template>
  <v-dialog v-model="open" class="app-dialog" :class="{ 'app-dialog--wide': wide }">
    <v-card class="pf-elevation-modal">
      <div class="d-flex align-start ga-4 px-6 pt-6 pb-4">
        <div class="flex-grow-1 min-w-0">
          <h2 class="pf-type-h3 text-text-primary">{{ title }}</h2>
          <p v-if="subtitle" class="pf-type-body-sm text-text-secondary mt-1">{{ subtitle }}</p>
        </div>
        <v-btn icon="fas fa-xmark" variant="text" size="small" :aria-label="common.actions.close" @click="open = false" />
      </div>
      <v-divider color="border-default" class="border-opacity-100" />
      <v-card-text class="pa-6">
        <slot />
      </v-card-text>
      <template v-if="$slots.actions">
        <v-divider color="border-default" class="border-opacity-100" />
        <div class="d-flex flex-wrap justify-end ga-2 pa-4">
          <slot name="actions" />
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.app-dialog :deep(.v-overlay__content) {
  width: min(var(--pf-size-dialog-md), calc(100% - 2 * var(--pf-space-16)));
}
.app-dialog--wide :deep(.v-overlay__content) {
  width: min(calc(var(--pf-size-dialog-md) * 1.4), calc(100% - 2 * var(--pf-space-16)));
}
</style>
