<script setup>
// D05 · Admin / Login – PIN (B-01.2)
// แป้นตัวเลขสุ่มทุกครั้งที่เปิดหน้า · PIN "000000" = ผิด (จำลอง) · ผิดครบ 5 ครั้ง = ล็อก 15 นาที
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import IconTile from "@/components/IconTile.vue";
import AlertBox from "@/components/AlertBox.vue";
import PinCells from "@/components/auth/PinCells.vue";
import PinKeypad from "@/components/auth/PinKeypad.vue";
import { authText } from "@/content/auth.js";
import { forgotPinText } from "@/content/forgot-pin.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { PIN_LENGTH, shuffledDigits } from "@/utils/pin.js";
import { useSessionStore } from "@/stores/session.js";

const t = authText.pin;
const WRONG_PIN = "000000";
const router = useRouter();
const session = useSessionStore();

const username = computed(() => session.pendingUsername || staff.somrudee.username);
const digits = ref(shuffledDigits());
const pin = ref("");
const error = ref(false);
const incomplete = ref(false);
const locked = computed(() => session.pinAttemptsLeft <= 0);
const complete = computed(() => pin.value.length === PIN_LENGTH);
const message = computed(() => {
  if (incomplete.value) return t.incomplete;
  if (error.value && !locked.value) return t.wrong(session.pinAttemptsLeft);
  return t.attemptsLeft(session.pinAttemptsLeft);
});

const add = (d) => {
  if (locked.value || complete.value) return;
  error.value = false;
  incomplete.value = false;
  pin.value += d;
};
const backspace = () => {
  error.value = false;
  pin.value = pin.value.slice(0, -1);
};
const clear = () => {
  error.value = false;
  pin.value = "";
};

const submit = () => {
  if (locked.value) return;
  if (!complete.value) {
    incomplete.value = true;
    return;
  }
  if (pin.value === WRONG_PIN) {
    session.pinAttemptsLeft = Math.max(0, session.pinAttemptsLeft - 1);
    error.value = true;
    pin.value = "";
    digits.value = shuffledDigits();
    return;
  }
  // เข้าสู่ระบบแล้ว เมนูแสดงตามสิทธิ์ของบัญชีนี้ (บัญชีที่ไม่มีในรายชื่อจำลอง = โหมดตาม Figma)
  session.useAccount(username.value);
  router.push({ name: "admin-home" });
};

const onKey = (e) => {
  if (e.target.closest?.("input, textarea")) return;
  if (/^\d$/.test(e.key)) add(e.key);
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape" || e.key === "Delete") clear();
  else if (e.key === "Enter") submit();
  else return;
  e.preventDefault();
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <AuthLayout>
    <StepIndicator :steps="authText.loginSteps" :current="1" compact class="mb-8" />
    <IconTile icon="fas fa-lock" tone="pink" size="lg" class="mb-6" />
    <h1 class="pf-type-h1 text-text-primary">{{ t.title }}</h1>
    <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.subtitle(username) }}</p>

    <PinCells v-model="pin" :label="t.title" :error="error" :disabled="locked" />

    <div class="d-flex align-center justify-space-between ga-2 mt-5 mb-4">
      <span class="pf-type-caption" :class="error || incomplete ? 'text-status-danger-fg' : 'text-text-tertiary'" aria-live="polite">
        {{ message }}
      </span>
      <router-link :to="{ name: 'admin-forgot-pin' }" class="pf-type-label-md text-text-link text-decoration-none">{{ t.forgot }}</router-link>
    </div>

    <AlertBox v-if="locked" tone="danger" :title="t.lockedTitle" icon="fas fa-lock" class="mb-4">
      {{ t.locked }}
      <router-link :to="{ name: 'admin-forgot-pin' }" class="d-block mt-2 pf-type-label-md text-text-link">
        {{ forgotPinText.lockedAction }}
      </router-link>
    </AlertBox>

    <PinKeypad
      :digits="digits"
      :clear-label="t.clear"
      :backspace-label="t.backspace"
      :disabled="locked"
      @digit="add"
      @clear="clear"
      @backspace="backspace"
    />

    <v-btn
      :color="locked ? 'bg-icon-muted' : 'bg-bg-inverse'"
      :height="size['control-lg']"
      :disabled="locked"
      block
      class="pf-type-label-lg mt-5 submit"
      @click="submit"
    >
      {{ t.submit }}
    </v-btn>

    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-5">
      <v-btn
        :to="{ name: 'admin-login' }"
        variant="text"
        color="text-text-link"
        prepend-icon="fas fa-chevron-left"
        class="pf-type-label-md px-2"
      >
        {{ t.back }}
      </v-btn>
      <span class="pf-type-caption text-text-tertiary">{{ t.shuffled }}</span>
    </div>

    <AlertBox v-if="!locked" tone="warning" class="mt-6">{{ t.warning }}</AlertBox>
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

