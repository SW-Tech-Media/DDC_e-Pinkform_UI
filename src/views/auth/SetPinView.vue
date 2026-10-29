<script setup>
// D06 · Admin / Set PIN – Confirm (Validation) (B-01.3) — ตรวจเงื่อนไขแบบ real-time
// ลำดับตาม Flow 4.1 ส่วน A: ตรวจลิงก์ยืนยันอีเมล → 4. ตั้งรหัสผ่านตามนโยบาย → 5. ตั้ง PIN → 6. เปิดใช้งานบัญชี
// ลิงก์ไม่ถูกต้อง / หมดอายุ / ใช้แล้ว → แจ้งและขอลิงก์ใหม่ (Flow 4.1 "ไม่ใช่: ส่งลิงก์ใหม่")
// query: ?link=<token> (จำลอง expired | used | invalid | error — ดู mocks/auth.js) · ?step=pin = เปิดขั้นตั้ง PIN ตาม Figma D06
// รหัสผ่าน + PIN ส่ง backend พร้อมกันครั้งเดียวตอนจบ (ไม่มีบัญชีที่ตั้งได้ครึ่งเดียว) — นโยบายรหัสผ่านสมมติฐานรอ Q-20
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import IconTile from "@/components/IconTile.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import PinCells from "@/components/auth/PinCells.vue";
import PinRuleList from "@/components/auth/PinRuleList.vue";
import PasswordField from "@/components/auth/PasswordField.vue";
import { authText } from "@/content/auth.js";
import { authMock } from "@/mocks/auth.js";
import { size, space } from "@/design/tokens.js";
import { PIN_LENGTH, checkPin } from "@/utils/pin.js";
import { checkPassword, passwordValid } from "@/utils/password.js";
import { authApi } from "@/api/auth.js";
import { useSessionStore } from "@/stores/session.js";

const t = authText.setPin;
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const token = typeof route.query.link === "string" ? route.query.link : "";

// ---------- ตรวจลิงก์ ----------
// phase: 'verifying' | 'ready' | 'link' (ลิงก์ใช้ไม่ได้ / ระบบขัดข้อง)
const phase = ref("verifying");
const linkState = ref("");
const account = ref({ username: "", email: "" });
const linkCodes = { LINK_EXPIRED: "expired", LINK_USED: "used", LINK_INVALID: "invalid" };
const showLink = (e) => {
  linkState.value = linkCodes[e.code] ?? "error";
  phase.value = "link";
};

const verify = async () => {
  phase.value = "verifying";
  try {
    account.value = await authApi.verifyEmailLink(token);
    phase.value = "ready";
  } catch (e) {
    showLink(e);
  }
};
onMounted(verify);

// ขอลิงก์ใหม่ (เฉพาะลิงก์หมดอายุ — ลิงก์ไม่ถูกต้องระบุบัญชีไม่ได้ ต้องให้ผู้ดูแลระบบส่งใหม่ที่ B-16)
const resending = ref(false);
const resent = ref(null);
const resendError = ref(false);
const resend = async () => {
  resending.value = true;
  resendError.value = false;
  try {
    resent.value = await authApi.resendVerification(token);
  } catch {
    resendError.value = true;
  } finally {
    resending.value = false;
  }
};

// ---------- ขั้นตั้งรหัสผ่าน ----------
const directPin = route.query.step === "pin";
const step = ref(directPin ? "pin" : "password");
const password = ref(directPin ? authMock.sampleNewPassword : "");
const confirmPassword = ref(directPin ? authMock.sampleNewPassword : "");
const pwResult = computed(() => checkPassword(password.value, confirmPassword.value, account.value.username));
const pwRules = computed(() => Object.entries(authText.passwordRules).map(([k, label]) => ({ label, state: pwResult.value[k] })));
const pwValid = computed(() => passwordValid(pwResult.value));
const nextStep = () => {
  if (pwValid.value) step.value = "pin";
};

// ---------- ขั้นตั้ง PIN ----------
const pin = ref("");
const confirm = ref("");
const result = computed(() => checkPin(pin.value, confirm.value));
const rules = computed(() => Object.entries(t.rules).map(([k, label]) => ({ label, state: result.value[k] })));
const valid = computed(() => Object.values(result.value).every((s) => s === "pass"));

// กรอก PIN ใหม่ครบ 6 หลัก → ไปช่องยืนยันอัตโนมัติ
watch(pin, (v) => {
  if (v.length === PIN_LENGTH && !confirm.value) document.getElementById("confirm-pin")?.focus();
});

const saving = ref(false);
const saveError = ref(false);
const submit = async () => {
  if (!valid.value || saving.value) return;
  if (!pwValid.value) return (step.value = "password");
  saving.value = true;
  saveError.value = false;
  try {
    await authApi.activateAccount({ token, password: password.value, pin: pin.value });
    session.startLogin(account.value.username);
    router.push({ name: "admin-login", query: { notice: "activated" } });
  } catch (e) {
    if (e.code in linkCodes) showLink(e);
    else saveError.value = true;
  } finally {
    saving.value = false;
  }
};

const current = computed(() => (phase.value !== "ready" ? 0 : step.value === "password" ? 1 : 2));
const linkIcon = { expired: "far fa-clock", used: "fas fa-link", invalid: "fas fa-link-slash", error: "fas fa-plug-circle-xmark" };
const linkTone = { expired: "amber", used: "blue", invalid: "red", error: "red" };
</script>

<template>
  <AuthLayout>
    <!-- กำลังตรวจลิงก์ -->
    <template v-if="phase === 'verifying'">
      <StepIndicator :steps="t.steps" :current="0" compact class="mb-8" />
      <div class="d-flex align-center ga-3 pf-type-body-md text-text-secondary" role="status">
        <v-progress-circular indeterminate color="primary" :size="size['icon-md']" :width="space[1]" />
        {{ t.verifying }}
      </div>
    </template>

    <!-- ลิงก์หมดอายุ / ใช้แล้ว / ไม่ถูกต้อง / ระบบขัดข้อง -->
    <template v-else-if="phase === 'link'">
      <StepIndicator :steps="t.steps" :current="0" compact class="mb-8" />
      <IconTile :icon="linkIcon[linkState]" :tone="linkTone[linkState]" size="lg" class="mb-6" />
      <h1 class="pf-type-h2 text-text-primary">{{ t.link[linkState].title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.link[linkState].text }}</p>

      <AlertBox v-if="resent" tone="success" icon="far fa-envelope" class="mb-5">
        {{ t.link.resent(resent.email, resent.expiresInHours) }}
      </AlertBox>
      <AlertBox v-if="resendError" tone="danger" class="mb-5">{{ t.link.resendError }}</AlertBox>

      <v-btn
        v-if="linkState === 'expired'"
        color="bg-bg-inverse"
        :height="size['control-lg']"
        :loading="resending"
        block
        prepend-icon="fas fa-rotate"
        class="pf-type-label-lg mb-3"
        @click="resend"
      >
        {{ t.link.resend }}
      </v-btn>
      <v-btn
        v-else-if="linkState === 'error'"
        color="bg-bg-inverse"
        :height="size['control-lg']"
        block
        prepend-icon="fas fa-rotate-right"
        class="pf-type-label-lg mb-3"
        @click="verify"
      >
        {{ t.link.retry }}
      </v-btn>
      <SecondaryButton block icon="fas fa-right-to-bracket" :to="{ name: 'admin-login' }">{{ t.link.toLogin }}</SecondaryButton>
      <v-btn
        v-if="linkState === 'used'"
        :to="{ name: 'admin-forgot-password' }"
        variant="text"
        color="text-text-link"
        class="pf-type-label-md px-2 mt-3"
      >
        {{ t.link.forgot }}
      </v-btn>
    </template>

    <!-- ลิงก์ถูกต้อง -->
    <template v-else>
      <AlertBox tone="success" icon="far fa-circle-check" class="mb-5">{{ t.verified(account.email) }}</AlertBox>
      <StepIndicator :steps="t.steps" :current="current" compact class="mb-5" />

      <!-- 4. ตั้งรหัสผ่าน -->
      <template v-if="step === 'password'">
        <h1 class="pf-type-h2 text-text-primary">{{ t.password.title }}</h1>
        <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.password.subtitle(account.username) }}</p>

        <v-form @submit.prevent="nextStep">
          <FieldLabel :label="t.password.newPassword" for="new-password" />
          <PasswordField
            id="new-password"
            v-model="password"
            :placeholder="t.password.newPlaceholder"
            autocomplete="new-password"
            autofocus
            class="mb-5"
          />

          <FieldLabel :label="t.password.confirmPassword" for="confirm-password" />
          <PasswordField
            id="confirm-password"
            v-model="confirmPassword"
            :placeholder="t.password.confirmPlaceholder"
            :error="pwResult.match === 'fail'"
            autocomplete="new-password"
            class="mb-5"
          />

          <PinRuleList :rules="pwRules" class="mb-5" />

          <v-btn
            type="submit"
            :color="pwValid ? 'bg-bg-inverse' : 'bg-icon-muted'"
            :height="size['control-lg']"
            :disabled="!pwValid"
            block
            class="pf-type-label-lg submit"
          >
            {{ t.password.submit }}
            <v-icon icon="fas fa-chevron-right" size="x-small" end />
          </v-btn>
        </v-form>

        <AlertBox tone="info" icon="fas fa-shield-halved" class="mt-6">{{ t.passwordInfo }}</AlertBox>
      </template>

      <!-- 5. ตั้ง PIN (Figma D06) -->
      <template v-else>
        <h1 class="pf-type-h2 text-text-primary">{{ t.title }}</h1>
        <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.subtitle(account.username) }}</p>

        <v-form @submit.prevent="submit">
          <AlertBox v-if="saveError" tone="danger" class="mb-4">{{ t.saveError }}</AlertBox>

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
            :loading="saving"
            block
            class="pf-type-label-lg submit"
          >
            {{ t.submit }}
          </v-btn>
        </v-form>

        <v-btn
          variant="text"
          color="text-text-link"
          prepend-icon="fas fa-chevron-left"
          class="pf-type-label-md px-2 mt-3"
          @click="step = 'password'"
        >
          {{ t.back }}
        </v-btn>

        <AlertBox tone="info" icon="fas fa-shield-halved" class="mt-4">{{ t.info }}</AlertBox>
      </template>
    </template>
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
