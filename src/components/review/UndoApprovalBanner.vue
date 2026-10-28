<script setup>
// แถบแจ้งผลอนุมัติ + ยกเลิกการอนุมัติภายใน 15 นาที (TOR 4.4.2 (3)) — ต้องกรอกเหตุผลก่อนยกเลิก
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import IconTile from "@/components/IconTile.vue";
import { reviewText } from "@/content/review.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  decision: { type: Object, required: true }, // { at, by }
  deadline: { type: Number, required: true }, // ms
});
const emit = defineEmits(["undo"]);
const t = reviewText.decided;
const d = reviewText.undoDialog;

const now = ref(Date.now());
let timer;
onMounted(() => (timer = setInterval(() => (now.value = Date.now()), 1000)));
onBeforeUnmount(() => clearInterval(timer));

const left = computed(() => Math.max(0, props.deadline - now.value));
const pad = (n) => String(n).padStart(2, "0");
const countdown = computed(() => {
  const s = Math.ceil(left.value / 1000);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
});

const dialog = ref(false);
const reason = ref("");
const form = ref(null);
const rules = [(v) => !!v?.trim() || d.required];
const openDialog = () => {
  reason.value = "";
  dialog.value = true;
};
const submit = async () => {
  const { valid } = await form.value.validate();
  if (!valid || left.value <= 0) return;
  emit("undo", reason.value.trim());
  dialog.value = false;
};
</script>

<template>
  <AlertBox tone="success" :title="t.approved(formatDateTime(decision.at), decision.by)" class="mb-6">
    {{ t.approvedNote }}
    <template #aside>
      <div v-if="left > 0" class="d-flex flex-wrap align-center justify-end ga-3">
        <div class="text-end">
          <div class="pf-type-caption text-text-secondary">{{ t.undoLeft }}</div>
          <div class="pf-type-h4 text-status-danger-fg" role="timer">{{ countdown }}</div>
        </div>
        <v-btn variant="outlined" color="error" prepend-icon="fas fa-rotate-left" @click="openDialog">{{ t.undo }}</v-btn>
      </div>
      <span v-else class="pf-type-caption text-text-tertiary">{{ t.undoExpired }}</span>
    </template>
  </AlertBox>

  <v-dialog v-model="dialog" :max-width="size['dialog-md']">
    <v-card class="pf-elevation-modal pa-6">
      <div class="d-flex align-start ga-4 mb-5">
        <IconTile icon="fas fa-rotate-left" tone="red" />
        <div>
          <h2 class="pf-type-h3 text-text-primary">{{ d.title }}</h2>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ d.description }}</p>
        </div>
      </div>
      <AlertBox tone="warning" icon="far fa-clock" class="mb-5">
        {{ t.undoTitle }} · {{ t.undoLeft }} {{ countdown }}
      </AlertBox>
      <v-form ref="form" @submit.prevent="submit">
        <FieldLabel :label="d.reason" required for="undo-reason" />
        <v-textarea id="undo-reason" v-model="reason" :rules="rules" :placeholder="d.reasonPlaceholder" rows="3" auto-grow />
        <div class="d-flex justify-end ga-3 mt-2">
          <v-btn variant="outlined" color="secondary" :height="size['control-lg']" @click="dialog = false">{{ d.cancel }}</v-btn>
          <v-btn type="submit" color="error" :height="size['control-lg']" :disabled="left <= 0">{{ d.confirm }}</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
