<script setup>
// หัวข้อหนึ่งส่วนในคู่มือ Design System — id ใช้เป็น anchor ของเมนูด้านซ้าย
import IconTile from "@/components/IconTile.vue";

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>

<template>
  <section :id="id" class="doc-section d-flex flex-column ga-6">
    <div class="d-flex align-start ga-4">
      <IconTile :icon="icon" tone="pink" />
      <div class="min-w-0">
        <h2 class="pf-type-h2 text-text-primary">{{ title }}</h2>
        <p v-if="description" class="pf-type-body-md text-text-secondary mt-1">{{ description }}</p>
      </div>
    </div>
    <slot />
  </section>
</template>

<style scoped>
/* เว้นที่ให้ Header ด้านบนเมื่อกระโดดมาจากเมนู */
.doc-section {
  scroll-margin-top: calc(var(--pf-size-portal-header) + var(--pf-space-24));
}
</style>
