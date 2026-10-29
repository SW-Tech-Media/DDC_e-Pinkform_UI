<script setup>
// B-01.4 · ลืม PIN / ตั้ง PIN ใหม่ (Flow 1.1 ส่วน B) — ยังไม่มีใน Figma ใช้สไตล์ D04 – D06
// ขั้น: 0 ระบุบัญชี → 1 ส่งลิงก์ทางอีเมล (อายุ 30 นาที) → 2 ยืนยันรหัสผ่าน + ตั้ง PIN ใหม่ → 3 สำเร็จ (ปลดล็อกบัญชี)
// query ?step=0..3 สำหรับเปิดดูแต่ละขั้น
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import IconTile from "@/components/IconTile.vue";
import AlertBox from "@/components/AlertBox.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import PinCells from "@/components/auth/PinCells.vue";
import PinRuleList from "@/components/auth/PinRuleList.vue";
import { forgotPinText as t } from "@/content/forgot-pin.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { PIN_LENGTH, checkPin } from "@/utils/pin.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const { demo } = t;

const step = ref(Math.min(3, Math.max(0, Number(route.query.step) || 0)));

// ---------- ขั้น 1 ระบุบัญชี ----------
const account = ref(session.pendingUsername || "");
const identifyError = ref("");
const user = ref(null);

const findUser = (v) => {
  const q = v.trim().toLowerCase().replace(`@${demo.emailDomain}`, "");
  return Object.values(staff).find((s) => s.username === q) ?? null;
};
const maskEmail = (username) => `${username[0]}${"*".repeat(5)}@${demo.emailDomain}`;
const username = computed(() => user.value?.username || session.pendingUsername || staff.somrudee.username);
const email = computed(() => maskEmail(username.value));

const identify = () => {
  if (!account.value.trim()) return (identifyError.value = t.identify.required);
  const found = findUser(account.value);
  if (!found) return (identifyError.value = t.identify.notFound);
  identifyError.value = "";
  user.value = found;
  step.value = 1;
};

// ---------- ขั้น 2 ลิงก์ทางอีเมล (นับถอยหลัง 30 นาที) ----------
const secondsLeft = ref(demo.linkMinutes * 60);
const resent = ref(false);
let timer = null;
const startTimer = () => {
  clearInterval(timer);
  secondsLeft.value = demo.linkMinutes * 60;
  timer = setInterval(() => (secondsLeft.value = Math.max(0, secondsLeft.value - 1)), 1000);
};
const mmss = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, "0")}`);
const expired = computed(() => secondsLeft.value <= 0);
const resend = () => {
  startTimer();
  resent.value = true;
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

// ---------- ขั้น 3 ยืนยันรหัสผ่าน + ตั้ง PIN ใหม่ ----------
const password = ref("");
const showPassword = ref(false);
const passwordError = ref("");
const pin = ref("");
const confirm = ref("");

const result = computed(() => {
  const base = checkPin(pin.value, confirm.value);
  const history = pin.value.length < PIN_LENGTH ? "pending" : demo.recentPins.includes(pin.value) ? "fail" : "pass";
  return { length: base.length, sequence: base.sequence, repeat: base.repeat, history, match: base.match };
});
const rules = computed(() => Object.entries(t.reset.rules).map(([k, label]) => ({ label, state: result.value[k] })));
const valid = computed(() => Object.values(result.value).every((s) => s === "pass") && password.value.length > 0);

watch(pin, (v) => {
  if (v.length === PIN_LENGTH && !confirm.value) document.getElementById("fp-confirm-pin")?.focus();
});
watch(password, () => (passwordError.value = ""));

const save = () => {
  if (!password.value) return (passwordError.value = t.reset.passwordRequired);
  if (password.value === demo.wrongPassword) return (passwordError.value = t.reset.passwordWrong);
  if (!valid.value) return;
  // ปลดล็อกบัญชี + รีเซ็ตจำนวนครั้งที่ผิด
  session.startLogin(username.value);
  step.value = 3;
};

const goLogin = () => router.push({ name: "admin-login" });
</script>

<template>
  <AuthLayout>
    <AlertBox v-if="step === 2" tone="success" icon="far fa-circle-check" class="mb-5">{{ t.reset.verified(email) }}</AlertBox>
    <StepIndicator :steps="t.steps" :current="Math.min(step, 2)" :complete="step === 3" compact class="mb-8 fp-steps" />

    <!-- ขั้น 1 ระบุบัญชี -->
    <template v-if="step === 0">
      <IconTile icon="fas fa-key" tone="pink" size="lg" class="mb-6" />
      <h1 class="pf-type-h1 text-text-primary">{{ t.identify.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.identify.subtitle }}</p>

      <v-form @submit.prevent="identify">
        <AlertBox v-if="identifyError" tone="danger" class="mb-4">{{ identifyError }}</AlertBox>
        <FieldLabel :label="t.identify.label" for="fp-account" />
        <v-text-field
          id="fp-account"
          v-model="account"
          :placeholder="t.identify.placeholder"
          prepend-inner-icon="far fa-envelope"
          autocomplete="username"
          hide-details
          class="mb-6"
        />
        <v-btn type="submit" color="bg-bg-inverse" :height="size['control-lg']" block class="pf-type-label-lg">
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
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.sent.subtitle(email) }}</p>

      <AlertBox v-if="resent && !expired" tone="success" class="mb-4">{{ t.sent.resent }}</AlertBox>
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

    <!-- ขั้น 3 ยืนยันรหัสผ่าน + ตั้ง PIN ใหม่ -->
    <template v-else-if="step === 2">
      <h1 class="pf-type-h2 text-text-primary">{{ t.reset.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.reset.subtitle(username) }}</p>

      <v-form @submit.prevent="save">
        <FieldLabel :label="t.reset.password" for="fp-password" required />
        <v-text-field
          id="fp-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t.reset.passwordPlaceholder"
          :error="!!passwordError"
          prepend-inner-icon="fas fa-lock"
          autocomplete="current-password"
          hide-details
        >
          <template #append-inner>
            <v-btn
              :icon="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"
              :aria-label="showPassword ? t.reset.hidePassword : t.reset.showPassword"
              variant="text"
              size="small"
              color="icon-muted"
              @click="showPassword = !showPassword"
            />
          </template>
        </v-text-field>
        <div class="pf-type-caption text-status-danger-fg mt-1" aria-live="polite">{{ passwordError }}</div>

        <FieldLabel :label="t.reset.newPin" for="fp-new-pin" class="mt-4" />
        <PinCells id="fp-new-pin" v-model="pin" :label="t.reset.newPin" :error="result.history === 'fail'" input class="mb-5" />

        <FieldLabel :label="t.reset.confirmPin" for="fp-confirm-pin" />
        <PinCells
          id="fp-confirm-pin"
          v-model="confirm"
          :label="t.reset.confirmPin"
          :error="result.match === 'fail'"
          input
          class="mb-5"
        />

        <PinRuleList :rules="rules" class="mb-3" />
        <p class="pf-type-caption text-text-tertiary mb-5">{{ t.reset.demoHint(demo.recentPins) }}</p>

        <v-btn
          type="submit"
          :color="valid ? 'bg-bg-inverse' : 'bg-icon-muted'"
          :height="size['control-lg']"
          :disabled="!valid"
          block
          class="pf-type-label-lg submit"
        >
          {{ t.reset.submit }}
        </v-btn>
      </v-form>
    </template>

    <!-- สำเร็จ -->
    <template v-else>
      <IconTile icon="fas fa-unlock" tone="green" size="lg" class="mb-6" />
      <h1 class="pf-type-h2 text-text-primary">{{ t.done.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.done.subtitle(username) }}</p>
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
