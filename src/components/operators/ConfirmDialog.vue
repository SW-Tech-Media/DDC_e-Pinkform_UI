<script setup>
// Dialog ยืนยันการทำรายการ (ลบ / อนุมัติ / ไม่อนุมัติ) — tone: primary | error · slot default = เนื้อหาเพิ่มเติม (เช่น ช่องเหตุผล)
import IconTile from "@/components/IconTile.vue";
import { common } from "@/content/common.js";
import { size } from "@/design/tokens.js";

defineProps({
  title: { type: String, required: true },
  message: { type: String, default: "" },
  confirmText: { type: String, required: true },
  icon: { type: String, default: "fas fa-circle-question" },
  tone: { type: String, default: "primary" },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["confirm"]);
const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <v-dialog v-model="model" :max-width="size['dialog-md']">
    <v-card class="pa-6 pf-elevation-modal">
      <div class="d-flex align-start ga-4">
        <IconTile :icon="icon" :tone="tone === 'error' ? 'red' : 'teal'" />
        <div class="min-w-0 flex-grow-1">
          <h2 class="pf-type-h4 text-text-primary">{{ title }}</h2>
          <p v-if="message" class="pf-type-body-sm text-text-secondary mt-1">{{ message }}</p>
          <div v-if="$slots.default" class="mt-4"><slot /></div>
        </div>
      </div>
      <div class="d-flex justify-end flex-wrap ga-3 mt-6">
        <v-btn variant="outlined" color="secondary" :height="size['control-md']" @click="model = false">
          {{ common.actions.cancel }}
        </v-btn>
        <v-btn :color="tone" :height="size['control-md']" :disabled="disabled" @click="emit('confirm')">
          {{ confirmText }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
