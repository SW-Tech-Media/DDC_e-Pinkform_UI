<script setup>
// D04 · Admin / Login – Credentials (B-01) — ขั้นที่ 1 ของ 2FA (Flow 4 · TOR 4.1.11, 6.7 MFA)
// กรณียกเว้น: รหัสผ่านผิด (แจ้งจำนวนครั้งที่เหลือ) · ผิดครบ 5 ครั้ง = ระงับบัญชีชั่วคราว ติดต่อผู้ดูแลระบบ · เรียก API ไม่สำเร็จ
// จำลอง: รหัสผ่านถูก = "prototype1" รหัสอื่น = ผิด · ชื่อผู้ใช้ "offline.demo" = ระบบขัดข้อง (ดู mocks/auth.js)
// query ?state=suspended = เปิดหน้าบัญชีถูกระงับ · ?notice=activated | password-reset = แจ้งผลหลังตั้งรหัสผ่าน
// จำนวนครั้ง / การระงับ backend เป็นผู้นับและตัดสิน หน้าจอแสดงตาม response เท่านั้น (สมมติฐานค่า 5 ครั้งรอ Q-20)
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import PasswordField from "@/components/auth/PasswordField.vue";
import { authText } from "@/content/auth.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { authApi } from "@/api/auth.js";
import { useSessionStore } from "@/stores/session.js";

const t = authText.login;
const route = useRoute();
const router = useRouter();
const session = useSessionStore();

// ค่าตัวอย่างตาม Figma (มาจากหน้าตั้งรหัสผ่าน = ไม่เติมรหัสผ่านให้ ผู้ใช้กรอกรหัสที่เพิ่งตั้งเอง)
const username = ref(session.pendingUsername || staff.somrudee.username);
const password = ref(route.query.notice ? "" : "prototype1");
const remember = ref(true);
const loading = ref(false);
// '' | 'required' | 'invalid' | 'network'
const error = ref("");
const attemptsLeft = ref(null);
const suspended = ref(route.query.state === "suspended");
const notice = computed(() => (error.value ? "" : t.notice[route.query.notice] ?? ""));
const suspendedName = computed(() => username.value.trim() || staff.somrudee.username);

watch([username, password], () => {
  if (error.value === "required") error.value = "";
});

const submit = async () => {
  if (loading.value) return;
  if (!username.value.trim() || !password.value) return (error.value = "required");
  loading.value = true;
  try {
    await authApi.login({ username: username.value.trim(), password: password.value });
    error.value = "";
    session.startLogin(username.value.trim());
    router.push({ name: "admin-pin" });
  } catch (e) {
    // รหัสผ่านผิด / ระงับ = ล้างช่องรหัสผ่าน · ระบบขัดข้อง = เก็บค่าไว้ให้กด "ลองใหม่" ได้ทันที
    if (e.code !== "NETWORK") password.value = "";
    if (e.code === "ACCOUNT_SUSPENDED") suspended.value = true;
    else if (e.code === "INVALID_CREDENTIALS") {
      error.value = "invalid";
      attemptsLeft.value = e.data.attemptsLeft;
    } else error.value = "network";
  } finally {
    loading.value = false;
  }
};

// ออกจากหน้าบัญชีถูกระงับ → ฟอร์มว่างสำหรับบัญชีอื่น
const useOtherAccount = () => {
  username.value = "";
  password.value = "";
  error.value = "";
  attemptsLeft.value = null;
  suspended.value = false;
  if (route.query.state) router.replace({ query: { ...route.query, state: undefined } });
};

// ส่งชื่อผู้ใช้ที่กรอกไว้ให้หน้าลืมรหัสผ่าน (ไม่ใส่ใน URL)
const forgot = () => {
  session.pendingUsername = username.value.trim();
  router.push({ name: "admin-forgot-password" });
};
</script>

<template>
  <AuthLayout>
    <StepIndicator :steps="authText.loginSteps" :current="0" compact class="mb-8" />

    <!-- บัญชีถูกระงับชั่วคราว (กรอกรหัสผ่านผิดครบ 5 ครั้ง) -->
    <template v-if="suspended">
      <IconTile icon="fas fa-user-lock" tone="red" size="lg" class="mb-6" />
      <h1 class="pf-type-h2 text-text-primary">{{ t.suspended.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.suspended.subtitle(suspendedName) }}</p>

      <AlertBox tone="danger" icon="fas fa-ban" class="mb-4">{{ t.suspended.reason }}</AlertBox>
      <AlertBox tone="info" icon="fas fa-headset" :title="t.suspended.contactTitle" class="mb-5">
        {{ t.suspended.contact }}
      </AlertBox>
      <ul class="plain-list d-flex flex-column ga-3 pa-4 rounded-lg pf-bordered bg-bg-surface-muted mb-6">
        <li v-for="item in t.suspended.items" :key="item" class="d-flex align-start ga-2 pf-type-body-sm text-text-primary">
          <v-icon icon="fas fa-circle-info" color="icon-muted" size="x-small" class="mt-1" />
          {{ item }}
        </li>
      </ul>

      <v-btn color="bg-bg-inverse" :height="size['control-lg']" block class="pf-type-label-lg" @click="useOtherAccount">
        {{ t.suspended.other }}
      </v-btn>
    </template>

    <template v-else>
      <h1 class="pf-type-h1 text-text-primary">{{ t.title }}</h1>
      <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.subtitle }}</p>

      <v-form @submit.prevent="submit">
        <AlertBox v-if="notice" tone="success" icon="far fa-circle-check" class="mb-4">{{ notice }}</AlertBox>
        <AlertBox v-if="error === 'required'" tone="danger" class="mb-4">{{ t.required }}</AlertBox>
        <AlertBox v-else-if="error === 'invalid' && attemptsLeft === 1" tone="warning" :title="t.invalidLastTitle" class="mb-4">
          {{ t.invalidLast }}
        </AlertBox>
        <AlertBox v-else-if="error === 'invalid'" tone="danger" class="mb-4">
          <span aria-live="polite">{{ t.invalid(attemptsLeft) }}</span>
        </AlertBox>
        <AlertBox v-else-if="error === 'network'" tone="danger" icon="fas fa-plug-circle-xmark" :title="t.networkTitle" class="mb-4">
          {{ t.network }}
          <template #aside>
            <v-btn variant="text" color="text-text-link" size="small" class="pf-type-label-md" :loading="loading" @click="submit">
              {{ t.retry }}
            </v-btn>
          </template>
        </AlertBox>

        <FieldLabel :label="t.username" for="login-username" />
        <v-text-field
          id="login-username"
          v-model="username"
          :placeholder="t.usernamePlaceholder"
          :error="error === 'invalid'"
          prepend-inner-icon="far fa-user"
          autocomplete="username"
          hide-details
          class="mb-5"
        />

        <FieldLabel :label="t.password" for="login-password" />
        <PasswordField
          id="login-password"
          v-model="password"
          :placeholder="t.passwordPlaceholder"
          :error="error === 'invalid'"
          autocomplete="current-password"
        />

        <div class="d-flex align-center justify-space-between flex-wrap ga-2 my-4">
          <v-checkbox
            v-model="remember"
            :label="t.remember"
            color="bg-bg-inverse"
            density="compact"
            hide-details
            class="flex-grow-0 remember"
          />
          <a href="#" class="pf-type-label-md text-text-link text-decoration-none" @click.prevent="forgot">{{ t.forgot }}</a>
        </div>

        <v-btn type="submit" color="bg-bg-inverse" :height="size['control-lg']" :loading="loading" block class="pf-type-label-lg">
          {{ t.submit }}
          <v-icon icon="fas fa-chevron-right" size="x-small" end class="text-text-on-inverse-muted" />
        </v-btn>
      </v-form>
    </template>

    <p class="pf-type-caption text-text-tertiary text-center mt-6">{{ t.footnote }}</p>
  </AuthLayout>
</template>

<style scoped>
.plain-list {
  list-style: none;
}
.remember :deep(.v-label) {
  opacity: 1;
  color: rgb(var(--v-theme-text-primary));
}
</style>
