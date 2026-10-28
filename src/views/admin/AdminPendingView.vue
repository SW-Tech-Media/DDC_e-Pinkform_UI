<script setup>
// หน้าหลังบ้านที่ยังไม่มีดีไซน์ใน Figma
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import EmptyState from "@/components/EmptyState.vue";
import { pendingText as t } from "@/content/home.js";

const route = useRoute();
</script>

<template>
  <AdminLayout :breadcrumb="[{ title: route.meta.title }]">
    <PageHeader :title="route.meta.title" />
    <v-card class="pf-bordered">
      <EmptyState :icon="t.icon" :tone="t.tone" :title="route.meta.title" :description="t.description">
        <template #actions>
          <v-btn color="primary" prepend-icon="fas fa-arrow-left" :to="{ name: 'prototype' }">{{ t.back }}</v-btn>
        </template>
      </EmptyState>
    </v-card>
  </AdminLayout>
</template>
