<script setup>
// ขั้นตอนแนวนอน (Figma: Stepper/Step, Stepper/Inline Step)
// steps: [{ label, caption? }]  current: index ของขั้นปัจจุบัน (ขั้นก่อนหน้า = เสร็จแล้ว)
// complete = ทุกขั้นเสร็จ
defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, default: 0 },
  complete: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
});

const state = (i, current, complete) => (complete || i < current ? "done" : i === current ? "current" : "todo");
const dotClass = {
  done: "bg-success text-text-on-inverse",
  current: "bg-accent text-text-on-inverse",
  todo: "bg-bg-subtle text-text-tertiary",
};
const labelClass = { done: "text-status-success-fg", current: "text-text-primary", todo: "text-text-tertiary" };
</script>

<template>
  <ol class="steps d-flex" :class="compact ? 'align-center ga-3' : 'align-start'">
    <template v-for="(s, i) in steps" :key="s.label">
      <li
        class="d-flex"
        :class="compact ? 'align-center ga-2' : 'step flex-column align-center text-center flex-grow-1'"
      >
        <span
          class="dot d-flex align-center justify-center rounded-circle pf-type-label-sm"
          :class="dotClass[state(i, current, complete)]"
        >
          <v-icon v-if="state(i, current, complete) === 'done'" icon="fas fa-check" size="x-small" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span :class="[compact ? 'pf-type-label-md' : 'pf-type-label-sm mt-2', labelClass[state(i, current, complete)]]">
          {{ s.label }}
        </span>
        <span v-if="s.caption && !compact" class="pf-type-caption text-text-tertiary">{{ s.caption }}</span>
      </li>
      <li
        v-if="i < steps.length - 1"
        aria-hidden="true"
        class="connector"
        :class="[compact ? 'connector--compact' : '', complete || i < current ? 'bg-success' : 'bg-border-default']"
      />
    </template>
  </ol>
</template>

<style scoped>
.steps {
  list-style: none;
}
.step {
  flex-basis: 0;
  min-width: 0;
}
.dot {
  width: var(--pf-size-control-sm);
  height: var(--pf-size-control-sm);
  flex-shrink: 0;
}
.connector {
  flex: 1 1 0;
  height: var(--pf-space-2);
  margin-top: calc(var(--pf-size-control-sm) / 2 - var(--pf-space-2) / 2);
  min-width: var(--pf-space-12);
}
.connector--compact {
  margin-top: 0;
  max-width: calc(var(--pf-space-64));
}
</style>
