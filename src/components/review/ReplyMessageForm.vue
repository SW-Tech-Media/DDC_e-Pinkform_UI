<script setup>
// "ข้อความตอบกลับผู้ประกอบการ" (Figma D10) — เลือกประเภทผลการพิจารณา → เลือกข้อความจากรายการของประเภทนั้น + พิมพ์ข้อความเพิ่มเติม
// รายการกรองตาม type ของข้อความ (approve | reject) เพื่อไม่ให้อนุมัติพร้อมรหัสไม่อนุมัติ (TOR 4.4.2 (6))
// v-model:type — ผู้ใช้หน้าจอเป็นผู้ล้างข้อความที่ไม่ตรงประเภทเมื่อเปลี่ยน type (RequestReviewView ใช้ store.setReplyType)
import { computed } from "vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import { reviewText } from "@/content/review.js";

const props = defineProps({
  messages: { type: Array, required: true }, // [{ code, text, type }] — ทุกประเภท
  readonly: { type: Boolean, default: false },
});
const type = defineModel("type", { type: String, default: "approve" }); // approve | reject
const code = defineModel("code", { type: String, default: null });
const note = defineModel("note", { type: String, default: "" });
const t = reviewText.reply;
const typeOptions = Object.entries(t.types).map(([value, label]) => ({ value, label }));
const items = computed(() =>
  props.messages.filter((m) => m.type === type.value).map((m) => ({ value: m.code, title: t.item(m) }))
);
</script>

<template>
  <SectionCard :title="t.title">
    <FieldLabel :label="t.type" />
    <SegmentedControl v-model="type" :options="typeOptions" :label="t.type" :disabled="readonly" class="mb-2" />
    <p class="pf-type-caption text-text-tertiary mb-5">{{ t.typeHint[type] }}</p>
    <FieldLabel :label="t.select" for="reply-code" :required="type === 'reject'" />
    <v-select
      id="reply-code"
      v-model="code"
      :items="items"
      :placeholder="t.placeholder"
      :readonly="readonly"
      :clearable="!readonly && type === 'approve'"
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
