<script setup>
// Layout หน้าฝั่ง Portal / หน้าแรก Prototype (Figma: Web/Header) — ปุ่มด้านขวาใส่ผ่าน slot "actions"
import AppBrand from "@/components/AppBrand.vue";
import { size } from "@/design/tokens.js";
</script>

<template>
  <v-app-bar :height="size['portal-header']" flat color="surface" class="pf-bordered-bottom">
    <div class="pf-container w-100 d-flex align-center justify-space-between ga-4 px-4 px-md-6">
      <router-link :to="{ name: 'home' }" class="text-decoration-none">
        <AppBrand />
      </router-link>
      <div class="d-flex align-center ga-2">
        <slot name="actions" />
      </div>
    </div>
  </v-app-bar>

  <v-main class="bg-background">
    <slot />
  </v-main>
</template>
