<script setup>
// Dialog ตั้งค่า CPA อย่างง่าย (TOR 4.6.1 (1) — Figma ยังไม่มีหน้า B-23)
import { computed, ref, watch } from "vue";
import AppDialog from "@/components/payments/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import { ebxmlText } from "@/content/ebxml.js";
import { common } from "@/content/common.js";
import { cpas } from "@/mocks/ebxml.js";

const props = defineProps({
  cpaId: { type: String, default: "" },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["saved"]);
const t = ebxmlText.cpa;

const store = ref(cpas.map((c) => ({ ...c })));
const currentId = ref(cpas[0].id);
const form = ref({ ...cpas[0] });
const load = (id) => {
  currentId.value = id;
  form.value = { ...store.value.find((c) => c.id === id) };
};
watch(open, (v) => v && load(props.cpaId && store.value.some((c) => c.id === props.cpaId) ? props.cpaId : currentId.value));
const ids = computed(() => store.value.map((c) => c.id));

const save = () => {
  const i = store.value.findIndex((c) => c.id === currentId.value);
  store.value[i] = { ...form.value };
  emit("saved", t.saved(currentId.value));
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="t.subtitle">
    <v-row dense>
      <v-col cols="12" sm="6">
        <FieldLabel :label="t.cpaId" for="cpa-id" />
        <v-select id="cpa-id" :model-value="currentId" :items="ids" hide-details @update:model-value="load" />
      </v-col>
      <v-col cols="12" sm="6">
        <FieldLabel :label="t.partner" for="cpa-partner" />
        <v-text-field id="cpa-partner" v-model="form.partner" hide-details />
      </v-col>
      <v-col cols="12">
        <FieldLabel :label="t.endpoint" for="cpa-endpoint" />
        <v-text-field id="cpa-endpoint" v-model="form.endpoint" hide-details />
      </v-col>
      <v-col cols="6">
        <FieldLabel :label="t.retries" for="cpa-retries" />
        <v-text-field id="cpa-retries" v-model.number="form.retries" type="number" min="0" hide-details />
      </v-col>
      <v-col cols="6">
        <FieldLabel :label="t.interval" for="cpa-interval" />
        <v-text-field id="cpa-interval" v-model.number="form.interval" type="number" min="0" hide-details />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="form.signature" :label="t.signature" color="success" inset hide-details density="compact" />
        <v-switch v-model="form.encryption" :label="t.encryption" color="success" inset hide-details density="compact" />
      </v-col>
      <v-col cols="12">
        <AlertBox tone="info">{{ t.note }}</AlertBox>
      </v-col>
    </v-row>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-check" @click="save">{{ t.save }}</v-btn>
    </template>
  </AppDialog>
</template>
