<script setup>
// Dialog ยืนยันการทำรายการ (ลบ / รีเซ็ต PIN ฯลฯ) — ใช้ร่วมในหน้า D14, D15
import IconTile from "@/components/IconTile.vue";
import { common } from "@/content/common.js";

defineProps({
  title: { type: String, required: true },
  message: { type: String, default: "" },
  confirmText: { type: String, required: true },
  icon: { type: String, default: "fas fa-triangle-exclamation" },
  tone: { type: String, default: "red" },
  danger: { type: Boolean, default: true },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);

const confirm = () => {
  emit("confirm");
  open.value = false;
};
</script>

<template>
  <v-dialog v-model="open" class="confirm-dialog">
    <v-card class="pf-elevation-modal pa-6">
      <div class="d-flex align-start ga-4">
        <IconTile :icon="icon" :tone="tone" />
        <div class="min-w-0">
          <h2 class="pf-type-h4 text-text-primary">{{ title }}</h2>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ message }}</p>
        </div>
      </div>
      <div class="d-flex justify-end ga-2 mt-6">
        <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
        <v-btn :color="danger ? 'error' : 'primary'" @click="confirm">{{ confirmText }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.confirm-dialog :deep(.v-overlay__content) {
  width: min(calc(var(--pf-size-dialog-md) * 0.7), calc(100% - 2 * var(--pf-space-16)));
}
</style>
