<script setup>
// Dialog "+ นำเข้า Public Key Certificate" (D17) — อัปโหลดไฟล์ด้วย v-file-input (จำลอง)
import { ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import { pkiText } from "@/content/pki.js";
import { common } from "@/content/common.js";

const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["import"]);
const t = pkiText.importDialog;

const blank = () => ({ file: null, category: "partner", alias: "" });
const form = ref(blank());
const formRef = ref(null);
watch(open, (v) => {
  if (v) form.value = blank();
});

const fileOf = (v) => (Array.isArray(v) ? v[0] : v);
const rules = [(v) => !!fileOf(v) || t.required];
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  const file = fileOf(form.value.file);
  const cn = form.value.alias.trim() || file.name.replace(/\.[^.]+$/, "");
  emit("import", { cn, category: form.value.category });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="t.subtitle">
    <v-form ref="formRef" class="d-flex flex-column ga-4" @submit.prevent="submit">
      <div>
        <FieldLabel :label="t.file" required for="cert-file" />
        <v-file-input
          id="cert-file"
          v-model="form.file"
          accept=".cer,.crt,.pem,.der"
          :placeholder="t.filePlaceholder"
          prepend-icon=""
          prepend-inner-icon="fas fa-paperclip"
          :rules="rules"
          hide-details="auto"
          show-size
        />
      </div>
      <div>
        <FieldLabel :label="t.category" for="cert-cat" />
        <v-select id="cert-cat" v-model="form.category" :items="t.categories" hide-details />
      </div>
      <div>
        <FieldLabel :label="t.alias" for="cert-alias" />
        <v-text-field id="cert-alias" v-model="form.alias" :placeholder="t.aliasPlaceholder" hide-details />
      </div>
      <AlertBox tone="info">{{ t.note }}</AlertBox>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-upload" @click="submit">{{ t.submit }}</v-btn>
    </template>
  </AppDialog>
</template>
