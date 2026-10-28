<script setup>
// Badge สถานะ (Figma: Status) — สีตาม tone จาก Design Token
// tone: success | warning | danger | info | neutral | accent (ชมพู = สถานะปัจจุบัน / เน้น)
import { computed } from "vue";
import { badgeTones } from "@/design/tones.js";

const props = defineProps({
  tone: { type: String, default: "neutral", validator: (v) => v in badgeTones },
  dot: { type: Boolean, default: false },
});

const classes = computed(() => [`bg-${badgeTones[props.tone][0]}`, `text-${badgeTones[props.tone][1]}`]);
</script>

<template>
  <v-chip size="small" variant="flat" rounded="pill" class="pf-type-caption-strong flex-shrink-0" :class="classes">
    <v-icon v-if="dot" icon="fas fa-circle" size="x-small" start />
    <slot />
  </v-chip>
</template>
