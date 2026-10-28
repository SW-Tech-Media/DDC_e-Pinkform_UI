<script setup>
// D04 · Admin / Login – Credentials (B-01)
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import { authText } from "@/content/auth.js";
import { staff } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

const t = authText.login;
const router = useRouter();
const session = useSessionStore();

// ค่าตัวอย่างตาม Figma
const username = ref(session.pendingUsername || staff.somrudee.username);
const password = ref("prototype1");
const showPassword = ref(false);
const remember = ref(true);
const error = ref(false);

const submit = () => {
  error.value = !username.value.trim() || !password.value;
  if (error.value) return;
  session.startLogin(username.value.trim());
  router.push({ name: "admin-pin" });
};
</script>

<template>
  <AuthLayout>
    <StepIndicator :steps="authText.loginSteps" :current="0" compact class="mb-8" />
    <h1 class="pf-type-h1 text-text-primary">{{ t.title }}</h1>
    <p class="pf-type-body-md text-text-secondary mt-1 mb-6">{{ t.subtitle }}</p>

    <v-form @submit.prevent="submit">
      <AlertBox v-if="error" tone="danger" class="mb-4">{{ t.required }}</AlertBox>

      <FieldLabel :label="t.username" for="login-username" />
      <v-text-field
        id="login-username"
        v-model="username"
        :placeholder="t.usernamePlaceholder"
        prepend-inner-icon="far fa-user"
        autocomplete="username"
        hide-details
        class="mb-5"
      />

      <FieldLabel :label="t.password" for="login-password" />
      <v-text-field
        id="login-password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="t.passwordPlaceholder"
        prepend-inner-icon="fas fa-lock"
        autocomplete="current-password"
        hide-details
      >
        <template #append-inner>
          <v-btn
            :icon="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"
            :aria-label="showPassword ? t.hidePassword : t.showPassword"
            variant="text"
            size="small"
            color="icon-muted"
            @click="showPassword = !showPassword"
          />
        </template>
      </v-text-field>

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 my-4">
        <v-checkbox
          v-model="remember"
          :label="t.remember"
          color="bg-bg-inverse"
          density="compact"
          hide-details
          class="flex-grow-0 remember"
        />
        <a href="#" class="pf-type-label-md text-text-link text-decoration-none" @click.prevent>{{ t.forgot }}</a>
      </div>

      <v-btn type="submit" color="bg-bg-inverse" :height="size['control-lg']" block class="pf-type-label-lg">
        {{ t.submit }}
        <v-icon icon="fas fa-chevron-right" size="x-small" end class="text-text-on-inverse-muted" />
      </v-btn>
    </v-form>

    <p class="pf-type-caption text-text-tertiary text-center mt-6">{{ t.footnote }}</p>
  </AuthLayout>
</template>

<style scoped>
.remember :deep(.v-label) {
  opacity: 1;
  color: rgb(var(--v-theme-text-primary));
}
</style>
