<script setup>
// ปุ่มรอง (Figma: Button/Secondary) — พื้นขาว ขอบ border-strong ตัวอักษร text-primary เช่น "ส่งออก Excel", "ล้างเงื่อนไข"
import { size } from "@/design/tokens.js";

defineProps({
  icon: { type: String, default: "" },
  // ชื่อ size ใน tokens.js (เช่น "control-md") หรือตัวเลขจาก size[...]
  height: { type: [String, Number], default: "control-lg" },
});
</script>

<template>
  <v-btn variant="outlined" :height="typeof height === 'number' ? height : size[height]" class="secondary-btn bg-surface">
    <v-icon v-if="icon" :icon="icon" start />
    <slot />
  </v-btn>
</template>

<style scoped>
.secondary-btn {
  color: rgb(var(--v-theme-text-primary));
  border-color: rgb(var(--v-theme-border-strong));
}
</style>
