<script setup>
// ปุ่มไอคอนสี่เหลี่ยมขอบเทาในคอลัมน์ "จัดการ" ของตาราง (Figma: Button/Icon · outline)
// ใช้ร่วมกันในหน้า D13 – D17
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
    icon
    variant="outlined"
    color="border-default"
    rounded="lg"
    :width="size['control-sm']"
    :height="size['control-sm']"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    class="bg-surface"
    @click.stop="$emit('click')"
  >
    <v-icon :icon="icon" :color="tone" size="x-small" />
  </v-btn>
</template>
