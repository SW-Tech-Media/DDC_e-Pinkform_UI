<script setup>
// ปุ่มไอคอนสี่เหลี่ยมขอบเทาในคอลัมน์ "จัดการ" ของตาราง (Figma: Button/Icon · outline)
// ปุ่ม control-sm มุม md ไอคอน icon-xs — ใช้ร่วมกันทุกตารางในหน้า Back Office
import { size } from "@/design/tokens.js";

defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  tone: { type: String, default: "icon-default" },
  disabled: { type: Boolean, default: false },
});
defineEmits(["click"]);
</script>

<template>
  <v-btn
    variant="outlined"
    rounded="md"
    :width="size['control-sm']"
    :height="size['control-sm']"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    class="table-icon-btn bg-surface"
    @click.stop="$emit('click')"
  >
    <v-icon :icon="icon" :color="tone" :size="size['icon-xs']" />
  </v-btn>
</template>

<style scoped>
.table-icon-btn {
  min-width: 0;
  padding: 0;
  border-color: rgb(var(--v-theme-border-default));
}
.table-icon-btn:hover {
  border-color: rgb(var(--v-theme-border-strong));
}
</style>
