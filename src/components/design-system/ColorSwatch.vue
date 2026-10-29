<script setup>
// ช่องสีหนึ่ง Token — คลิกเพื่อคัดลอกชื่อ Token
// contrast: { ratio, on } = ค่า Contrast เทียบกับพื้น on (ชื่อ Token พื้น)
import { computed } from "vue";

const props = defineProps({
  token: { type: String, required: true },
  hex: { type: String, required: true },
  contrast: { type: Object, default: null },
  hint: { type: String, default: "" },
});
defineEmits(["copy"]);

const passes = computed(() => props.contrast && props.contrast.ratio >= 4.5);
</script>

<template>
  <button type="button" class="swatch pf-bordered rounded-lg bg-surface text-start w-100" :title="hint" @click="$emit('copy', token)">
    <span class="swatch__color d-flex align-end pa-2 pf-bordered-bottom" :class="`bg-${token}`">
      <span
        v-if="contrast"
        class="pf-type-caption-strong px-2 rounded-pill"
        :class="passes ? 'bg-status-success-bg text-status-success-fg' : 'bg-status-warning-bg text-status-warning-fg'"
      >
        {{ contrast.ratio }}:1 · {{ contrast.on }}
      </span>
    </span>
    <span class="d-flex flex-column pa-3">
      <span class="pf-type-label-sm text-text-primary text-truncate">{{ token }}</span>
      <span class="pf-type-caption text-text-tertiary">{{ hex }}</span>
    </span>
  </button>
</template>

<style scoped>
.swatch {
  overflow: hidden;
  transition: border-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.swatch:hover {
  border-color: rgb(var(--v-theme-border-focus));
}
.swatch__color {
  height: var(--pf-space-64);
}
</style>
