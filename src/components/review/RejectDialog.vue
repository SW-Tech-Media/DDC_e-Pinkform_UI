<script setup>
// Pop-up ยืนยันการไม่อนุมัติ (TOR 4.4.2 (5)) — แสดงข้อความตอบกลับที่เลือก ต้องเลือกข้อความก่อนยืนยัน
import { computed } from "vue";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import KeyValueRows from "./KeyValueRows.vue";
import { reviewText } from "@/content/review.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  detail: { type: Object, required: true },
  reply: { type: Object, default: null }, // { code, text }
  note: { type: String, default: "" },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);
const t = reviewText.rejectDialog;

const rows = computed(() => [
  { label: t.ref, value: props.detail.ref },
  { label: t.company, value: props.detail.exporter.nameTh },
]);
const confirm = () => {
  emit("confirm");
  open.value = false;
};
</script>

<template>
  <v-dialog v-model="open" :max-width="size['dialog-md']">
    <v-card class="pf-elevation-modal pa-6">
      <div class="d-flex align-start ga-4 mb-4">
        <IconTile icon="fas fa-xmark" tone="red" />
        <div>
          <h2 class="pf-type-h3 text-text-primary">{{ t.title }}</h2>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ t.description }}</p>
        </div>
      </div>
      <div class="bg-bg-surface-muted rounded-lg pa-4 mb-4">
        <KeyValueRows :items="rows" dense />
      </div>
      <div class="pf-type-label-md text-text-primary mb-2">{{ t.reply }}</div>
      <AlertBox v-if="reply" tone="danger" :title="reviewText.reply.item(reply)" icon="far fa-message">
        {{ note || t.empty }}
      </AlertBox>
      <AlertBox v-else tone="warning">{{ t.noReply }}</AlertBox>
      <div class="d-flex justify-end ga-3 mt-6">
        <v-btn variant="outlined" color="secondary" :height="size['control-lg']" @click="open = false">{{ t.cancel }}</v-btn>
        <v-btn
          color="error"
          prepend-icon="fas fa-xmark"
          :height="size['control-lg']"
          :disabled="!reply"
          @click="confirm"
        >
          {{ t.confirm }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
