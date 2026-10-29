<script setup>
// (1) ข้อมูลหน่วยงาน DDC — โหมด View / Edit พร้อม "บันทึกล่าสุด วันเวลา" · emit save(data)
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import SectionCard from "@/components/SectionCard.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { masterText } from "@/content/master-data.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  org: { type: Object, required: true },
});
const emit = defineEmits(["save"]);
const t = masterText.org;
const { smAndUp } = useDisplay();

const editing = ref(false);
const draft = ref({});
const formRef = ref(null);
const rules = [(v) => !!String(v ?? "").trim() || masterText.required];

const items = computed(() => t.fields.map((f) => ({ label: f.label, value: props.org[f.key] })));
const start = () => {
  draft.value = { ...props.org };
  editing.value = true;
};
const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...draft.value });
  editing.value = false;
};
</script>

<template>
  <SectionCard :title="t.title" :subtitle="t.subtitle">
    <template #actions>
      <SecondaryButton v-if="!editing" icon="fas fa-pen" height="control-md" @click="start">{{ t.edit }}</SecondaryButton>
    </template>

    <KeyValueList v-if="!editing" :items="items" :columns="smAndUp ? 2 : 1" />

    <v-form v-else ref="formRef" @submit.prevent="save">
      <v-row dense>
        <v-col v-for="f in t.fields" :key="f.key" cols="12" :sm="f.full ? 12 : 6">
          <FieldLabel :label="f.label" :for="`org-${f.key}`" :required="f.required" />
          <v-textarea
            v-if="f.type === 'textarea'"
            :id="`org-${f.key}`"
            v-model="draft[f.key]"
            rows="2"
            auto-grow
            :rules="f.required ? rules : []"
            hide-details="auto"
          />
          <v-text-field v-else :id="`org-${f.key}`" v-model="draft[f.key]" :rules="f.required ? rules : []" hide-details="auto" />
        </v-col>
      </v-row>
      <div class="d-flex justify-end flex-wrap ga-2 mt-6">
        <SecondaryButton height="control-md" @click="editing = false">{{ t.cancel }}</SecondaryButton>
        <v-btn type="submit" color="primary" prepend-icon="fas fa-check" :height="size['control-md']">{{ t.save }}</v-btn>
      </div>
    </v-form>

    <template #footer>
      <div class="d-flex align-center ga-2 pf-type-caption text-text-tertiary">
        <v-icon icon="far fa-clock" size="x-small" />
        {{ t.lastSaved(formatDateTime(org.savedAt), org.savedBy) }}
      </div>
    </template>
  </SectionCard>
</template>
