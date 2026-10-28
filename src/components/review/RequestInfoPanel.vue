<script setup>
// แท็บ "ข้อมูลคำขอ" ของ D10: ผู้ส่งออก / ผู้รับสินค้า + โหมดแก้ไขข้อมูลโดยเจ้าหน้าที่ (TOR 4.4.2 (4))
// emit save({ exporter, consignee }, changedLabels)
import { computed, reactive, ref } from "vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import KeyValueRows from "./KeyValueRows.vue";
import { reviewText } from "@/content/review.js";
import { formatDate } from "@/utils/format.js";

const props = defineProps({
  detail: { type: Object, required: true },
  locked: { type: Boolean, default: false },
  lastEdit: { type: String, default: "" },
});
const emit = defineEmits(["save"]);
const t = reviewText.info;

const exporterRows = computed(() => [
  { label: t.companyName, lines: [props.detail.exporter.nameTh, props.detail.exporter.nameEn] },
  { label: t.taxBranch, value: `${props.detail.exporter.taxId} / ${props.detail.exporter.branch}` },
  { label: t.brand, value: props.detail.exporter.brand },
  { label: t.invoice, lines: [props.detail.exporter.invoice, `(${formatDate(props.detail.exporter.invoiceDate)})`] },
]);
const consigneeRows = computed(() => [
  { label: t.consigneeName, value: props.detail.consignee.name },
  { label: t.country, value: props.detail.consignee.country },
  { label: t.route, value: props.detail.consignee.route },
  { label: t.transport, value: props.detail.consignee.transport },
]);

// ช่องที่แก้ไขได้: [กลุ่ม, key, label]
const fields = [
  ["exporter", "nameTh", t.companyNameTh],
  ["exporter", "nameEn", t.companyNameEn],
  ["exporter", "brand", t.brand],
  ["exporter", "invoice", t.invoice],
  ["consignee", "name", t.consigneeName],
  ["consignee", "route", t.route],
];
const editing = ref(false);
const form = reactive({ exporter: {}, consignee: {} });

const startEdit = () => {
  for (const [g, k] of fields) form[g][k] = props.detail[g][k];
  form.consignee.transport = props.detail.consignee.transport;
  editing.value = true;
};
const save = () => {
  const changed = fields.filter(([g, k]) => form[g][k] !== props.detail[g][k]).map(([, , label]) => label);
  if (form.consignee.transport !== props.detail.consignee.transport) changed.push(t.transport);
  emit("save", { exporter: { ...form.exporter }, consignee: { ...form.consignee } }, changed);
  editing.value = false;
};
</script>

<template>
  <div>
    <template v-if="editing">
      <AlertBox tone="info" :title="t.editing" icon="fas fa-pen-to-square" class="mb-5">{{ t.editHint }}</AlertBox>
      <v-row dense>
        <v-col v-for="[g, k, label] in fields" :key="g + k" cols="12" sm="6">
          <FieldLabel :label="label" :for="`edit-${g}-${k}`" />
          <v-text-field :id="`edit-${g}-${k}`" v-model="form[g][k]" hide-details density="comfortable" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.transport" for="edit-transport" />
          <v-select id="edit-transport" v-model="form.consignee.transport" :items="t.transports" hide-details density="comfortable" />
        </v-col>
      </v-row>
      <div class="d-flex justify-end ga-3 mt-5">
        <v-btn variant="outlined" color="secondary" @click="editing = false">{{ t.cancel }}</v-btn>
        <v-btn color="primary" prepend-icon="fas fa-floppy-disk" @click="save">{{ t.save }}</v-btn>
      </div>
    </template>

    <v-row v-else>
      <v-col cols="12" md="6">
        <h3 class="pf-type-h4 text-text-brand mb-4">{{ t.exporter }}</h3>
        <KeyValueRows :items="exporterRows" />
      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex align-center justify-space-between ga-2 mb-4">
          <h3 class="pf-type-h4 text-text-brand">{{ t.consignee }}</h3>
          <v-btn v-if="!locked" variant="text" color="primary" size="small" prepend-icon="fas fa-pen" @click="startEdit">
            {{ t.edit }}
          </v-btn>
        </div>
        <KeyValueRows :items="consigneeRows" />
      </v-col>
      <v-col v-if="locked || lastEdit" cols="12" class="pt-0">
        <span class="pf-type-caption text-text-tertiary">
          <v-icon :icon="locked ? 'fas fa-lock' : 'fas fa-clock-rotate-left'" size="x-small" class="me-1" />
          {{ locked ? t.locked : lastEdit }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>
