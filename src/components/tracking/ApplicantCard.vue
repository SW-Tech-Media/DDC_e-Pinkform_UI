<script setup>
// การ์ด "ข้อมูลผู้ยื่นคำขอ" (Figma D12) + กล่องเส้นประตัวแทนออกของ (Profile ตัวแทน)
import { computed } from "vue";
import SectionCard from "@/components/SectionCard.vue";
import KeyValueRows from "@/components/review/KeyValueRows.vue";
import { trackingText } from "@/content/tracking.js";

const props = defineProps({
  applicant: { type: Object, required: true }, // { ref, businessType, taxId, branch, company }
  agent: { type: Object, default: null }, // { name, taxId, branch }
});
const t = trackingText.applicant;
const rows = computed(() => [
  { label: t.ref, value: props.applicant.ref },
  { label: t.businessType, value: props.applicant.businessType || t.empty },
  { label: t.taxId, value: props.applicant.taxId || t.empty },
  { label: t.branch, value: props.applicant.branch || t.empty },
  { label: t.company, value: props.applicant.company },
]);
</script>

<template>
  <SectionCard :title="t.title">
    <KeyValueRows :items="rows" />
    <div v-if="agent" class="agent rounded-lg pa-4 mt-6">
      <div class="pf-type-caption text-text-tertiary">{{ t.agentTitle }}</div>
      <div class="pf-type-body-sm-strong text-text-primary mt-1">{{ agent.name }}</div>
      <div class="pf-type-caption text-text-tertiary mt-1">{{ t.agentMeta(agent.taxId, agent.branch) }}</div>
    </div>
  </SectionCard>
</template>

<style scoped>
.agent {
  border: var(--pf-stroke-default) dashed rgb(var(--v-theme-border-strong));
  background: rgb(var(--v-theme-bg-surface-muted));
}
</style>
