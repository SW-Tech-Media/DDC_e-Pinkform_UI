<script setup>
// Dialog เพิ่ม / แก้ไขข้อมูลหลัก (B-15) — สร้างช่องกรอกจาก dataset.fields
// type: text (ค่าเริ่มต้น) · select · textarea · status (ใช้ / ไม่ได้ใช้) · file (เก็บชื่อไฟล์)
// existing = รายการทั้งหมด (ใช้ตรวจรหัสซ้ำของฟิลด์ unique) · emit save(data)
import { computed, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { masterText as t } from "@/content/master-data.js";
import { common } from "@/content/common.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  dataset: { type: Object, required: true },
  item: { type: Object, default: null },
  existing: { type: Array, default: () => [] },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);

const draft = ref({});
const formRef = ref(null);
const blank = () =>
  Object.fromEntries(props.dataset.fields.map((f) => [f.key, f.type === "status" ? "active" : f.type === "select" && f.key === "kind" ? "reject" : ""]));
watch(open, (v) => {
  if (v) draft.value = props.item ? { ...props.item } : blank();
});

const title = computed(() => (props.item ? t.editTitle(props.dataset.label) : t.addTitle(props.dataset.label)));
const required = (v) => !!String(v ?? "").trim() || t.required;
const unique = (key) => (v) =>
  !props.existing.some((r) => r.id !== props.item?.id && String(r[key]).toLowerCase() === String(v).trim().toLowerCase()) ||
  t.duplicate;
const rulesFor = (f) => [...(f.required ? [required] : []), ...(f.unique ? [unique(f.key)] : [])];
const statusOptions = computed(() => props.dataset.statusItems ?? []);
// ช่องไฟล์: กดแล้วเปิดตัวเลือกไฟล์ เก็บเฉพาะชื่อไฟล์ (Prototype)
const fileInput = ref(null);
const fileKey = ref("");
const browse = (key) => {
  fileKey.value = key;
  fileInput.value.click();
};
const pickFile = (files) => {
  if (files?.[0]) draft.value[fileKey.value] = files[0].name;
  fileInput.value.value = "";
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...draft.value });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="title" :subtitle="t.formSubtitle(dataset.no)">
    <v-form ref="formRef" @submit.prevent="save">
      <v-row dense>
        <v-col v-for="f in dataset.fields" :key="f.key" cols="12" :sm="f.full ? 12 : 6">
          <FieldLabel :label="f.label" :for="`md-${f.key}`" :required="f.required" />
          <v-select
            v-if="f.type === 'select'"
            :id="`md-${f.key}`"
            v-model="draft[f.key]"
            :items="f.items"
            :placeholder="t.selectPlaceholder"
            :rules="rulesFor(f)"
            hide-details="auto"
          />
          <v-select
            v-else-if="f.type === 'status'"
            :id="`md-${f.key}`"
            v-model="draft[f.key]"
            :items="statusOptions"
            hide-details="auto"
          />
          <v-textarea
            v-else-if="f.type === 'textarea'"
            :id="`md-${f.key}`"
            v-model="draft[f.key]"
            rows="2"
            auto-grow
            :rules="rulesFor(f)"
            hide-details="auto"
          />
          <v-text-field
            v-else-if="f.type === 'file'"
            :id="`md-${f.key}`"
            :model-value="draft[f.key]"
            :rules="rulesFor(f)"
            prepend-inner-icon="far fa-file-image"
            readonly
            hide-details="auto"
            append-inner-icon="fas fa-upload"
            @click="browse(f.key)"
          />
          <v-text-field
            v-else
            :id="`md-${f.key}`"
            v-model="draft[f.key]"
            :placeholder="f.placeholder"
            :rules="rulesFor(f)"
            hide-details="auto"
          />
        </v-col>
      </v-row>
    </v-form>
    <input ref="fileInput" type="file" accept="image/png" class="d-none" @change="pickFile($event.target.files)" />
    <template #actions>
      <SecondaryButton height="control-md" @click="open = false">{{ common.actions.cancel }}</SecondaryButton>
      <v-btn color="primary" prepend-icon="fas fa-check" :height="size['control-md']" @click="save">{{ common.actions.save }}</v-btn>
    </template>
  </AppDialog>
</template>
