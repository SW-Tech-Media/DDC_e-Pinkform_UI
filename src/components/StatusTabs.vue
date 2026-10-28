<script setup>
// แท็บพร้อมตัวนับ (Figma: Tab/Item) — tabs: [{ value, label, count? }]
defineProps({
  tabs: { type: Array, required: true },
});
const model = defineModel({ type: [String, Number], default: null });
</script>

<template>
  <v-tabs v-model="model" color="accent" slider-color="accent" density="comfortable" class="status-tabs">
    <v-tab v-for="t in tabs" :key="t.value" :value="t.value" class="pf-type-label-md">
      {{ t.label }}
      <span
        v-if="t.count !== undefined"
        class="pf-type-caption-strong ms-2 px-2 rounded-pill"
        :class="model === t.value ? 'bg-accent-pink-subtle text-text-accent' : 'bg-bg-subtle text-text-secondary'"
      >
        {{ t.count }}
      </span>
    </v-tab>
  </v-tabs>
</template>

<style scoped>
.status-tabs :deep(.v-tab:not(.v-tab--selected)) {
  color: rgb(var(--v-theme-text-secondary));
}
</style>
