<script setup>
// Dialog เพิ่ม / แก้ไขคำถามแบบสอบถาม (B-22) — ประเภท คะแนน 1–5 หรือ ข้อความ
import { ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import { surveysAdminText } from "@/content/surveys-admin.js";
import { common } from "@/content/common.js";
import { questionTypes, surveyAspects } from "@/mocks/surveys-admin.js";

const props = defineProps({
  question: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);
const t = surveysAdminText.form;

const aspectItems = Object.entries(surveyAspects).map(([value, a]) => ({ value, title: a.label }));
const typeOptions = Object.entries(questionTypes).map(([value, q]) => ({ value, label: q.label }));
const blank = () => ({ text: "", aspect: "convenience", type: "rating", required: true, active: true });

const form = ref(blank());
const formRef = ref(null);
watch(open, (v) => {
  if (!v) return;
  form.value = props.question ? { ...props.question } : blank();
  formRef.value?.resetValidation();
});

const rules = [(v) => !!v?.trim() || t.requiredMsg];
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...form.value });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="question ? t.editTitle : t.addTitle">
    <v-form ref="formRef" @submit.prevent="submit">
      <v-row dense>
        <v-col cols="12">
          <FieldLabel :label="t.text" required for="qf-text" />
          <v-textarea id="qf-text" v-model="form.text" :placeholder="t.textPlaceholder" :rules="rules" rows="2" auto-grow hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.aspect" required for="qf-aspect" />
          <v-select id="qf-aspect" v-model="form.aspect" :items="aspectItems" hide-details />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.type" required />
          <SegmentedControl v-model="form.type" :options="typeOptions" :label="t.type" />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.preview" />
          <div class="preview bg-bg-surface-muted rounded-lg pa-4">
            <v-rating v-if="form.type === 'rating'" :length="5" :model-value="0" readonly density="compact" color="icon-muted" active-color="warning" empty-icon="far fa-star" full-icon="fas fa-star" />
            <span v-else class="pf-type-body-sm text-text-tertiary">{{ t.textPreview }}</span>
          </div>
        </v-col>
        <v-col cols="12" class="d-flex flex-wrap ga-6">
          <v-switch v-model="form.required" :label="t.required" color="success" inset hide-details density="compact" />
          <v-switch v-model="form.active" :label="t.active" color="success" inset hide-details density="compact" />
        </v-col>
      </v-row>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-check" @click="submit">{{ t.save }}</v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.preview {
  border: var(--pf-stroke-default) dashed rgb(var(--v-theme-border-default));
}
</style>
