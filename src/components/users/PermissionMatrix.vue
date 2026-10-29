<script setup>
// ตารางสิทธิ์ เมนู × การกระทำ (D15 แผงขวา) — modelValue: { [menuKey]: [ดู, เพิ่ม, แก้ไข, ลบ, อนุมัติ] }
// เอาสิทธิ์ "ดู" ออก = เอาสิทธิ์อื่นของเมนูนั้นออกด้วย / ให้สิทธิ์อื่น = ให้สิทธิ์ "ดู" อัตโนมัติ
// menus: [{ key, label, group?, fixed? }] — group = แสดงหัวกลุ่มเมื่อกลุ่มเปลี่ยน · fixed = แก้ไม่ได้ (เช่น หน้าหลัก)
// disabled = ดูอย่างเดียว (ผู้แก้ไขไม่มีสิทธิ์แก้ผู้ใช้รายนี้)
import { computed } from "vue";

const props = defineProps({
  menus: { type: Array, required: true },
  actions: { type: Array, required: true },
  menuLabel: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});
// แทรกหัวกลุ่มก่อนเมนูแรกของแต่ละกลุ่ม
const rows = computed(() =>
  props.menus.flatMap((m, i) =>
    m.group && m.group !== props.menus[i - 1]?.group ? [{ header: m.group }, m] : [m]
  )
);
const model = defineModel({ type: Object, required: true });

const toggle = (menu, i, value) => {
  const row = [...model.value[menu]];
  row[i] = value;
  if (i === 0 && !value) row.fill(false);
  if (i > 0 && value) row[0] = true;
  model.value = { ...model.value, [menu]: row };
};
</script>

<template>
  <div class="matrix-wrap">
    <table class="matrix">
      <thead>
        <tr>
          <th class="text-start">{{ menuLabel }}</th>
          <th v-for="a in actions" :key="a.key">{{ a.label }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="m in rows" :key="m.key ?? m.header">
          <tr v-if="m.header" class="matrix__group">
            <td :colspan="actions.length + 1" class="pf-type-caption-strong text-text-tertiary">{{ m.header }}</td>
          </tr>
          <tr v-else>
            <td class="pf-type-body-sm text-text-primary">{{ m.label }}</td>
            <td v-for="(a, i) in actions" :key="a.key" class="text-center">
              <v-checkbox-btn
                :model-value="model[m.key][i]"
                color="primary"
                base-color="border-strong"
                density="compact"
                class="justify-center"
                :aria-label="`${m.label} · ${a.label}`"
                :disabled="disabled || m.fixed"
                @update:model-value="toggle(m.key, i, $event)"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.matrix-wrap {
  overflow-x: auto;
}
.matrix {
  width: 100%;
  border-collapse: collapse;
}
.matrix th {
  background: rgb(var(--v-theme-bg-surface-muted));
  color: rgb(var(--v-theme-text-secondary));
  font-size: var(--pf-type-caption-strong-size);
  line-height: var(--pf-type-caption-strong-line);
  font-weight: var(--pf-type-caption-strong-weight);
  padding: var(--pf-space-12) var(--pf-space-4);
  border-bottom: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
  white-space: nowrap;
}
.matrix td {
  padding: var(--pf-space-4);
  border-bottom: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.matrix__group td {
  background: rgb(var(--v-theme-bg-surface-muted));
  padding-block: var(--pf-space-8);
}
.matrix th:first-child,
.matrix td:first-child {
  padding-inline-start: var(--pf-space-12);
  min-width: calc(var(--pf-space-80) + var(--pf-space-16));
}
.matrix th:last-child,
.matrix td:last-child {
  padding-inline-end: var(--pf-space-12);
}
</style>
