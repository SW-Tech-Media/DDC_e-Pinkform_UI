<script setup>
// แป้นตัวเลข 3×4 (Figma: Keypad) — digits = ลำดับตัวเลข 10 ตัว (สุ่มจากหน้าจอ) แถวล่าง: ล้าง · ตัวเลขสุดท้าย · ⌫
import { computed } from "vue";

const props = defineProps({
  digits: { type: Array, required: true },
  clearLabel: { type: String, required: true },
  backspaceLabel: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["digit", "clear", "backspace"]);

const keys = computed(() => [
  ...props.digits.slice(0, 9).map((d) => ({ type: "digit", value: d })),
  { type: "clear" },
  { type: "digit", value: props.digits[9] },
  { type: "backspace" },
]);
const press = (k) => (k.type === "digit" ? emit("digit", k.value) : emit(k.type));
</script>

<template>
  <div class="keypad">
    <v-btn
      v-for="(k, i) in keys"
      :key="i"
      :disabled="disabled"
      variant="outlined"
      block
      class="key"
      :class="k.type === 'digit' ? 'bg-surface pf-type-h3' : 'bg-bg-surface-muted pf-type-body-md text-text-secondary'"
      :aria-label="k.type === 'backspace' ? backspaceLabel : undefined"
      @click="press(k)"
    >
      <template v-if="k.type === 'digit'">{{ k.value }}</template>
      <template v-else-if="k.type === 'clear'">{{ clearLabel }}</template>
      <v-icon v-else icon="fas fa-delete-left" size="small" color="icon-default" />
    </v-btn>
  </div>
</template>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--pf-space-8);
}
.keypad .key.v-btn {
  height: calc(var(--pf-size-control-lg) + var(--pf-space-8));
}
.key {
  border-color: rgb(var(--v-theme-border-default));
  color: rgb(var(--v-theme-text-primary));
  letter-spacing: 0;
}
</style>
