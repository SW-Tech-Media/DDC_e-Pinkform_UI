<script setup>
// ภาพประกอบใบรับรองจำลอง + การ์ดลอย (Figma D01 › Hero) — วาดด้วย CSS ไม่ใช้รูปภาพ
// text: { certTitle: [], signed, signer, issued: { title, caption }, nsw: { title, caption } }
defineProps({
  text: { type: Object, required: true },
});
</script>

<template>
  <div class="illus position-relative" aria-hidden="true">
    <div class="cert bg-accent-pink-subtle rounded-lg pa-6">
      <div class="d-flex align-center ga-3">
        <div class="cert__seal bg-accent rounded-sm d-flex align-center justify-center">
          <v-icon icon="fas fa-shield-halved" size="x-small" class="text-text-on-inverse" />
        </div>
        <div class="pf-type-label-sm text-text-primary">
          <div v-for="line in text.certTitle" :key="line">{{ line }}</div>
        </div>
      </div>
      <div class="cert__rule bg-accent mt-2 mb-4" />
      <div class="cert__line bg-chart-series-2 mb-3" style="--w: 92%" />
      <div class="cert__line bg-chart-series-2 mb-3" style="--w: 68%" />
      <div class="cert__line bg-chart-series-2 mb-3" style="--w: 80%" />
      <div class="cert__line bg-chart-series-2 mb-4" style="--w: 56%" />
      <div class="d-flex ga-2 mb-4">
        <div v-for="i in 3" :key="i" class="cert__block bg-chart-series-2 rounded-sm flex-grow-1" />
      </div>
      <div class="d-flex align-end justify-space-between">
        <div class="cert__stamp rounded-sm" />
        <div class="text-end">
          <div class="pf-type-h4 text-text-accent">{{ text.signed }}</div>
          <div class="pf-type-caption text-text-secondary">{{ text.signer }}</div>
        </div>
      </div>
    </div>

    <div class="float float--issued bg-surface rounded-lg d-flex align-center ga-3 px-4 py-3">
      <div class="float__icon bg-accent-green-subtle rounded-sm d-flex align-center justify-center">
        <v-icon icon="fas fa-check" color="status-success-fg" size="x-small" />
      </div>
      <div>
        <div class="pf-type-label-sm text-text-primary">{{ text.issued.title }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ text.issued.caption }}</div>
      </div>
    </div>

    <div class="float float--nsw bg-surface rounded-lg d-flex align-center ga-3 px-4 py-3">
      <div class="float__icon bg-accent-teal-subtle rounded-circle d-flex align-center justify-center">
        <v-icon icon="fas fa-globe" color="icon-brand" size="x-small" />
      </div>
      <div>
        <div class="pf-type-label-md text-text-primary">{{ text.nsw.title }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ text.nsw.caption }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.illus {
  height: calc(var(--pf-space-120) * 2 + var(--pf-space-80));
}
.cert {
  position: absolute;
  top: 0;
  right: 0;
  width: calc(var(--pf-space-120) * 2 + var(--pf-space-64));
  transform: rotate(4deg);
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-accent));
  box-shadow: var(--pf-shadow-modal);
}
.cert__seal {
  width: var(--pf-space-24);
  height: var(--pf-space-24);
  flex-shrink: 0;
}
.cert__rule {
  height: var(--pf-space-2);
}
.cert__line {
  width: var(--w);
  height: var(--pf-space-6);
  border-radius: var(--pf-radius-full);
  opacity: 0.7;
}
.cert__block {
  height: var(--pf-space-24);
  opacity: 0.7;
}
.cert__stamp {
  width: var(--pf-space-40);
  height: var(--pf-space-40);
  border: var(--pf-stroke-default) dashed rgb(var(--v-theme-border-accent));
}
.float {
  position: absolute;
  box-shadow: var(--pf-shadow-modal);
  min-width: calc(var(--pf-space-120) + var(--pf-space-80) + var(--pf-space-24));
}
.float--issued {
  top: var(--pf-space-24);
  left: 0;
}
.float--nsw {
  bottom: var(--pf-space-40);
  left: var(--pf-space-40);
}
.float__icon {
  width: var(--pf-space-32);
  height: var(--pf-space-32);
  flex-shrink: 0;
}
</style>
