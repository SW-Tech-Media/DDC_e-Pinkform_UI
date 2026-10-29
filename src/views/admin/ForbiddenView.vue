<script setup>
// หน้าไม่มีสิทธิ์เข้าใช้งาน (403) — router guard ส่งมาพร้อม ?menu=<key> เมื่อบทบาทไม่มีสิทธิ์ดูเมนูนั้น
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import EmptyState from "@/components/EmptyState.vue";
import { forbiddenText as t } from "@/content/forbidden.js";
import { groups, permissionMenus, roles } from "@/mocks/users-roles.js";
import { useSessionStore } from "@/stores/session.js";

const route = useRoute();
const session = useSessionStore();
const menu = computed(() => permissionMenus.find((m) => m.key === route.query.menu)?.label ?? "");
const role = computed(() => {
  const a = session.account;
  return a ? `${roles[a.role].label} · ${groups[a.group]}` : session.user.role;
});
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <v-card class="pf-bordered">
      <EmptyState :icon="t.icon" :tone="t.tone" :title="t.title" :description="t.description(menu, role)">
        <template #actions>
          <v-btn color="primary" prepend-icon="fas fa-house" :to="{ name: 'admin-home' }">{{ t.home }}</v-btn>
        </template>
      </EmptyState>
    </v-card>
  </AdminLayout>
</template>
