<script setup>
// กล่องแจ้งเตือน / ข้อมูล (Figma: Alert ในหน้า D05, D07, D10, D11, D14, D17)
import { computed } from "vue";
import { alertIcons, badgeTones } from "@/design/tones.js";

const props = defineProps({
  tone: { type: String, default: "info", validator: (v) => v in badgeTones },
  title: { type: String, default: "" },
  icon: { type: String, default: "" },
});

const bg = computed(() => `bg-${badgeTones[props.tone][0]}`);
const fg = computed(() => badgeTones[props.tone][1]);
</script>

<template>
  <div class="d-flex align-start ga-3 pa-4 rounded-lg" :class="bg" role="status">
    <v-icon :icon="icon || alertIcons[tone]" :color="fg" size="small" class="mt-1" />
    <div class="flex-grow-1">
      <div v-if="title" class="pf-type-body-sm-strong" :class="`text-${fg}`">{{ title }}</div>
      <div class="pf-type-body-sm" :class="title ? 'text-text-secondary' : `text-${fg}`">
        <slot />
      </div>
    </div>
    <slot name="aside" />
  </div>
</template>
