<script setup>
// ภาพปกข่าวขนาดใหญ่ (หน้ารายละเอียดข่าว P-04) — สไตล์เดียวกับปกใน NewsCard (D01)
// cover: primary · accent · info
defineProps({
  icon: { type: String, required: true },
  cover: { type: String, default: "primary" },
});
</script>

<template>
  <div class="cover position-relative d-flex align-center justify-center rounded-lg" :class="`bg-${cover}`">
    <span class="cover__circle cover__circle--a" />
    <span class="cover__circle cover__circle--b" />
    <v-icon :icon="icon" class="cover__icon text-text-on-inverse" />
  </div>
</template>

<style scoped>
.cover {
  height: calc(var(--pf-space-120) * 2);
  overflow: hidden;
}
.cover__circle {
  position: absolute;
  border-radius: var(--pf-radius-full);
  background: rgb(var(--v-theme-surface));
  opacity: 0.1;
}
.cover__circle--a {
  width: calc(var(--pf-space-120) * 2);
  height: calc(var(--pf-space-120) * 2);
  top: calc(-1 * var(--pf-space-64));
  right: calc(-1 * var(--pf-space-48));
}
.cover__circle--b {
  width: calc(var(--pf-space-120) * 2);
  height: calc(var(--pf-space-120) * 2);
  bottom: calc(-1 * var(--pf-space-120));
  left: calc(-1 * var(--pf-space-40));
}
.cover__icon {
  opacity: 0.9;
  font-size: var(--pf-space-64);
  width: var(--pf-space-80);
  height: var(--pf-space-80);
}
</style>
