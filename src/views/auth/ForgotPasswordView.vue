<script setup>
// B-01.5 · ลืมรหัสผ่าน / ตั้งรหัสผ่านใหม่ (เสนอเพิ่ม — Flow 4 ขั้นที่ 1 · TOR 4.1.11) — ยังไม่มีใน Figma ใช้สไตล์ D04 – D06 และรูปแบบเดียวกับ B-01.4
// ขั้น: 0 ระบุบัญชี → 1 ส่งลิงก์ทางอีเมล (อายุ 30 นาที) → 2 ตั้งรหัสผ่านใหม่ตามนโยบาย → 3 สำเร็จ
// query ?step=0..3 สำหรับเปิดดูแต่ละขั้น · ชื่อผู้ใช้ "offline.demo" = ระบบขัดข้อง · บัญชีที่ถูกระงับ (ผิดครบ 5 ครั้งที่ B-01) ขอรีเซ็ตไม่ได้
// ความปลอดภัย: ขั้น 1 ตอบเหมือนกันทุกบัญชี (ไม่บอกว่าบัญชีมีอยู่หรือไม่) · PIN เดิมไม่เปลี่ยน — เข้าสู่ระบบยังต้องผ่าน 2FA
// นโยบายรหัสผ่าน / อายุลิงก์ เป็นสมมติฐานรอ Q-20
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import IconTile from "@/components/IconTile.vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import PinRuleList from "@/components/auth/PinRuleList.vue";
import PasswordField from "@/components/auth/PasswordField.vue";
import { forgotPasswordText as t } from "@/content/forgot-password.js";
import { authText } from "@/content/auth.js";
import { authMock } from "@/mocks/auth.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { checkPassword, passwordValid } from "@/utils/password.js";
import { authApi } from "@/api/auth.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const step = ref(Math.min(3, Math.max(0, Number(route.query.step) || 0)));

// ---------- ขั้น 1 ระบุบัญชี ----------
const account = ref(session.pendingUsername || "");
// '' | 'required' | 'suspended' | 'network'
const identifyError = ref("");
const requesting = ref(false);
const accountName = computed(() => account.value.trim() || staff.somrudee.username);

const identify = async () => {
  if (requesting.value) return;
  if (!account.value.trim()) return (identifyError.value = "required");
  requesting.value = true;
  try {
    await authApi.requestPasswordReset(account.value.trim());
    identifyError.value = "";
    step.value = 1;
  } catch (e) {
    identifyError.value = e.code === "ACCOUNT_SUSPENDED" ? "suspended" : "network";
  } finally {
    requesting.value = false;
  }
};
watch(account, () => (identifyError.value = ""));

// ---------- ขั้น 2 ลิงก์ทางอีเมล (นับถอยหลัง 30 นาที) ----------
const secondsLeft = ref(authMock.resetLinkMinutes * 60);
const resent = ref(false);
const resendError = ref(false);
let timer = null;
const startTimer = () => {
  clearInterval(timer);
  secondsLeft.value = authMock.resetLinkMinutes * 60;
  timer = setInterval(() => (secondsLeft.value = Math.max(0, secondsLeft.value - 1)), 1000);
};
const mmss = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, "0")}`);
const expired = computed(() => secondsLeft.value <= 0);
const resend = async () => {
  resendError.value = false;
  try {
    await authApi.requestPasswordReset(accountName.value);
    startTimer();
    resent.value = true;
  } catch {
    resendError.value = true;
  }
};
const changeAccount = () => {
  resent.value = false;
  step.value = 0;
};
const openLink = () => {
  clearInterval(timer);
  step.value = 2;
};
watch(step, (s) => (s === 1 ? startTimer() : clearInterval(timer)), { immediate: true });
onBeforeUnmount(() => clearInterval(timer));

// ---------- ขั้น 3 ตั้งรหัสผ่านใหม่ ----------
const password = ref("");
const confirm = ref("");
// '' | 'reused' | 'network'
const saveError = ref("");
const saving = ref(false);
const result = computed(() => checkPassword(password.value, confirm.value, accountName.value.split("@")[0]));
const rules = computed(() => Object.entries(authText.passwordRules).map(([k, label]) => ({ label, state: result.value[k] })));
const valid = computed(() => passwordValid(result.value));
watch(password, () => (saveError.value = ""));

const save = async () => {
  if (!valid.value || saving.value) return;
  saving.value = true;
  try {
    // ระบบจริงส่ง token จากลิงก์ในอีเมล — Prototype ไม่มีลิงก์จริงจึงส่ง token จำลอง
    await authApi.resetPassword({ token: "demo", account: accountName.value, password: password.value });
    saveError.value = "";
    step.value = 3;
  } catch (e) {
    saveError.value = e.code === "PASSWORD_REUSED" ? "reused" : "network";
  } finally {
    saving.value = false;
  }
};

const goLogin = () => {
  session.pendingUsername = accountName.value.split("@")[0];
  router.push({ name: "admin-login", query: { notice: "password-reset" } });
};
</script>

<template>
  <AuthLayout>
    <AlertBox v-if="step === 2" tone="success" icon="far fa-circle-check" class="mb-5">{{ t.reset.verified }}</AlertBox>
    <StepIndicator :steps="t.steps" :current="Math.min(step, 2)" :complete="step === 3" compact class="mb-8 fp-steps" />

    <!-- ขั้น 1 ระบุบัญชี -->
    <template v-if="step === 0">
      <IconTile icon="fas fa-key" tone="teal" size="lg" class="mb-6" />
      <h1 class="pf-type-h1 text-text-primary">{{ t.identify.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.identify.subtitle }}</p>

      <v-form @submit.prevent="identify">
        <AlertBox v-if="identifyError === 'required'" tone="danger" class="mb-4">{{ t.identify.required }}</AlertBox>
        <AlertBox v-else-if="identifyError === 'suspended'" tone="danger" icon="fas fa-user-lock" :title="t.identify.suspendedTitle" class="mb-4">
          {{ t.identify.suspended }}
        </AlertBox>
        <AlertBox v-else-if="identifyError === 'network'" tone="danger" icon="fas fa-plug-circle-xmark" :title="t.identify.networkTitle" class="mb-4">
          {{ t.identify.network }}
          <template #aside>
            <v-btn variant="text" color="text-text-link" size="small" class="pf-type-label-md" :loading="requesting" @click="identify">
              {{ t.identify.retry }}
            </v-btn>
          </template>
        </AlertBox>

        <FieldLabel :label="t.identify.label" for="fpw-account" />
        <v-text-field
          id="fpw-account"
          v-model="account"
          :placeholder="t.identify.placeholder"
          prepend-inner-icon="far fa-envelope"
          autocomplete="username"
          hide-details
          class="mb-6"
        />
        <v-btn type="submit" color="bg-bg-inverse" :height="size['control-lg']" :loading="requesting" block class="pf-type-label-lg">
          {{ t.identify.submit }}
          <v-icon icon="fas fa-chevron-right" size="x-small" end class="text-text-on-inverse-muted" />
        </v-btn>
      </v-form>

      <AlertBox tone="info" class="mt-6">{{ t.identify.info }}</AlertBox>
    </template>

    <!-- ขั้น 2 ส่งลิงก์ทางอีเมล -->
    <template v-else-if="step === 1">
      <IconTile icon="far fa-envelope-open" tone="teal" size="lg" class="mb-6" />
      <h1 class="pf-type-h2 text-text-primary">{{ t.sent.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.sent.subtitle(accountName) }}</p>

      <AlertBox v-if="resent && !expired" tone="success" class="mb-4">{{ t.sent.resent }}</AlertBox>
      <AlertBox v-if="resendError" tone="danger" class="mb-4">{{ t.sent.resendError }}</AlertBox>
      <AlertBox :tone="expired ? 'danger' : 'warning'" icon="far fa-clock" :title="t.sent.expiresTitle" class="mb-5">
        <span aria-live="polite">{{ expired ? t.sent.expired : t.sent.expiresIn(mmss) }}</span>
      </AlertBox>

      <div class="pf-bordered rounded-lg bg-bg-surface-muted pa-4 mb-6">
        <div class="pf-type-caption text-text-tertiary">{{ t.sent.emailPreview.from }}</div>
        <div class="pf-type-body-sm-strong text-text-primary mt-1">{{ t.sent.emailPreview.subject }}</div>
      </div>

      <v-btn
        color="bg-bg-inverse"
        :height="size['control-lg']"
        :disabled="expired"
        block
        prepend-icon="fas fa-arrow-up-right-from-square"
        class="pf-type-label-lg submit"
        @click="openLink"
      >
        {{ t.sent.open }}
      </v-btn>
      <div class="d-flex flex-wrap ga-3 mt-3">
        <SecondaryButton icon="fas fa-rotate" class="flex-grow-1" @click="resend">{{ t.sent.resend }}</SecondaryButton>
        <SecondaryButton icon="far fa-user" class="flex-grow-1" @click="changeAccount">{{ t.sent.change }}</SecondaryButton>
      </div>
      <p class="pf-type-caption text-text-tertiary mt-5">{{ t.sent.hint }}</p>
    </template>

    <!-- ขั้น 3 ตั้งรหัสผ่านใหม่ -->
    <template v-else-if="step === 2">
      <h1 class="pf-type-h2 text-text-primary">{{ t.reset.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.reset.subtitle(accountName) }}</p>

      <v-form @submit.prevent="save">
        <AlertBox v-if="saveError === 'network'" tone="danger" class="mb-4">{{ t.reset.saveError }}</AlertBox>

        <FieldLabel :label="t.reset.newPassword" for="fpw-new" />
        <PasswordField
          id="fpw-new"
          v-model="password"
          :placeholder="t.reset.newPlaceholder"
          :error="saveError === 'reused'"
          autocomplete="new-password"
          autofocus
        />
        <div class="pf-type-caption text-status-danger-fg mt-1 mb-4" aria-live="polite">
          {{ saveError === "reused" ? t.reset.reused : "" }}
        </div>

        <FieldLabel :label="t.reset.confirmPassword" for="fpw-confirm" />
        <PasswordField
          id="fpw-confirm"
          v-model="confirm"
          :placeholder="t.reset.confirmPlaceholder"
          :error="result.match === 'fail'"
          autocomplete="new-password"
          class="mb-5"
        />

        <PinRuleList :rules="rules" class="mb-3" />
        <p class="pf-type-caption text-text-tertiary mb-1">{{ t.reset.historyNote }}</p>
        <p class="pf-type-caption text-text-tertiary mb-5">{{ t.reset.demoHint(authMock.recentPasswords) }}</p>

        <v-btn
          type="submit"
          :color="valid ? 'bg-bg-inverse' : 'bg-icon-muted'"
          :height="size['control-lg']"
          :disabled="!valid"
          :loading="saving"
          block
          class="pf-type-label-lg submit"
        >
          {{ t.reset.submit }}
        </v-btn>
      </v-form>
    </template>

    <!-- สำเร็จ -->
    <template v-else>
      <IconTile icon="fas fa-circle-check" tone="green" size="lg" class="mb-6" />
      <h1 class="pf-type-h2 text-text-primary">{{ t.done.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.done.subtitle(accountName) }}</p>
      <ul class="done-list d-flex flex-column ga-3 pa-4 rounded-lg pf-bordered bg-bg-surface-muted mb-6">
        <li v-for="item in t.done.items" :key="item" class="d-flex align-start ga-2 pf-type-body-sm text-text-primary">
          <v-icon icon="fas fa-check" color="status-success-fg" size="x-small" class="mt-1" />
          {{ item }}
        </li>
      </ul>
      <v-btn color="bg-bg-inverse" :height="size['control-lg']" block class="pf-type-label-lg" @click="goLogin">
        {{ t.done.submit }}
        <v-icon icon="fas fa-chevron-right" size="x-small" end class="text-text-on-inverse-muted" />
      </v-btn>
    </template>

    <v-btn
      v-if="step < 3"
      :to="{ name: 'admin-login' }"
      variant="text"
      color="text-text-link"
      prepend-icon="fas fa-chevron-left"
      class="pf-type-label-md px-2 mt-5"
    >
      {{ t.back }}
    </v-btn>
  </AuthLayout>
</template>

<style scoped>
.fp-steps {
  flex-wrap: wrap;
  row-gap: var(--pf-space-8);
}
.done-list {
  list-style: none;
}
.submit.v-btn--disabled {
  color: rgb(var(--v-theme-text-on-inverse));
}
.submit.v-btn--disabled :deep(.v-btn__overlay) {
  opacity: 0;
}
</style>
