<script setup>
// Layout Back Office (Figma: Web/Sidebar + Web/Topbar) — Sidebar 264 / Topbar 72 / body padding 32
// breadcrumb: [{ title, to? }]
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import AppBrand from "@/components/AppBrand.vue";
import SidebarItem from "@/components/SidebarItem.vue";
import { adminNav, adminText } from "@/content/navigation.js";
import { common } from "@/content/common.js";
import { badges } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";
import { useReviewStore } from "@/stores/review.js";
import { requests } from "@/mocks/requests.js";

defineProps({
  breadcrumb: { type: Array, default: () => [] },
});

const session = useSessionStore();
const review = useReviewStore();
// badge คำขอใบรับรองฯ = จำนวนคำขอที่รอพิจารณาอยู่ขณะนี้
const navBadges = computed(() => ({ ...badges, requests: requests.filter((r) => review.statusOf(r.ref) === "pending").length }));
const router = useRouter();
const route = useRoute();
// เมนูยัง active เมื่ออยู่ในหน้าย่อย เช่น /admin/requests/PF… → "คำขอใบรับรองฯ" (ยกเว้นหน้าหลักที่ต้องตรงทุกตัว)
const isActive = (to) => {
  const path = router.resolve(to).path;
  return path === "/admin" ? route.path === path : route.path === path || route.path.startsWith(`${path}/`);
};
const { mdAndUp } = useDisplay();
const drawer = defineModel("drawer", { type: Boolean, default: null });
const crumbClass = computed(() => "pa-0 pf-type-body-sm-strong");

// Sidebar แสดงเฉพาะเมนูที่บัญชีปัจจุบันมีสิทธิ์ "ดู" (กลุ่มที่ไม่เหลือเมนูถูกซ่อนทั้งกลุ่ม)
const nav = computed(() =>
  adminNav
    .map((section) => ({ ...section, items: section.items.filter((item) => session.can(item.key)) }))
    .filter((section) => section.items.length)
);
// สิทธิ์เปลี่ยนขณะอยู่ในหน้า (สลับบทบาท / Admin แก้สิทธิ์ของตัวเอง) → ไปหน้าไม่มีสิทธิ์ทันที
watch(
  () => !!route.meta.permission && !session.can(route.meta.permission),
  (denied) => denied && router.replace({ name: "admin-forbidden", query: { menu: route.meta.permission } }),
  { immediate: true }
);

// สลับบทบาทสาธิต (เฉพาะ Prototype)
const demo = adminText.demo;
const snack = reactive({ show: false, text: "" });
const switchTo = (account) => {
  if (session.useAccount(account.username)) Object.assign(snack, { show: true, text: demo.switched(account.label) });
};
const resetDemo = () => {
  session.resetAccount();
  Object.assign(snack, { show: true, text: demo.switched(demo.figma) });
};
const isCurrent = (username) => session.pinned && session.accountUsername === username;

const logout = () => {
  session.resetAccount();
  router.push({ name: "admin-login" });
};
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="mdAndUp"
    :width="size.sidebar"
    class="sidebar bg-bg-inverse"
    border="0"
  >
    <!-- Figma: Web/Sidebar — Brand (24/20) · Menu (16/8, ระยะเมนู 2) · Footer (24/16) -->
    <div class="px-6 py-5 pf-bordered-bottom sidebar__brand">
      <router-link :to="{ name: 'admin-home' }" class="text-decoration-none">
        <AppBrand inverse size="sm" />
      </router-link>
    </div>
    <nav class="sidebar__menu d-flex flex-column px-4 py-2">
      <template v-for="section in nav" :key="section.group">
        <div class="pf-type-caption text-text-on-inverse-muted px-4 pt-3 pb-1">{{ section.group }}</div>
        <SidebarItem
          v-for="item in section.items"
          :key="item.title"
          :to="item.to"
          :icon="item.icon"
          :label="item.title"
          :badge="item.badge ? navBadges[item.badge] : null"
          :active="isActive(item.to)"
        />
      </template>
    </nav>
    <template #append>
      <div class="px-6 py-4 pf-type-caption text-text-on-inverse-muted pf-bordered-top sidebar__footer">
        {{ common.version }} · {{ common.division }}
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar :height="size.topbar" flat color="surface" class="pf-bordered-bottom">
    <div class="d-flex align-center w-100 ga-2 ga-md-4 px-4 px-md-8 min-w-0">
      <v-app-bar-nav-icon v-if="!mdAndUp" icon="fas fa-bars" @click="drawer = !drawer" />
      <v-breadcrumbs :items="breadcrumb" :class="crumbClass" class="topbar__crumbs flex-grow-1 min-w-0 text-text-secondary">
        <template #divider>/</template>
      </v-breadcrumbs>
      <v-text-field
        v-if="mdAndUp"
        :placeholder="adminText.searchPlaceholder"
        prepend-inner-icon="fas fa-magnifying-glass"
        density="compact"
        hide-details
        class="topbar__search flex-grow-0"
      />
      <v-btn icon variant="outlined" color="border-default" size="small" :aria-label="adminText.notifications">
        <v-badge dot color="accent">
          <v-icon icon="far fa-bell" color="icon-default" size="small" />
        </v-badge>
      </v-btn>
      <v-menu>
        <template #activator="{ props }">
          <button v-bind="props" class="d-flex align-center ga-3 text-start">
            <v-avatar color="accent-teal-subtle" :size="size['avatar-md']" class="pf-type-label-md text-text-brand">
              {{ session.user.initials }}
            </v-avatar>
            <span v-if="mdAndUp">
              <span class="d-block pf-type-label-md text-text-primary">{{ session.user.name }}</span>
              <span class="d-block pf-type-caption text-text-tertiary">{{ session.user.role }}</span>
            </span>
            <v-icon icon="fas fa-chevron-down" size="x-small" color="icon-default" />
          </button>
        </template>
        <v-list density="compact" class="topbar__menu">
          <v-list-subheader class="pf-type-caption-strong text-text-tertiary">{{ demo.title }}</v-list-subheader>
          <v-list-item
            v-for="a in demo.accounts"
            :key="a.username"
            :title="a.label"
            :active="isCurrent(a.username)"
            color="primary"
            prepend-icon="far fa-user"
            @click="switchTo(a)"
          />
          <v-list-item :title="demo.figma" :active="!session.pinned" color="primary" prepend-icon="far fa-images" @click="resetDemo" />
          <v-divider class="my-1" />
          <v-list-item prepend-icon="fas fa-right-from-bracket" :title="adminText.logout" @click="logout" />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <v-main class="bg-background">
    <div class="pa-4 pa-md-8">
      <slot />
    </div>
  </v-main>

  <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
    <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
    {{ snack.text }}
  </v-snackbar>
</template>

<style scoped>
.sidebar__brand,
.sidebar__footer {
  border-color: rgb(var(--v-theme-border-inverse)) !important;
}
.sidebar__menu {
  gap: var(--pf-space-2);
}
.topbar__crumbs {
  overflow: hidden;
  flex-wrap: nowrap;
}
.topbar__crumbs :deep(.v-breadcrumbs-item--disabled) {
  opacity: 1;
  color: rgb(var(--v-theme-text-primary));
}
.topbar__search {
  width: var(--pf-size-desktop-search);
}
</style>
