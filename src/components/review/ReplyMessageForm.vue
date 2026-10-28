<script setup>
// "ข้อความตอบกลับผู้ประกอบการ" (Figma D10) — เลือกจากรายการ + พิมพ์ข้อความเพิ่มเติม
import { computed } from "vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import { reviewText } from "@/content/review.js";

const props = defineProps({
  messages: { type: Array, required: true }, // [{ code, text }]
  readonly: { type: Boolean, default: false },
});
const code = defineModel("code", { type: String, default: null });
const note = defineModel("note", { type: String, default: "" });
const t = reviewText.reply;
const items = computed(() => props.messages.map((m) => ({ value: m.code, title: t.item(m) })));
</script>

<template>
  <SectionCard :title="t.title">
    <FieldLabel :label="t.select" for="reply-code" />
    <v-select
      id="reply-code"
      v-model="code"
      :items="items"
      :placeholder="t.placeholder"
      :readonly="readonly"
      menu-icon="fas fa-chevron-down"
      hide-details
      class="mb-5"
    />
    <FieldLabel :label="t.note" for="reply-note" />
    <v-textarea
      id="reply-note"
      v-model="note"
      :placeholder="t.notePlaceholder"
      :readonly="readonly"
      rows="3"
      auto-grow
      hide-details
    />
  </SectionCard>
</template>
