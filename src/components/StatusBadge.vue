<script setup>
// Badge สถานะ (Figma: Status) — สีตาม tone จาก Design Token
defineProps({
  tone: {
    type: String,
    default: "neutral",
    validator: (v) => ["success", "warning", "danger", "info", "neutral"].includes(v),
  },
  dot: { type: Boolean, default: false },
});
</script>

<template>
  <v-chip
    size="small"
    variant="flat"
    rounded="pill"
    class="pf-type-caption-strong"
    :class="[`bg-status-${tone}-bg`, `text-status-${tone}-fg`]"
  >
    <v-icon v-if="dot" icon="fas fa-circle" size="x-small" start />
    <slot />
  </v-chip>
</template>
