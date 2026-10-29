<script setup>
// Dialog แก้ไข CPA เต็มรูปแบบ (B-23) — ข้อมูลทั่วไป / Transport / Queue–Retry · บันทึกแล้วเพิ่มเวอร์ชัน
import { computed, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import { cpaText } from "@/content/cpa.js";
import { common } from "@/content/common.js";
import { certificateOptions, cpaStatuses } from "@/mocks/cpa.js";

const props = defineProps({
  cpa: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);
const t = cpaText.form;

// "2.3" → "2.4", "2.0-rc1" → "2.0"
const nextVersion = (v) => {
  if (v.includes("-")) return v.split("-")[0];
  const [major, minor = 0] = v.split(".").map(Number);
  return `${major}.${minor + 1}`;
};

const form = ref(null);
const note = ref("");
const formRef = ref(null);
watch(open, (v) => {
  if (!v || !props.cpa) return;
  form.value = { ...props.cpa, actions: [...props.cpa.actions] };
  note.value = "";
  formRef.value?.resetValidation();
});
const newVersion = computed(() => (props.cpa ? nextVersion(props.cpa.version) : ""));
const statusItems = Object.entries(cpaStatuses).map(([value, s]) => ({ value, title: s.label }));

const required = (v) => (v !== "" && v !== null && v !== undefined) || t.required;
const rules = {
  required: [required],
  url: [required, (v) => /^https:\/\//.test(v) || t.url],
  positive: [required, (v) => Number(v) > 0 || t.min],
};

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...form.value, version: newVersion.value }, note.value.trim() || t.defaultNote);
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="cpa ? `${cpa.id} · ${cpa.partner}` : ''" wide>
    <v-form v-if="form" ref="formRef" @submit.prevent="submit">
      <h3 class="pf-type-label-lg text-text-primary mb-3">{{ t.sectionGeneral }}</h3>
      <v-row dense>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.partner" required for="cpa-f-partner" />
          <v-text-field id="cpa-f-partner" v-model="form.partner" :rules="rules.required" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.partyId" required for="cpa-f-party" />
          <v-text-field id="cpa-f-party" v-model="form.partyId" :rules="rules.required" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.service" required for="cpa-f-service" />
          <v-text-field id="cpa-f-service" v-model="form.service" :rules="rules.required" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.actions" for="cpa-f-actions" />
          <v-combobox id="cpa-f-actions" v-model="form.actions" multiple chips closable-chips hide-details />
        </v-col>
        <v-col cols="6" sm="4">
          <FieldLabel :label="t.version" for="cpa-f-version" />
          <v-text-field id="cpa-f-version" :model-value="`${cpa.version} → ${newVersion}`" readonly :hint="t.versionHint" persistent-hint />
        </v-col>
        <v-col cols="6" sm="4">
          <FieldLabel :label="t.status" for="cpa-f-status" />
          <v-select id="cpa-f-status" v-model="form.status" :items="statusItems" hide-details />
        </v-col>
        <v-col cols="12" sm="4">
          <FieldLabel :label="t.validTo" for="cpa-f-valid" />
          <DateField id="cpa-f-valid" v-model="form.validTo" />
        </v-col>
      </v-row>

      <h3 class="pf-type-label-lg text-text-primary mt-6 mb-3">{{ t.sectionTransport }}</h3>
      <v-row dense>
        <v-col cols="12">
          <FieldLabel :label="t.endpoint" required for="cpa-f-endpoint" />
          <v-text-field id="cpa-f-endpoint" v-model="form.endpoint" :rules="rules.url" prepend-inner-icon="fas fa-lock" hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.certificate" for="cpa-f-cert" />
          <v-select id="cpa-f-cert" v-model="form.certificate" :items="certificateOptions" prepend-inner-icon="fas fa-shield-halved" hide-details />
        </v-col>
        <v-col cols="12" class="d-flex flex-wrap ga-6">
          <v-switch v-model="form.signature" :label="t.signature" color="success" inset hide-details density="compact" />
          <v-switch v-model="form.encryption" :label="t.encryption" color="success" inset hide-details density="compact" />
        </v-col>
      </v-row>

      <h3 class="pf-type-label-lg text-text-primary mt-6 mb-3">{{ t.sectionRetry }}</h3>
      <v-row dense>
        <v-col cols="12" sm="4">
          <FieldLabel :label="t.retries" required for="cpa-f-retries" />
          <v-text-field id="cpa-f-retries" v-model.number="form.retries" type="number" min="1" :rules="rules.positive" hide-details="auto" />
        </v-col>
        <v-col cols="6" sm="4">
          <FieldLabel :label="t.interval" required for="cpa-f-interval" />
          <v-text-field id="cpa-f-interval" v-model.number="form.interval" type="number" min="1" :rules="rules.positive" hide-details="auto" />
        </v-col>
        <v-col cols="6" sm="4">
          <FieldLabel :label="t.timeout" required for="cpa-f-timeout" />
          <v-text-field id="cpa-f-timeout" v-model.number="form.timeout" type="number" min="1" :rules="rules.positive" hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.note" for="cpa-f-note" />
          <v-text-field id="cpa-f-note" v-model="note" :placeholder="t.notePlaceholder" hide-details />
        </v-col>
      </v-row>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-check" @click="submit">{{ t.save }}</v-btn>
    </template>
  </AppDialog>
</template>
