<script setup>
// ช่อง PIN 6 ช่อง แสดงเป็นจุด (Figma: Form/PIN Cell) — ช่องที่กรอกแล้วพื้นเทาอมเขียว, ช่องปัจจุบันมีกรอบ focus
// input = มีช่องรับค่าจากคีย์บอร์ดซ่อนอยู่ (D06) · ถ้าไม่ใส่ ให้หน้าจอส่งค่าเข้ามาเอง (D05 ใช้แป้นตัวเลข)
import { computed, ref } from "vue";
import { PIN_LENGTH, sanitizePin } from "@/utils/pin.js";

const model = defineModel({ type: String, default: "" });
const props = defineProps({
  label: { type: String, default: "" },
  id: { type: String, default: undefined },
  input: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  error: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
});

const focused = ref(false);
const showCurrent = computed(() => !props.disabled && (props.input ? focused.value : props.active));
const cellClass = (i) => {
  if (props.error) return "cell--error";
  if (i < model.value.length) return "cell--filled bg-accent-teal-subtle";
  if (i === model.value.length && showCurrent.value) return "cell--current";
  return "";
};
const onInput = (e) => {
  const v = sanitizePin(e.target.value);
  e.target.value = v;
  model.value = v;
};
</script>

<template>
  <div class="pin position-relative d-flex justify-space-between ga-2" :aria-label="label" role="group">
    <span
      v-for="i in PIN_LENGTH"
      :key="i"
      class="cell d-flex align-center justify-center rounded"
      :class="cellClass(i - 1)"
      aria-hidden="true"
    >
      <span v-if="i - 1 < model.length" class="dot rounded-circle bg-text-primary" />
    </span>
    <input
      v-if="input"
      :id="id"
      :value="model"
      :disabled="disabled"
      :aria-label="label"
      class="pin__input"
      type="password"
      inputmode="numeric"
      autocomplete="one-time-code"
      :maxlength="PIN_LENGTH"
      :autofocus="autofocus"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
    />
  </div>
</template>

<style scoped>
.cell {
  flex: 0 1 calc(var(--pf-size-control-lg) + var(--pf-space-8));
  height: var(--pf-space-64);
  min-width: 0;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  transition: border-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.cell--filled,
.cell--current {
  border: calc(var(--pf-stroke-default) * 2) solid rgb(var(--v-theme-text-brand));
}
.cell--error {
  border: calc(var(--pf-stroke-default) * 2) solid rgb(var(--v-theme-error));
}
.dot {
  width: var(--pf-space-12);
  height: var(--pf-space-12);
}
.pin__input {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  caret-color: transparent;
}
</style>
