<script setup>
// หน้าฝั่ง Portal ที่ยังไม่มีดีไซน์ใน Figma
import { useRoute } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import EmptyState from "@/components/EmptyState.vue";
import { pendingText as t } from "@/content/home.js";

const route = useRoute();
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="route.meta.title" />
    <div class="pf-container px-4 px-md-6 py-10">
      <v-card class="pf-bordered">
        <EmptyState :icon="t.icon" :tone="t.tone" :title="route.meta.title" :description="t.description">
          <template #actions>
            <v-btn color="primary" prepend-icon="fas fa-arrow-left" :to="{ name: 'prototype' }">{{ t.back }}</v-btn>
          </template>
        </EmptyState>
      </v-card>
    </div>
  </PortalLayout>
</template>
