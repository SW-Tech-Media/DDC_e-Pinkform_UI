<script setup>
// Badge สถานะ (Figma: Status) — สีตาม tone จาก Design Token
// tone: success | warning | danger | info | neutral | accent (ชมพู = สถานะปัจจุบัน / เน้น)
// wrap = ข้อความยาวตัดบรรทัดได้ (ใช้ในคอลัมน์ตารางที่จำกัดความกว้าง เช่น "รอการชำระเงิน BILLPAYMENT")
import { computed } from "vue";
import { badgeTones } from "@/design/tones.js";

const props = defineProps({
  tone: { type: String, default: "neutral", validator: (v) => v in badgeTones },
  dot: { type: Boolean, default: false },
  wrap: { type: Boolean, default: false },
});

const classes = computed(() => [
  `bg-${badgeTones[props.tone][0]}`,
  `text-${badgeTones[props.tone][1]}`,
  { "status-badge--wrap": props.wrap },
]);
</script>

<template>
  <v-chip size="small" variant="flat" rounded="pill" class="pf-type-caption-strong flex-shrink-0" :class="classes">
    <v-icon v-if="dot" icon="fas fa-circle" size="x-small" start />
    <slot />
  </v-chip>
</template>

<style scoped>
.status-badge--wrap {
  height: auto;
  min-height: var(--v-chip-height);
  max-width: 100%;
  white-space: normal;
  padding-block: var(--pf-space-2);
}
.status-badge--wrap :deep(.v-chip__content) {
  white-space: normal;
}
.status-badge--wrap :deep(.v-icon) {
  align-self: flex-start;
  margin-block-start: var(--pf-space-4);
}
</style>
