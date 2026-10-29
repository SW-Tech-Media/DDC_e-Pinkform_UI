<script setup>
// หน้ารวมหน้าจอ Prototype — จัดกลุ่มตาม Flow ใน Figma (อ่านจาก router/screens.js)
import { computed } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { screenGroups, screens } from "@/router/screens.js";
import { prototypeText as t } from "@/content/home.js";

const groups = computed(() =>
  screenGroups.map((g) => ({ ...g, screens: screens.filter((x) => x.group === g.key) }))
);
const target = (x) => ({ name: x.name, params: x.example ?? {} });
</script>

<template>
  <PortalLayout>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="[{ title: t.home, to: { name: 'home' } }, { title: t.title }]" />
    <div class="pf-container px-4 px-md-6 py-10 d-flex flex-column ga-6">
      <AlertBox tone="info" :title="t.startTitle">
        {{ t.startText }}
        <template #aside>
          <v-btn color="primary" :to="{ name: 'portal-home' }" append-icon="fas fa-arrow-right">{{ t.start }}</v-btn>
        </template>
      </AlertBox>

      <SectionCard v-for="g in groups" :key="g.key" flush>
        <template #header>
          <div class="d-flex align-center ga-3">
            <IconTile :icon="g.icon" :tone="g.tone" />
            <h2 class="pf-type-h4 text-text-primary">{{ g.title }}</h2>
          </div>
        </template>
        <v-list class="py-0" lines="two">
          <v-list-item
            v-for="x in g.screens"
            :key="x.name"
            :to="target(x)"
            class="px-6 py-3 pf-bordered-bottom"
          >
            <template #prepend>
              <span class="code pf-type-label-sm text-text-tertiary me-4">{{ x.code }}</span>
            </template>
            <v-list-item-title class="pf-type-body-md-strong text-text-primary">{{ x.title }}</v-list-item-title>
            <v-list-item-subtitle class="pf-type-caption text-text-tertiary">{{ x.path }}</v-list-item-subtitle>
            <div v-if="x.hint" class="pf-type-caption text-text-secondary mt-1">{{ t.hint }} {{ x.hint }}</div>
            <template #append>
              <div class="d-flex align-center ga-2">
                <StatusBadge v-for="f in x.figma" :key="f" tone="info">{{ f }}</StatusBadge>
                <StatusBadge v-if="x.proposed" tone="accent">{{ t.proposed }}</StatusBadge>
                <StatusBadge v-if="!x.design" tone="neutral">{{ t.noDesign }}</StatusBadge>
                <v-icon icon="fas fa-chevron-right" size="x-small" color="icon-muted" class="ms-2" />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </SectionCard>
    </div>
  </PortalLayout>
</template>

<style scoped>
.code {
  min-width: var(--pf-space-64);
}
</style>
