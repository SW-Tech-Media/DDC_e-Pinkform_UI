<script setup>
// Layout ฝั่ง Portal (Figma: Web/Header + Web/Footer)
// portal = แสดงเมนู Portal, ปุ่มเข้าสู่ระบบเจ้าหน้าที่ และ Footer (หน้าแรก Prototype ไม่ใช้)
// ปุ่มด้านขวาเพิ่มเติมใส่ผ่าน slot "actions"
import { ref } from "vue";
import { useDisplay } from "vuetify";
import AppBrand from "@/components/AppBrand.vue";
import PortalFooter from "@/components/PortalFooter.vue";
import { portalNav, portalText } from "@/content/navigation.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  portal: { type: Boolean, default: false },
});

const { mdAndUp } = useDisplay();
const drawer = ref(false);
const home = props.portal ? { name: "portal-home" } : { name: "home" };
</script>

<template>
  <v-app-bar :height="size['portal-header']" flat color="surface" class="pf-bordered-bottom">
    <div class="pf-container w-100 d-flex align-center justify-space-between ga-4 px-4 px-md-6">
      <router-link :to="home" class="text-decoration-none">
        <AppBrand />
      </router-link>
      <nav v-if="portal && mdAndUp" class="d-flex ga-1">
        <v-btn
          v-for="item in portalNav"
          :key="item.title"
          :to="item.to"
          variant="text"
          class="pf-type-label-md text-text-secondary"
          active-class="portal-nav--active"
          exact
        >
          {{ item.title }}
        </v-btn>
      </nav>
      <div class="d-flex align-center ga-2">
        <slot name="actions" />
        <v-btn
          v-if="portal && mdAndUp"
          class="bg-bg-inverse text-text-on-inverse"
          prepend-icon="fas fa-lock"
          :to="{ name: 'admin-login' }"
        >
          {{ portalText.login }}
        </v-btn>
        <v-app-bar-nav-icon v-if="portal && !mdAndUp" icon="fas fa-bars" @click="drawer = !drawer" />
      </div>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-if="portal && !mdAndUp" v-model="drawer" location="right" temporary>
    <v-list nav>
      <v-list-item v-for="item in portalNav" :key="item.title" :to="item.to" :title="item.title" exact rounded="lg" />
      <v-list-item :to="{ name: 'admin-login' }" prepend-icon="fas fa-lock" :title="portalText.login" rounded="lg" />
    </v-list>
  </v-navigation-drawer>

  <v-main class="bg-background">
    <slot />
    <PortalFooter v-if="portal" />
  </v-main>
</template>

<style scoped>
.portal-nav--active {
  color: rgb(var(--v-theme-text-brand)) !important;
  background: rgb(var(--v-theme-accent-teal-subtle));
}
</style>
