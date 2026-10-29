<script setup>
// Dialog เพิ่ม / แก้ไขรายงานที่บันทึกไว้ (B-13) — ชื่อรายงาน + ประเภท + ช่วงวันที่
// report = ค่าเริ่มต้น { name, type, range } · mode: add | edit · emit save({ name, type, range })
import { reactive, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import { reportsText } from "@/content/reports.js";
import { common } from "@/content/common.js";

const props = defineProps({
  report: { type: Object, default: null },
  mode: { type: String, default: "add" },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);

const t = reportsText.saved;
const typeOptions = Object.entries(reportsText.types).map(([value, x]) => ({ title: x.label, value }));
const form = reactive({ name: "", type: "fees", range: null });
const error = ref("");

watch(open, (v) => {
  if (!v || !props.report) return;
  Object.assign(form, { name: props.report.name ?? "", type: props.report.type, range: [...props.report.range] });
  error.value = "";
});

const save = () => {
  if (!form.name.trim()) return (error.value = t.nameRequired);
  emit("save", { name: form.name.trim(), type: form.type, range: form.range ? [...form.range] : props.report.range });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="mode === 'edit' ? t.editTitle : t.addTitle">
    <v-form class="d-flex flex-column ga-4" @submit.prevent="save">
      <div>
        <FieldLabel :label="t.name" for="sr-name" required />
        <v-text-field
          id="sr-name"
          v-model="form.name"
          :placeholder="t.namePlaceholder"
          :error-messages="error"
          :hide-details="!error"
          autofocus
          @update:model-value="error = ''"
        />
      </div>
      <div>
        <FieldLabel :label="reportsText.settings.type" for="sr-type" />
        <v-select id="sr-type" v-model="form.type" :items="typeOptions" hide-details />
      </div>
      <div>
        <FieldLabel :label="reportsText.settings.range" for="sr-range" />
        <DateField id="sr-range" v-model="form.range" range :placeholder="reportsText.settings.rangePlaceholder" />
      </div>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="far fa-floppy-disk" @click="save">{{ common.actions.save }}</v-btn>
    </template>
  </AppDialog>
</template>
