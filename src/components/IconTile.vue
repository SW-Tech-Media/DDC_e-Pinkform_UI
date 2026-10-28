<script setup>
// กล่องไอคอนพื้นสีอ่อน (ใช้ใน KPI, การ์ด, Empty state)
import { computed } from "vue";
import { iconTileTones } from "@/design/tones.js";

const props = defineProps({
  icon: { type: String, required: true },
  tone: { type: String, default: "teal", validator: (v) => v in iconTileTones },
  size: { type: String, default: "md", validator: (v) => ["md", "lg"].includes(v) },
});

const bg = computed(() => `bg-${iconTileTones[props.tone][0]}`);
const iconColor = computed(() => iconTileTones[props.tone][1]);
</script>

<template>
  <div class="icon-tile d-flex align-center justify-center rounded-lg" :class="[bg, `icon-tile--${size}`]">
    <v-icon :icon="icon" :color="iconColor" :size="size === 'lg' ? 'large' : 'default'" />
  </div>
</template>

<style scoped>
.icon-tile {
  flex-shrink: 0;
}
.icon-tile--md {
  width: var(--pf-size-icon-tile-md);
  height: var(--pf-size-icon-tile-md);
}
.icon-tile--lg {
  width: var(--pf-size-icon-tile-lg);
  height: var(--pf-size-icon-tile-lg);
}
</style>
