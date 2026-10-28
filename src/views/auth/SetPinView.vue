<script setup>
// D06 · Admin / Set PIN – Confirm (Validation) (B-01.3) — ตรวจเงื่อนไขแบบ real-time
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import PinCells from "@/components/auth/PinCells.vue";
import PinRuleList from "@/components/auth/PinRuleList.vue";
import { authText } from "@/content/auth.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { PIN_LENGTH, checkPin } from "@/utils/pin.js";
import { useSessionStore } from "@/stores/session.js";

const t = authText.setPin;
const router = useRouter();
const session = useSessionStore();

const username = computed(() => session.pendingUsername || staff.somrudee.username);
const pin = ref("");
const confirm = ref("");
const result = computed(() => checkPin(pin.value, confirm.value));
const rules = computed(() => Object.entries(t.rules).map(([k, label]) => ({ label, state: result.value[k] })));
const valid = computed(() => Object.values(result.value).every((s) => s === "pass"));

// กรอก PIN ใหม่ครบ 6 หลัก → ไปช่องยืนยันอัตโนมัติ
watch(pin, (v) => {
  if (v.length === PIN_LENGTH && !confirm.value) document.getElementById("confirm-pin")?.focus();
});

const submit = () => {
  if (!valid.value) return;
  session.startLogin(username.value);
  router.push({ name: "admin-login" });
};
</script>

<template>
  <AuthLayout>
    <AlertBox tone="success" icon="far fa-circle-check" class="mb-5">{{ t.verified }}</AlertBox>
    <StepIndicator :steps="t.steps" :current="2" compact class="mb-5" />
    <h1 class="pf-type-h2 text-text-primary">{{ t.title }}</h1>
    <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.subtitle(username) }}</p>

    <v-form @submit.prevent="submit">
      <FieldLabel :label="t.newPin" for="new-pin" />
      <PinCells id="new-pin" v-model="pin" :label="t.newPin" input autofocus class="mb-5" />

      <FieldLabel :label="t.confirmPin" for="confirm-pin" />
      <PinCells
        id="confirm-pin"
        v-model="confirm"
        :label="t.confirmPin"
        :error="result.match === 'fail'"
        input
        class="mb-5"
      />

      <PinRuleList :rules="rules" class="mb-5" />

      <v-btn
        type="submit"
        :color="valid ? 'bg-bg-inverse' : 'bg-icon-muted'"
        :height="size['control-lg']"
        :disabled="!valid"
        block
        class="pf-type-label-lg submit"
      >
        {{ t.submit }}
      </v-btn>
    </v-form>

    <AlertBox tone="info" icon="fas fa-shield-halved" class="mt-6">{{ t.info }}</AlertBox>
  </AuthLayout>
</template>

<style scoped>
.submit.v-btn--disabled {
  color: rgb(var(--v-theme-text-on-inverse));
}
.submit.v-btn--disabled :deep(.v-btn__overlay) {
  opacity: 0;
}
</style>

