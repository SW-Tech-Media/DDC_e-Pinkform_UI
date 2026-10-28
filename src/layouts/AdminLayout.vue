<script setup>
// Layout Back Office (Figma: Web/Sidebar + Web/Topbar) — Sidebar 264 / Topbar 72 / body padding 32
// breadcrumb: [{ title, to? }]
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import AppBrand from "@/components/AppBrand.vue";
import { adminNav, adminText } from "@/content/navigation.js";
import { common } from "@/content/common.js";
import { badges } from "@/mocks/users.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

defineProps({
  breadcrumb: { type: Array, default: () => [] },
});

const session = useSessionStore();
const router = useRouter();
const { mdAndUp } = useDisplay();
const drawer = defineModel("drawer", { type: Boolean, default: null });
const crumbClass = computed(() => "pa-0 pf-type-body-sm-strong");

const logout = () => router.push({ name: "admin-login" });
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="mdAndUp"
    :width="size.sidebar"
    class="sidebar bg-bg-inverse"
    border="0"
  >
    <div class="px-5 py-5 pf-bordered-bottom sidebar__brand">
      <router-link :to="{ name: 'admin-home' }" class="text-decoration-none">
        <AppBrand inverse />
      </router-link>
    </div>
    <nav class="px-3 py-4">
      <template v-for="section in adminNav" :key="section.group">
        <div class="pf-type-caption text-text-on-inverse-muted px-3 pt-4 pb-2">{{ section.group }}</div>
        <v-list density="compact" bg-color="transparent" class="pa-0" nav>
          <v-list-item
            v-for="item in section.items"
            :key="item.title"
            :to="item.to"
            rounded="lg"
            class="sidebar__item mb-1"
            active-class="sidebar__item--active"
          >
            <template #prepend>
              <v-icon :icon="item.icon" size="small" />
            </template>
            <v-list-item-title class="pf-type-body-sm">{{ item.title }}</v-list-item-title>
            <template v-if="item.badge" #append>
              <span class="pf-type-caption-strong bg-accent text-text-on-inverse rounded-pill px-2">
                {{ badges[item.badge] }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </nav>
    <template #append>
      <div class="px-5 py-4 pf-type-caption text-text-on-inverse-muted pf-bordered-top sidebar__footer">
        {{ common.version }} · {{ common.division }}
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar :height="size.topbar" flat color="surface" class="pf-bordered-bottom">
    <div class="d-flex align-center w-100 ga-4 px-4 px-md-8">
      <v-app-bar-nav-icon v-if="!mdAndUp" icon="fas fa-bars" @click="drawer = !drawer" />
      <v-breadcrumbs :items="breadcrumb" :class="crumbClass" class="flex-grow-1 text-text-secondary">
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
        <v-list density="compact">
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
</template>

<style scoped>
.sidebar__brand,
.sidebar__footer {
  border-color: rgb(var(--v-theme-border-inverse)) !important;
}
.sidebar__item {
  color: rgb(var(--v-theme-text-on-inverse-muted));
}
.sidebar__item:hover {
  background: rgb(var(--v-theme-bg-inverse-hover));
}
.sidebar__item--active {
  color: rgb(var(--v-theme-text-on-inverse));
  background: rgb(var(--v-theme-bg-inverse-active));
  box-shadow: inset var(--pf-space-4) 0 0 rgb(var(--v-theme-accent));
}
.sidebar__item--active :deep(.v-list-item-title) {
  font-weight: var(--pf-font-weight-semibold);
}
.sidebar__item :deep(.v-list-item__overlay) {
  display: none;
}
.topbar__search {
  width: var(--pf-size-desktop-search);
}
</style>
