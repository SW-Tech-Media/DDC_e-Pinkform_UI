<script setup>
// แท็บ "XML ต้นฉบับ" ของ D10 — แสดง / คัดลอก / ดาวน์โหลด XML ที่ได้รับจาก NSW
import { reviewText } from "@/content/review.js";

const props = defineProps({
  xml: { type: String, required: true },
  filename: { type: String, required: true },
});
const emit = defineEmits(["notify"]);
const t = reviewText.xml;

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.xml);
  } catch {
    // บางเบราว์เซอร์ไม่อนุญาต clipboard — Prototype แสดงข้อความแจ้งเหมือนเดิม
  }
  emit("notify", t.copied);
};
const download = () => {
  const url = URL.createObjectURL(new Blob([props.xml], { type: "application/xml" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: props.filename });
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <div class="pf-type-label-md text-text-primary">{{ t.title }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.subtitle }}</div>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="outlined" color="primary" size="small" prepend-icon="far fa-copy" @click="copy">{{ t.copy }}</v-btn>
        <v-btn variant="outlined" color="primary" size="small" prepend-icon="fas fa-download" @click="download">
          {{ t.download }}
        </v-btn>
      </div>
    </div>
    <pre class="xml pf-type-caption bg-bg-surface-muted pf-bordered rounded-lg pa-4 text-text-primary">{{ xml }}</pre>
  </div>
</template>

<style scoped>
.xml {
  overflow: auto;
  max-height: calc(var(--pf-space-120) * 4);
  white-space: pre;
}
</style>
