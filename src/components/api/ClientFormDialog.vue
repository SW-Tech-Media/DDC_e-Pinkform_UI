<script setup>
// Dialog สร้าง API Client (B-24) — ชื่อ วิธียืนยันตัวตน (API Key / OAuth 2.0) Scope วันหมดอายุ
import { ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import { apiMonitorText } from "@/content/api-monitor.js";
import { common } from "@/content/common.js";
import { apiScopes, apiToday, clientTypes } from "@/mocks/api-monitor.js";

const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["create"]);
const t = apiMonitorText.form;

const typeOptions = Object.entries(clientTypes).map(([value, c]) => ({ value, label: c.label }));
const blank = () => ({ name: "", type: "apiKey", scopes: ["requests:read"], expiresOn: "2027-10-31" });
const form = ref(blank());
const formRef = ref(null);
watch(open, (v) => {
  if (!v) return;
  form.value = blank();
  formRef.value?.resetValidation();
});

const rules = {
  name: [(v) => !!v?.trim() || t.required],
  scopes: [(v) => v.length > 0 || t.scopeRequired],
};
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid || !form.value.expiresOn) return;
  emit("create", { ...form.value, name: form.value.name.trim() });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="t.subtitle">
    <v-form ref="formRef" @submit.prevent="submit">
      <v-row dense>
        <v-col cols="12">
          <FieldLabel :label="t.name" required for="ac-name" />
          <v-text-field id="ac-name" v-model="form.name" :placeholder="t.namePlaceholder" :rules="rules.name" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.type" required />
          <SegmentedControl v-model="form.type" :options="typeOptions" :label="t.type" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.expiresOn" required for="ac-exp" />
          <DateField id="ac-exp" v-model="form.expiresOn" :min="apiToday" />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.scopes" required for="ac-scopes" />
          <v-select id="ac-scopes" v-model="form.scopes" :items="apiScopes" :rules="rules.scopes" multiple chips closable-chips hide-details="auto" />
        </v-col>
      </v-row>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-key" @click="submit">{{ t.submit }}</v-btn>
    </template>
  </AppDialog>
</template>
