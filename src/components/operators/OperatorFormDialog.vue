<script setup>
// Dialog เพิ่ม / แก้ไขผู้ประกอบการ — operator = null คือเพิ่มใหม่ · emit save(ข้อมูลใหม่)
import { computed, ref, watch } from "vue";
import FieldLabel from "@/components/FieldLabel.vue";
import { operatorsText as t } from "@/content/operators.js";
import { common } from "@/content/common.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  operator: { type: Object, default: null },
});
const emit = defineEmits(["save"]);
const model = defineModel({ type: Boolean, default: false });

const blank = { taxId: "", branch: "00000", nameTh: "", nameEn: "", type: "exporter", service: "certificate", nswId: "", access: "active", lastRequestAt: null };
const form = ref({ ...blank });
const formRef = ref(null);
watch(model, (open) => open && (form.value = { ...blank, ...(props.operator ?? {}) }));

const options = (map) => Object.entries(map).map(([value, v]) => ({ value, title: v.label }));
const typeItems = options(operatorTypes);
const serviceItems = options(operatorServices);
const accessItems = options(operatorAccess);

const required = (v) => !!String(v ?? "").trim() || t.dialogs.required;
const taxRule = (v) => /^\d{13}$/.test(v) || t.dialogs.taxIdRule;
const isEdit = computed(() => !!props.operator);
const c = t.columns;
const f = t.filters;

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) emit("save", { ...form.value });
};
</script>

<template>
  <v-dialog v-model="model" :max-width="size['dialog-md']">
    <v-card class="pf-elevation-modal">
      <div class="px-6 py-5 pf-bordered-bottom">
        <h2 class="pf-type-h4 text-text-primary">{{ isEdit ? t.dialogs.editTitle : t.dialogs.addTitle }}</h2>
      </div>
      <v-form ref="formRef" class="pa-6" @submit.prevent="submit">
        <v-row dense>
          <v-col cols="12" sm="8">
            <FieldLabel :label="f.taxId.label" for="o-tax" required />
            <v-text-field id="o-tax" v-model="form.taxId" :placeholder="f.taxId.placeholder" :rules="[required, taxRule]" :readonly="isEdit" />
          </v-col>
          <v-col cols="12" sm="4">
            <FieldLabel :label="f.branch.label" for="o-branch" required />
            <v-text-field id="o-branch" v-model="form.branch" :rules="[required]" />
          </v-col>
          <v-col cols="12">
            <FieldLabel :label="t.dialogs.nameTh" for="o-th" required />
            <v-text-field id="o-th" v-model="form.nameTh" :rules="[required]" />
          </v-col>
          <v-col cols="12">
            <FieldLabel :label="t.dialogs.nameEn" for="o-en" required />
            <v-text-field id="o-en" v-model="form.nameEn" :rules="[required]" />
          </v-col>
          <v-col cols="12" sm="6">
            <FieldLabel :label="c.type" for="o-type" />
            <v-select id="o-type" v-model="form.type" :items="typeItems" />
          </v-col>
          <v-col cols="12" sm="6">
            <FieldLabel :label="c.service" for="o-service" />
            <v-select id="o-service" v-model="form.service" :items="serviceItems" />
          </v-col>
          <v-col cols="12" sm="6">
            <FieldLabel :label="c.nswId" for="o-nsw" required />
            <v-text-field id="o-nsw" v-model="form.nswId" :rules="[required]" />
          </v-col>
          <v-col cols="12" sm="6">
            <FieldLabel :label="c.access" for="o-access" />
            <v-select id="o-access" v-model="form.access" :items="accessItems" />
          </v-col>
        </v-row>
      </v-form>
      <div class="d-flex justify-end ga-3 px-6 py-4 pf-bordered-top">
        <v-btn variant="outlined" color="secondary" :height="size['control-md']" @click="model = false">
          {{ common.actions.cancel }}
        </v-btn>
        <v-btn color="primary" :height="size['control-md']" @click="submit">{{ common.actions.save }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
