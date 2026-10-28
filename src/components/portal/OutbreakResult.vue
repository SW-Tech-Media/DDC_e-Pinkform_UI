<script setup>
// กล่องผลการตรวจสอบพื้นที่ (Figma D03 / S02) — พบ = โทนแดง + ตัวเลขวันที่เหลือ · ไม่พบ = โทนเขียว
// result: { found, place, reported?, free?, days? } · text = outbreakText (content/portal.js) · compact = มือถือ
import { computed } from "vue";
import { badgeTones } from "@/design/tones.js";

const props = defineProps({
  result: { type: Object, required: true },
  text: { type: Object, required: true },
  freeDays: { type: Number, required: true },
  compact: { type: Boolean, default: false },
});

const tone = computed(() => (props.result.found ? "danger" : "success"));
const bg = computed(() => `bg-${badgeTones[tone.value][0]}`);
const fg = computed(() => badgeTones[tone.value][1]);
const icon = computed(() => (props.result.found ? "fas fa-triangle-exclamation" : "fas fa-circle-check"));
</script>

<template>
  <div class="result rounded-lg" :class="[bg, `result--${tone}`, compact ? 'pa-4' : 'pa-6']" role="status" aria-live="polite">
    <!-- มือถือ -->
    <template v-if="compact">
      <div class="d-flex align-center ga-3">
        <div class="result__icon bg-surface rounded-lg d-flex align-center justify-center">
          <v-icon :icon="icon" :color="fg" size="small" />
        </div>
        <div class="pf-type-body-md-strong" :class="`text-${fg}`">
          {{ result.found ? text.found.status : text.notFound.status }}
        </div>
      </div>
      <p class="pf-type-body-sm mt-3" :class="`text-${fg}`">{{ result.place }}</p>
      <p class="pf-type-body-sm" :class="`text-${fg}`">
        {{ result.found ? text.found.detailMobile(result.reported, result.free) : text.notFound.detail }}
      </p>
      <div v-if="result.found" class="bg-surface rounded-lg d-flex align-center justify-space-between px-4 py-3 mt-4">
        <span class="pf-type-caption text-text-secondary">{{ text.found.daysLabelMobile }}</span>
        <span class="pf-type-h3" :class="`text-${fg}`">{{ result.days }} {{ text.found.daysUnit }}</span>
      </div>
    </template>

    <!-- เดสก์ท็อป -->
    <div v-else class="d-flex align-center ga-5">
      <div class="result__icon result__icon--lg bg-surface rounded-lg d-flex align-center justify-center">
        <v-icon :icon="icon" :color="fg" />
      </div>
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-body-md-strong" :class="`text-${fg}`">
          {{ result.place }} — {{ result.found ? text.found.status : text.notFound.status }}
        </div>
        <div class="pf-type-body-sm" :class="`text-${fg}`">
          {{ result.found ? text.found.detail(result.reported, result.free, freeDays) : text.notFound.detail }}
        </div>
      </div>
      <div v-if="result.found" class="result__days bg-surface rounded-lg text-center px-5 py-3 flex-shrink-0">
        <div class="pf-type-h1" :class="`text-${fg}`">{{ result.days }}</div>
        <div class="pf-type-caption text-text-secondary">{{ text.found.daysLabel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  border: var(--pf-stroke-default) solid transparent;
}
.result--danger {
  border-color: rgb(var(--v-theme-border-accent));
}
.result--success {
  border-color: rgb(var(--v-theme-status-success-bg));
}
.result__icon {
  width: var(--pf-space-40);
  height: var(--pf-space-40);
  flex-shrink: 0;
}
.result__icon--lg {
  width: var(--pf-size-icon-tile-lg);
  height: var(--pf-size-icon-tile-lg);
}
.result__days {
  min-width: calc(var(--pf-space-80) + var(--pf-space-24));
}
</style>
