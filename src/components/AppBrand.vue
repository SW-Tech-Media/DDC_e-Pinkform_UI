<script setup>
// โลโก้ระบบ (Figma: Brand/Logo) — Mark ชมพู + Wordmark
// inverse = Tone "On Dark" (ใช้บนพื้นสีเข้ม) · size: lg | sm (Sidebar ใช้ sm)
import SvgIcon from "./SvgIcon.vue";

defineProps({
  subtitle: { type: String, default: "กรมควบคุมโรค กระทรวงสาธารณสุข" },
  inverse: { type: Boolean, default: false },
  size: { type: String, default: "lg", validator: (v) => ["lg", "sm"].includes(v) },
});
</script>

<template>
  <div class="d-flex align-center ga-3">
    <div class="brand-mark bg-accent d-flex align-center justify-center rounded-lg text-text-on-inverse">
      <SvgIcon name="shield-check" class="brand-mark__icon" />
    </div>
    <div class="brand-text">
      <div
        :class="[size === 'sm' ? 'pf-type-body-md-strong' : 'pf-type-h4', inverse ? 'text-text-on-inverse' : 'text-text-primary']"
      >
        DDC e-<span :class="inverse ? 'text-text-on-inverse-accent' : 'text-text-accent'">Pinkforms</span>
      </div>
      <div class="pf-type-caption" :class="inverse ? 'text-text-on-inverse-muted' : 'text-text-tertiary'">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-mark {
  flex-shrink: 0;
  width: var(--pf-size-icon-tile-md);
  height: var(--pf-size-icon-tile-md);
  box-shadow: var(--pf-shadow-brand);
}
.brand-mark__icon {
  width: var(--pf-size-icon-md);
  height: var(--pf-size-icon-md);
}
.brand-text {
  white-space: nowrap;
}
</style>
