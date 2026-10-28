<script setup>
// ตารางสิทธิ์ เมนู × การกระทำ (D15 แผงขวา) — modelValue: { [menuKey]: [ดู, เพิ่ม, แก้ไข, ลบ, อนุมัติ] }
// เอาสิทธิ์ "ดู" ออก = เอาสิทธิ์อื่นของเมนูนั้นออกด้วย / ให้สิทธิ์อื่น = ให้สิทธิ์ "ดู" อัตโนมัติ
defineProps({
  menus: { type: Array, required: true },
  actions: { type: Array, required: true },
  menuLabel: { type: String, required: true },
});
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
        <tr v-for="m in menus" :key="m.key">
          <td class="pf-type-body-sm text-text-primary">{{ m.label }}</td>
          <td v-for="(a, i) in actions" :key="a.key" class="text-center">
            <v-checkbox-btn
              :model-value="model[m.key][i]"
              color="primary"
              base-color="border-strong"
              density="compact"
              class="justify-center"
              :aria-label="`${m.label} · ${a.label}`"
              @update:model-value="toggle(m.key, i, $event)"
            />
          </td>
        </tr>
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
