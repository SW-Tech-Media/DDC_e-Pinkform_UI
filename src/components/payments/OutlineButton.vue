<script setup>
// ปุ่มรอง (Figma: Button/Secondary · outline) — พื้นขาว ขอบเทา ตัวอักษรเข้ม สูง control-lg
// ส่ง prop ของ v-btn ต่อได้ทั้งหมด (prepend-icon, :to, @click ฯลฯ) — ใช้ร่วมในหน้า D13 – D17
import { size } from "@/design/tokens.js";

defineProps({
  height: { type: [Number, String], default: size["control-lg"] },
});
</script>

<template>
  <v-btn variant="outlined" color="text-text-primary" :height="height" class="outline-btn bg-surface">
    <slot />
  </v-btn>
</template>

<style scoped>
.outline-btn {
  border-color: rgb(var(--v-theme-border-strong));
}
.outline-btn :deep(.v-btn__prepend .v-icon),
.outline-btn :deep(.v-btn__append .v-icon) {
  color: rgb(var(--v-theme-icon-default));
}
</style>
