<script setup>
// แผง "ระบบลูกข่าย (Agent)" (D17)
import SectionCard from "@/components/SectionCard.vue";
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { pkiText } from "@/content/pki.js";

defineProps({
  agents: { type: Array, required: true },
});
const t = pkiText.agents;
</script>

<template>
  <SectionCard :title="t.title">
    <template #header>
      <StatusBadge tone="neutral">{{ t.tag }}</StatusBadge>
    </template>
    <div class="d-flex flex-column ga-3">
      <div v-for="a in agents" :key="a.id" class="d-flex align-center ga-4 pa-4 pf-bordered rounded-lg">
        <IconTile icon="fas fa-server" tone="teal" />
        <div class="flex-grow-1 min-w-0">
          <div class="pf-type-body-sm-strong text-text-primary">{{ a.name }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ t.synced(a.host, a.syncedAt) }}</div>
        </div>
        <StatusBadge :tone="a.online ? 'success' : 'danger'" dot>{{ a.online ? t.online : t.offline }}</StatusBadge>
      </div>
    </div>
    <p class="pf-type-caption text-text-tertiary mt-4">{{ t.standards }}</p>
  </SectionCard>
</template>
