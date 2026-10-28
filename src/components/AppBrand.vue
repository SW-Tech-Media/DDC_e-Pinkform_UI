<script setup>
// โลโก้ระบบ (Figma: Brand/Logo) — inverse = ใช้บนพื้นสีเข้ม
defineProps({
  subtitle: { type: String, default: "กรมควบคุมโรค กระทรวงสาธารณสุข" },
  inverse: { type: Boolean, default: false },
});
</script>

<template>
  <div class="d-flex align-center ga-3">
    <div class="brand-mark bg-accent d-flex align-center justify-center rounded-lg">
      <v-icon icon="fas fa-shield-halved" class="text-text-on-inverse" size="small" />
    </div>
    <div>
      <div class="pf-type-h4" :class="inverse ? 'text-text-on-inverse' : 'text-text-primary'">
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
  width: var(--pf-size-icon-tile-md);
  height: var(--pf-size-icon-tile-md);
  box-shadow: var(--pf-shadow-brand);
}
</style>
