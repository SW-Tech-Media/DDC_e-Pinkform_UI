<script setup>
// การ์ดตัวอย่าง Component ในคู่มือ — ชื่อ + ไฟล์ + คำอธิบาย / พื้นที่ตัวอย่าง (slot) / Props
import SectionCard from "@/components/SectionCard.vue";

defineProps({
  name: { type: String, required: true },
  file: { type: String, required: true },
  description: { type: String, default: "" },
  api: { type: String, default: "" },
  propsLabel: { type: String, required: true },
});
</script>

<template>
  <SectionCard :title="name" :subtitle="description" flush>
    <template #actions>
      <span class="pf-type-caption text-text-tertiary">src/components/{{ file }}</span>
    </template>
    <div class="pa-6 bg-bg-surface-muted">
      <slot />
    </div>
    <template v-if="api" #footer>
      <div class="d-flex flex-column flex-sm-row ga-1 ga-sm-3">
        <span class="pf-type-label-sm text-text-tertiary flex-shrink-0">{{ propsLabel }}</span>
        <code class="pf-type-caption text-text-secondary">{{ api }}</code>
      </div>
    </template>
  </SectionCard>
</template>
