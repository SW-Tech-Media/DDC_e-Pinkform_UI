<script setup>
// หน้าที่ยังไม่ได้จัดทำ — ข้อความมาจาก content/home.js ตามชื่อ route
import { computed } from "vue";
import { useRoute } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import EmptyState from "@/components/EmptyState.vue";
import { placeholders } from "@/content/home.js";

const route = useRoute();
const page = computed(() => placeholders[route.name]);
</script>

<template>
  <PortalLayout>
    <div class="pf-container px-4 px-md-6 py-12">
      <v-card class="pf-bordered">
        <EmptyState v-bind="page">
          <template #actions>
            <v-btn color="primary" prepend-icon="fas fa-arrow-left" :to="{ name: 'home' }">
              {{ placeholders.backLabel }}
            </v-btn>
          </template>
        </EmptyState>
      </v-card>
    </div>
  </PortalLayout>
</template>
