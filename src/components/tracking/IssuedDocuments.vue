<script setup>
// การ์ด "เอกสารที่ออกแล้ว" (Figma D12) — ใบรับรองฯ (PDF / XML) · ใบเสร็จรับเงิน พร้อมปุ่มดาวน์โหลด
import SectionCard from "@/components/SectionCard.vue";
import IconTile from "@/components/IconTile.vue";
import { trackingText } from "@/content/tracking.js";

defineProps({
  documents: { type: Array, default: () => [] }, // [{ id, title, number, icon, tone, formats }]
});
const emit = defineEmits(["download"]);
const t = trackingText.issued;
</script>

<template>
  <SectionCard :title="t.title">
    <div v-if="documents.length" class="d-flex flex-column ga-3">
      <div v-for="doc in documents" :key="doc.id" class="pf-bordered rounded-lg pa-4 d-flex align-center ga-4">
        <IconTile :icon="doc.icon" :tone="doc.tone" />
        <div class="flex-grow-1 min-w-0">
          <div class="pf-type-body-sm-strong text-text-primary">{{ doc.title }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ doc.number }}</div>
        </div>
        <v-menu v-if="doc.formats.length > 1">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="fas fa-download" variant="text" color="icon-default" size="small" :aria-label="t.download(doc.title)" />
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="f in doc.formats"
              :key="f"
              :title="f"
              prepend-icon="fas fa-download"
              @click="emit('download', `${doc.number}.${f.toLowerCase()}`)"
            />
          </v-list>
        </v-menu>
        <v-btn
          v-else
          icon="fas fa-download"
          variant="text"
          color="icon-default"
          size="small"
          :aria-label="t.download(doc.title)"
          @click="emit('download', `${doc.number}.${doc.formats[0].toLowerCase()}`)"
        />
      </div>
    </div>
    <p v-else class="pf-type-body-sm text-text-tertiary">{{ t.empty }}</p>
  </SectionCard>
</template>
