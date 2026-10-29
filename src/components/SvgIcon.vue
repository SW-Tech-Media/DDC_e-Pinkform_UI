<script setup>
// ไอคอนเส้นจาก Figma (Icon/* stroke 2) — ไฟล์อยู่ใน src/assets/icons/<name>.svg
// สีเส้นตามสีตัวอักษรของผู้ใช้ (currentColor) จึงเปลี่ยนตาม state ได้ เช่น เมนู active
import { computed } from "vue";

const icons = import.meta.glob("@/assets/icons/*.svg", { query: "?raw", import: "default", eager: true });
const byName = Object.fromEntries(
  Object.entries(icons).map(([path, svg]) => [path.split("/").pop().replace(".svg", ""), svg])
);

const props = defineProps({
  name: { type: String, required: true },
});

const svg = computed(() => byName[props.name] ?? "");
</script>

<template>
  <span class="svg-icon d-inline-flex flex-shrink-0" aria-hidden="true" v-html="svg" />
</template>

<style scoped>
.svg-icon :deep([stroke]) {
  stroke: currentColor;
}
</style>
