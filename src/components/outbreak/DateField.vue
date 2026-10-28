<script setup>
// ช่องเลือกวันที่ (แสดงรูปแบบ วว/ดด/ปปปป พ.ศ.) — ค่าเป็น ISO "2026-10-26" หรือ [เริ่ม, สิ้นสุด] เมื่อ range
import { computed, ref } from "vue";
import { formatDate } from "@/utils/format.js";

const props = defineProps({
  range: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  clearable: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  min: { type: String, default: undefined },
});
defineOptions({ inheritAttrs: false });
const model = defineModel({ type: [String, Array], default: null });
const open = ref(false);

const pad = (n) => String(n).padStart(2, "0");
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDate = (iso) => new Date(`${iso}T00:00:00`);

const display = computed(() => {
  if (!model.value || (Array.isArray(model.value) && !model.value.length)) return "";
  if (props.range) {
    const [a, b] = model.value;
    return b && b !== a ? `${formatDate(a)} – ${formatDate(b)}` : formatDate(a);
  }
  return formatDate(model.value);
});

const picker = computed({
  get() {
    if (!model.value) return props.range ? [] : null;
    if (!props.range) return toDate(model.value);
    const [a, b] = model.value;
    if (!b) return [toDate(a)];
    const days = [];
    for (let d = toDate(a); d <= toDate(b); d.setDate(d.getDate() + 1)) days.push(new Date(d));
    return days;
  },
  set(v) {
    if (!props.range) {
      model.value = v ? toIso(v) : null;
      open.value = false;
      return;
    }
    const list = (v ?? []).map(toIso).sort();
    model.value = list.length ? [list[0], list[list.length - 1]] : null;
    if (list.length > 1) open.value = false;
  },
});
</script>

<template>
  <v-menu v-model="open" :close-on-content-click="false" location="bottom start">
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="{ ...menuProps, ...$attrs }"
        :id="id"
        :model-value="display"
        :placeholder="placeholder"
        :clearable="clearable"
        prepend-inner-icon="far fa-calendar"
        readonly
        hide-details
        @click:clear="model = null"
      />
    </template>
    <v-date-picker
      v-model="picker"
      :multiple="range ? 'range' : false"
      :min="min"
      color="primary"
      show-adjacent-months
      hide-header
    />
  </v-menu>
</template>
