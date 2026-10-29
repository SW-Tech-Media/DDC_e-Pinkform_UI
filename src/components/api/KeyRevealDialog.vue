<script setup>
// Dialog แสดง API Key / Client Secret ครั้งเดียวหลังสร้างหรือออกใหม่ (B-24) พร้อมปุ่มคัดลอก
// secret: { mode: 'new' | 'regen', name, type, clientId, key }
import { computed } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { apiMonitorText } from "@/content/api-monitor.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  secret: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["copied"]);
const t = apiMonitorText.keyDialog;

const fields = computed(() => {
  const s = props.secret;
  if (!s) return [];
  return s.type === "oauth"
    ? [
        { id: "kd-client", label: t.clientId, value: s.clientId },
        { id: "kd-secret", label: t.clientSecret, value: s.key, secret: true },
        { id: "kd-token", label: t.tokenUrl, value: t.tokenUrlValue },
      ]
    : [{ id: "kd-key", label: t.apiKey, value: s.key, secret: true }];
});

const copy = async (f) => {
  try {
    await navigator.clipboard.writeText(f.value);
  } catch {
    /* Prototype — ไม่มีสิทธิ์ clipboard ก็แจ้งผลเหมือนเดิม */
  }
  emit("copied", t.copied(f.label));
};
</script>

<template>
  <AppDialog
    v-model="open"
    :title="t.title"
    :subtitle="secret ? (secret.mode === 'regen' ? t.subtitleRegen(secret.name) : t.subtitleNew(secret.name)) : ''"
  >
    <AlertBox tone="warning" class="mb-4">{{ t.warning }}</AlertBox>
    <div v-for="f in fields" :key="f.id" class="mb-4">
      <FieldLabel :label="f.label" :for="f.id" />
      <div class="d-flex ga-2">
        <v-text-field
          :id="f.id"
          :model-value="f.value"
          readonly
          hide-details
          class="key-field"
          :class="f.secret ? 'key-field--secret' : ''"
        />
        <SecondaryButton icon="far fa-copy" @click="copy(f)">{{ t.copy }}</SecondaryButton>
      </div>
    </div>
    <template #actions>
      <v-btn color="primary" prepend-icon="fas fa-check" :height="size['control-md']" @click="open = false">{{ t.done }}</v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.key-field {
  min-width: 0;
}
.key-field--secret :deep(input) {
  color: rgb(var(--v-theme-text-brand));
  font-weight: var(--pf-font-weight-semibold);
}
</style>
