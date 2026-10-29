<script setup>
// ช่องรหัสผ่าน + ปุ่มแสดง/ซ่อน (สไตล์ D04) — ใช้ใน B-01, B-01.3 ตั้งรหัสผ่าน, B-01.5 ตั้งรหัสผ่านใหม่
// props อื่น (id, placeholder, error, autocomplete, autofocus …) ส่งต่อให้ v-text-field
import { ref } from "vue";
import { authText } from "@/content/auth.js";

defineProps({
  icon: { type: String, default: "fas fa-lock" },
});
const model = defineModel({ type: String, default: "" });
const show = ref(false);
const t = authText.passwordField;
</script>

<template>
  <v-text-field v-model="model" :type="show ? 'text' : 'password'" :prepend-inner-icon="icon" hide-details>
    <template #append-inner>
      <v-btn
        :icon="show ? 'far fa-eye-slash' : 'far fa-eye'"
        :aria-label="show ? t.hide : t.show"
        variant="text"
        size="small"
        color="icon-muted"
        @click="show = !show"
      />
    </template>
  </v-text-field>
</template>
