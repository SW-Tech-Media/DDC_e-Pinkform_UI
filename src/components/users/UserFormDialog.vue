<script setup>
// Dialog เพิ่ม / แก้ไขผู้ใช้งาน (D15 › ปุ่ม "+ เพิ่มผู้ใช้งาน" และปุ่มแก้ไขในตาราง)
import { ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import { usersText } from "@/content/users-roles.js";
import { common } from "@/content/common.js";
import { groups, roles } from "@/mocks/users-roles.js";

const props = defineProps({
  user: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["save"]);

const t = usersText.form;
const groupItems = Object.entries(groups).map(([value, title]) => ({ value, title }));
const roleItems = Object.entries(roles).map(([value, r]) => ({ value, title: r.label }));
const blank = () => ({ name: "", username: "", email: "", group: "service", role: "user", active: true });

const form = ref(blank());
const formRef = ref(null);
watch(open, (v) => {
  if (!v) return;
  form.value = props.user ? { ...props.user } : blank();
  formRef.value?.resetValidation();
});

const rules = [(v) => !!v || t.required];
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...form.value });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="user ? t.editTitle : t.addTitle" :subtitle="user?.username">
    <v-form ref="formRef" @submit.prevent="submit">
      <v-row dense>
        <v-col cols="12">
          <FieldLabel :label="t.name" required for="uf-name" />
          <v-text-field id="uf-name" v-model="form.name" :rules="rules" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.username" required for="uf-username" />
          <v-text-field id="uf-username" v-model="form.username" :rules="rules" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.email" required for="uf-email" />
          <v-text-field id="uf-email" v-model="form.email" type="email" :rules="rules" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.group" required for="uf-group" />
          <v-select id="uf-group" v-model="form.group" :items="groupItems" hide-details />
        </v-col>
        <v-col cols="12" sm="6">
          <FieldLabel :label="t.role" required for="uf-role" />
          <v-select id="uf-role" v-model="form.role" :items="roleItems" hide-details />
        </v-col>
        <v-col cols="12">
          <v-switch v-model="form.active" :label="t.active" color="success" inset hide-details />
        </v-col>
      </v-row>
    </v-form>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.cancel }}</v-btn>
      <v-btn color="primary" prepend-icon="fas fa-check" @click="submit">{{ t.save }}</v-btn>
    </template>
  </AppDialog>
</template>
