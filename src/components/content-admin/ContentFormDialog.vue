<script setup>
// Dialog เพิ่ม / แก้ไขเนื้อหาเว็บไซต์ (B-21) — หัวข้อ หมวด เนื้อหา วันที่เผยแพร่ ไฟล์แนบ สถานะ
import { computed, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import { contentAdminText } from "@/content/content-admin.js";
import { common } from "@/content/common.js";
import { contentCategories, contentStatuses, contentToday } from "@/mocks/content-admin.js";

const props = defineProps({
  section: { type: String, required: true },
  item: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);
const t = contentAdminText.form;

const categories = computed(() => contentCategories[props.section]);
const statusItems = Object.entries(contentStatuses).map(([value, s]) => ({ value, title: s.label }));
const blank = () => ({
  title: "",
  category: categories.value[0],
  body: "",
  publishedOn: contentToday,
  status: "draft",
  attachments: [],
});

const form = ref(blank());
const files = ref([]);
const formRef = ref(null);
watch(open, (v) => {
  if (!v) return;
  form.value = props.item ? { ...props.item, attachments: [...props.item.attachments] } : blank();
  files.value = [];
  formRef.value?.resetValidation();
});

const rules = [(v) => !!v || t.required];
const removeExisting = (name) => (form.value.attachments = form.value.attachments.filter((a) => a !== name));
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid || !form.value.publishedOn) return;
  const added = (files.value ?? []).map((f) => f.name);
  emit("save", { ...form.value, attachments: [...form.value.attachments, ...added] });
  open.value = false;
};
</script>

<template>
  <AppDialog
    v-model="open"
    :title="item ? t.editTitle : t.addTitle(contentAdminText.tabs[section])"
    :subtitle="contentAdminText.tabs[section]"
  >
    <v-form ref="formRef" @submit.prevent="submit">
      <v-row dense>
        <v-col cols="12">
          <FieldLabel :label="t.title" required for="cf-title" />
          <v-text-field id="cf-title" v-model="form.title" :placeholder="t.titlePlaceholder" :rules="rules" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.category" required for="cf-category" />
          <v-select id="cf-category" v-model="form.category" :items="categories" hide-details />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.publishedOn" required for="cf-date" />
          <DateField id="cf-date" v-model="form.publishedOn" />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.body" for="cf-body" />
          <v-textarea id="cf-body" v-model="form.body" :placeholder="t.bodyPlaceholder" rows="4" auto-grow hide-details />
        </v-col>
        <v-col cols="12">
          <FieldLabel :label="t.attachments" for="cf-files" />
          <div v-if="form.attachments.length" class="d-flex flex-wrap ga-2 mb-2">
            <v-chip
              v-for="a in form.attachments"
              :key="a"
              size="small"
              prepend-icon="far fa-file-lines"
              closable
              @click:close="removeExisting(a)"
            >
              {{ a }}
            </v-chip>
          </div>
          <v-file-input
            id="cf-files"
            v-model="files"
            multiple
            chips
            prepend-icon=""
            prepend-inner-icon="fas fa-paperclip"
            :hint="t.attachmentsHint"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.status" required for="cf-status" />
          <v-select id="cf-status" v-model="form.status" :items="statusItems" hide-details />
        </v-col>
      </v-row>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-check" @click="submit">{{ t.save }}</v-btn>
    </template>
  </AppDialog>
</template>
