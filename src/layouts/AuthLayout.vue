<script setup>
// Layout หน้าเข้าสู่ระบบ D04 – D06: แผงแบรนด์ด้านซ้าย + ฟอร์มด้านขวา
import AppBrand from "@/components/AppBrand.vue";
import { authText } from "@/content/auth.js";
</script>

<template>
  <v-main class="bg-surface">
    <div class="auth d-flex">
      <aside class="auth__brand bg-bg-inverse d-none d-md-flex flex-column justify-space-between pa-12">
        <AppBrand inverse />
        <div>
          <h1 class="pf-type-h2 text-text-on-inverse">{{ authText.panel.title }}</h1>
          <p class="pf-type-body-md text-text-on-inverse-muted mt-3">{{ authText.panel.description }}</p>
          <v-chip class="mt-6 pf-type-label-sm bg-bg-inverse-active text-text-on-inverse-accent" variant="flat">
            {{ authText.panel.badge }}
          </v-chip>
          <ul class="features mt-8 d-flex flex-column ga-4">
            <li v-for="f in authText.panel.features" :key="f.text" class="d-flex align-center ga-3">
              <span class="feature-icon d-flex align-center justify-center rounded-lg bg-bg-inverse-active">
                <v-icon :icon="f.icon" size="small" class="text-text-on-inverse-accent" />
              </span>
              <span class="pf-type-body-md text-text-on-inverse">{{ f.text }}</span>
            </li>
          </ul>
        </div>
        <p class="pf-type-caption text-text-on-inverse-muted">{{ authText.panel.copyright }}</p>
      </aside>
      <div class="flex-grow-1 d-flex align-center justify-center pa-6">
        <div class="auth__form w-100">
          <div class="d-md-none mb-8"><AppBrand /></div>
          <slot />
        </div>
      </div>
    </div>
  </v-main>
</template>

<style scoped>
.auth {
  min-height: 100vh;
}
.auth__brand {
  width: var(--pf-size-auth-panel);
  flex-shrink: 0;
}
.auth__form {
  max-width: calc(var(--pf-space-120) * 4);
}
.features {
  list-style: none;
}
.feature-icon {
  width: var(--pf-size-control-md);
  height: var(--pf-size-control-md);
}
</style>
